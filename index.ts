const axios = require("axios");
const nodemailer = require('nodemailer')
const fs = require('fs');
const path = require('path');

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

    let text = body;
    let user_from = process.env.EMAIL_FROM ?? null
    let pass_from = process.env.EMAIL_PASSWORD ?? null

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
      const mailOptions = {
        user_from,
        to,
        subject,
        text,
        body,
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      };

      if (attachmentUrl) {
        const resp = await axios({
          method: 'get',
          url: attachmentUrl,
          responseType: 'arraybuffer',
        });

        const attachmentFilename = path.basename(attachmentUrl);
        fs.writeFileSync(attachmentFilename, resp.data);

        mailOptions.attachments = [{
          filename: attachmentFilename,
          path: `./${attachmentFilename}`
        }];
      }

      let info = await transporter.sendMail(mailOptions);

      if (attachmentUrl) {
        fs.unlinkSync(path.basename(attachmentUrl));
      }

      const response = createResponse(200, 'Successfully sent email', { info });
      return response
    } catch (error) {
      const response = createResponse(500, 'Failed to send emaill', { error });
      return response
    }

  }
}
