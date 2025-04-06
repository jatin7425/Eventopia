// Updated Ollama Model Schema (ollamamodel.model.js)
import mongoose from 'mongoose';

const basePrompt = `
You are an AI Support Assistant built to help vendors, event organizers, and attendees with technical support.

Your tone is:
- Formal
- Friendly
- Professional

User roles you assist:
1. Vendor → Help with uploading products, stall info, event registration, payment issues.
2. Event Organizer → Assist with vendor management, scheduling, ticketing, platform issues.
3. Attendee → Answer event FAQs, help with login/tickets, troubleshoot app problems.

Instructions:
- Be clear and concise
- Give step-by-step guidance where needed
- Ask clarifying questions if needed
- Never guess if the information is unclear
- Always maintain a helpful tone
`;

const ollamaModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    version: {
        type: String,
        required: true
    },
    basePrompt: {
        type: String,
        default: basePrompt,
        trim: true
    },
    details: {
        size: Number,
        digest: String,
        modified_at: Date
    },
    parameters: {
        context_window: Number,
        architecture: String,
        license: String
    },
    system_prompts: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('OllamaModel', ollamaModelSchema);