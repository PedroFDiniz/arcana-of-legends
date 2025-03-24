import mailer from 'nodemailer';
import { log } from '../utils/misc';
import { base_address } from '../config/config';
import { EMAIL_CONF_ENDPOINT } from '../utils/constants';

const confirmEmail = async (address: string, id: string) => {
    const message = {
        from: "no-reply@test.com",
        to: address,
        subject: "Arcana of Legends - Confirmation Email",
        text: "This is an auto-generated message. Do not reply.\n" +
            "You can validate your account by entering the link below:\n" +
            `${base_address}${EMAIL_CONF_ENDPOINT.replace(":key",id)}`,
    };

    try {
        const transporter = mailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "velva.considine@ethereal.email",
                pass: "mdc91rjWz7pvUcHEDZ"
            }
        });
        const result = await transporter.sendMail(message);
        log(`Message sent: ${result.messageId}`);
    } catch (error) {
        const msg = "Failed to send confirmation email";
        log(msg);
        throw new Error(msg);
    }
}

export default {
    confirmEmail
}