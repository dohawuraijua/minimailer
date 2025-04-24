const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const createResponse = (status: any, message: string, data: any) => {
  return {
    status,
    message,
    data,
  };
};

export class MiniMailer {
  async send(to: string, subject: string, body: string, attachmentUrl = '') {
    if (!to || !subject || !body) {
      return createResponse(400, 'Missing required fields: to, subject, body, attachmentUrl(allow blank)', {});
    }

    let user_from = process.env.EMAIL_FROM ?? null;
    let pass_from = process.env.EMAIL_PASSWORD ?? null;

    if (!user_from || !pass_from) {
      return createResponse(400, 'Missing required env attribute with key: EMAIL_FROM and EMAIL_PASSWORD', {});
    }

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: user_from,
        pass: pass_from,
      },
    });

    try {
      const mailOptions: any = {
        from: user_from,
        to,
        subject,
        html: body, // HTML email
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      if (attachmentUrl) {
        const attachmentFilename = path.basename(attachmentUrl);
        const data = await this.downloadFile(attachmentUrl);
        fs.writeFileSync(attachmentFilename, data);

        mailOptions.attachments = [{
          filename: attachmentFilename,
          path: `./${attachmentFilename}`
        }];
      }

      const info = await transporter.sendMail(mailOptions);

      if (attachmentUrl) {
        fs.unlinkSync(path.basename(attachmentUrl));
      }

      return createResponse(200, 'Successfully sent email', { info });
    } catch (error) {
      return createResponse(500, 'Failed to send email', { error });
    }
  }

  downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      client.get(url, (res) => {
        const data: Uint8Array[] = [];
        res.on('data', (chunk) => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
      }).on('error', reject);
    });
  }
}
