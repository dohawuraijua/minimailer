# minimailer

A simple, lightweight Node.js/Bun module for sending emails with optional attachments.

## ✨ Features

- Send plain text or html emails
- Add attachments via URL
- Lightweight and easy to use
- Works with Gmail

## 🚀 Installation

```bash
npm install minimailer
```

# usage

```bash
import { MiniMailer } from 'minimailer';

const mailer = new MiniMailer();

const response = await mailer.send(
  'someone@example.com', //email to
  'Test Email', //subject
  'Hello! This is a test email.', ///body
  'https://example.com/file.pdf' // Optional
);

console.log(response);

```

# .env

```bash
EMAIL_HOST="" //default 'smtp.gmail.com'
EMAIL_PORT= //default 587
EMAIL_FROM=youremail@gmail.com
EMAIL_PASSWORD="abcd abcd cbcd abcd"


```

## ☕ Support Me on Sociabuzz

If you find my work helpful, consider supporting me on Sociabuzz 🙏

[![Support Me on Sociabuzz](https://img.shields.io/badge/Support%20Me%20on-Sociabuzz-red?style=for-the-badge)](https://sociabuzz.com/dohawuraijua)
