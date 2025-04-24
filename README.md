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
  'someone@example.com',
  'Test Email',
  'Hello! This is a test email.',
  'https://example.com/file.pdf' // Optional
);

console.log(response);

```
# .env
```bash
EMAIL_FROM=your.email@gmail.com
EMAIL_PASSWORD="abcd abcd cbcd abcd"

```