import ContactUs from '../models/contact.model.js';
import { sendEmail, sendContactEmail } from '../utils/sendEmail.js';

export const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const contact = await ContactUs.create({ name, email, message });

        await sendEmail({
            to: email,
            subject: `Thanks for contacting us, ${name}!`,
            heading: `Hey ${name}, we've received your message!`,
            body: `<p>Thanks for reaching out. Our team will respond to your query shortly.</p>
                   <p><strong>Your Message:</strong><br/>${message}</p>`,
            buttonText: 'Visit Our Site',
            link: process.env.BASE_HOST_URL
        });

        // Send notification to admin
        await sendContactEmail({ name, email, message });

        res.status(201).json({ message: 'Message sent successfully', contact });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};
