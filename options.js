'use strict';

const keyEl = document.getElementById('apiKey');
const modelEl = document.getElementById('model');
const statusEl = document.getElementById('status');

function flash(msg) {
  statusEl.textContent = msg;
  setTimeout(() => { statusEl.textContent = ''; }, 2200);
}

chrome.storage.local.get(['apiKey', 'model']).then(({ apiKey, model }) => {
  keyEl.value = apiKey || '';
  modelEl.value = model || '';
});

document.getElementById('save').addEventListener('click', async () => {
  await chrome.storage.local.set({
    apiKey: keyEl.value.trim(),
    model: modelEl.value.trim() || 'claude-haiku-4-5-20251001'
  });
  flash('Saved');
});

document.getElementById('clear').addEventListener('click', async () => {
  await chrome.storage.local.remove('apiKey');
  keyEl.value = '';
  flash('Key removed');
});
