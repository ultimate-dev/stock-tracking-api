import * as nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'destek@guvenesnafi.com',
    pass: 'pass++',
  },
});
export const transporterFrom = 'Güven Esnafı <destek@guvenesnafi.com>';

export default transporter;
