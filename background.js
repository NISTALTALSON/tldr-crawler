// TL;DR Crawler - background service worker (MV3)
'use strict';

const API_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

// Toolbar click: inject (or toggle off) the crawler in the current tab.
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || tab.id == null) return;
  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
  } catch (e) {
    // Restricted pages (chrome://, Web Store, PDF viewer...) cannot be scripted.
    try {
      await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#ff4f7a' });
      await chrome.action.setBadgeText({ tabId: tab.id, text: 'X' });
      setTimeout(() => chrome.action.setBadgeText({ tabId: tab.id, text: '' }).catch(() => {}), 1800);
    } catch (_) {}
  }
});

async function callClaude({ system, prompt, maxTokens }) {
  const { apiKey, model } = await chrome.storage.local.get(['apiKey', 'model']);
  if (!apiKey) return { ok: false, error: 'no-key' };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 45000);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        max_tokens: Math.min(Math.max(parseInt(maxTokens, 10) || 512, 16), 4096),
        system: typeof system === 'string' ? system : undefined,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: ctrl.signal
    });
    if (!res.ok) return { ok: false, error: 'http-' + res.status };
    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b && b.type === 'text')
      .map((b) => b.text)
      .join('');
    return text ? { ok: true, text } : { ok: false, error: 'empty' };
  } catch (e) {
    return { ok: false, error: 'network' };
  } finally {
    clearTimeout(timer);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!sender || sender.id !== chrome.runtime.id || !msg || typeof msg !== 'object') return false;

  if (msg.type === 'status') {
    chrome.storage.local.get(['apiKey']).then(
      ({ apiKey }) => sendResponse({ hasKey: !!apiKey }),
      () => sendResponse({ hasKey: false })
    );
    return true;
  }

  if (msg.type === 'claude' && typeof msg.prompt === 'string' && msg.prompt.length < 80000) {
    callClaude(msg).then(sendResponse, () => sendResponse({ ok: false, error: 'failed' }));
    return true;
  }

  return false;
});
