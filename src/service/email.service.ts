import mailer from 'nodemailer';
import { log } from '../utils/misc';
const BASE_ADDRESS = process.env.BASE_ADDRESS!;

async function sendConfirmation (address: string, id: string) {
    const message = {
        from: "no-reply@test.com",
        to: address,
        subject: "Arcana of Legends - Confirmation Email",
        text: "This is an auto-generated message. Do not reply.\n" +
            "You can validate your account by following the link below:\n" +
            `${BASE_ADDRESS}${`/confirm/:key`.replace(":key", id)}`,
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
    sendConfirmation,
};
