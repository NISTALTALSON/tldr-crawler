# TL;DR Crawler

A playful, interactive Chrome Extension (Manifest V3) where a line-drawn spider crawls across your webpage, follows your cursor, reads page content, and builds a live AI-powered TL;DR summary using Anthropic Claude.

## Features

- 🕷️ **Interactive Line-Drawn Spider**: An animated spider crawls the text and follows your pointer on the webpage.
- ⚡ **Live TL;DR Summaries**: Extracts page sections and generates concise summaries on the fly.
- 🧠 **Powered by Claude**: Uses Anthropic's Claude API (`claude-haiku-4-5-20251001` by default) for high-speed, intelligent extraction.
- 🔒 **Client-Side Key Storage**: Your Anthropic API key is stored safely in Chrome local extension storage and never transmitted to third parties.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/NISTALTALSON/tldr-crawler.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `tldr-crawler` folder.

## Configuration

1. Right-click the extension icon in Chrome and choose **Options** (or click details -> Extension options).
2. Enter your **Anthropic API Key** (`sk-ant-...`).
3. (Optional) Customize the model ID (defaults to `claude-haiku-4-5-20251001`).
4. Click **Save**.

## Usage

1. Navigate to any content or article page (e.g. news, documentation, blog post).
2. Click the **TL;DR Crawler** extension icon in your Chrome toolbar.
3. Watch the spider crawl and generate your summary!
