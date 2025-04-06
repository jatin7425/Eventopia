import OllamaModel from "../models/ollamamodel.model.js";
import ollama from 'ollama';

const existingModelsCache = new Set();
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


export async function initializeOllamaModel() {
    try {
        console.log('Starting Ollama model initialization...');

        // Get first available model
        const { models } = await ollama.list();
        if (!models?.length) {
            console.log('No local Ollama models found');
            return;
        }

        let defaultOllama = models.include(process.env.OLLAMA) ? process.env.OLLAMA : null;

        let modelName = defaultOllama || models[models?.length - 1].name;
        console.log(`Processing model: ${modelName}`);

        // Get model details
        const details = await ollama.show({ model: modelName });
        const [name, version] = modelName.split(':') || [modelName, 'latest'];

        // Check existing models
        if (existingModelsCache.has(details.digest)) {
            console.log('Model already exists in cache');
            return;
        }

        const existing = await OllamaModel.findOne({
            'details.digest': details.digest
        });

        if (existing) {
            console.log('Model profile already exists in database\n---------------------------------------------------------\n');
            existingModelsCache.add(details.digest);
            return;
        }

        // Create new model
        const newModel = await OllamaModel.create({
            name,
            version,
            basePrompt,
            details: {
                size: details.size,
                digest: details.digest,
                modified_at: new Date(details.modified_at)
            },
            parameters: {
                context_window: details.parameters?.num_ctx || 4096,
                architecture: details.details?.architecture || 'unknown'
            }
        });

        console.log(`Created new model profile for ${newModel.name}\n\n`);
        existingModelsCache.add(details.digest);

    } catch (error) {
        console.error('Initialization error:', error.message);
        if (error.message.includes('Ollama')) {
            console.log('→ Ensure Ollama is running: `ollama serve`');
        }
    }
}

