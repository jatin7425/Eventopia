import OllamaModel from "../models/ollamamodel.model.js";
import ollama from 'ollama';
import Chat from '../models/chat.model.js';
import mongoose from 'mongoose';


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

        let defaultOllama = models.includes(process.env.OLLAMA) ? process.env.OLLAMA : null;

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
        console.error('Initialization error:', error);
        if (error.message.includes('Ollama')) {
            console.log('→ Ensure Ollama is running: `ollama serve`');
        }
    }
}


export const createChatCompletion = async (req, res) => {
    try {
        const { message, userId } = req.body;

        // Validate input
        if (!message || !userId) {
            return res.status(400).json({
                status: 'error',
                error: 'message, modelId, and userId are required'
            });
        }

        // Get model profile with base prompt
        const model = await OllamaModel.find();
        if (!model || model.length === 0) {
            return res.status(404).json({
                status: 'error',
                error: 'Model not found'
            });
        }

        // Create full model name with version
        const fullModelName = `${model[0].name}:${model[0].version}`;

        // Generate AI response
        const response = await ollama.chat({
            model: fullModelName,
            messages: [
                {
                    role: 'system',
                    content: model.basePrompt
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            options: {
                num_ctx: model?.parameters?.context_window
            }
        });

        // Create chat document
        const newChat = await Chat.create({
            participants: {
                users: [userId],
                aiModels: [model[0]._id]
            },
            messages: [{
                content: message,
                senderType: 'user',
                senderId: userId
            }, {
                content: response.message.content,
                senderType: 'ai_model',
                senderId: model[0]._id
            }],
            aiModelConfig: {
                modelName: fullModelName,
                temperature: 0.7, // Default value
                systemPrompt: model.basePrompt
            }
        });

        // Populate references for response
        const populatedChat = await Chat.findById(newChat._id)
            .populate('participants.users', 'username email')
            .populate('participants.aiModels', 'name version');

        res.status(201).json({
            status: 'success',
            data: {
                chatId: populatedChat._id,
                response: response.message.content,
                participants: populatedChat.participants,
                modelConfig: populatedChat.aiModelConfig,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        const status = error.message.includes('Ollama') ? 503 : 500;
        res.status(status).json({
            status: 'error',
            error: error.message,
            resolution: status === 503
                ? 'Check Ollama service status'
                : 'Verify request parameters'
        });
    }
};

// Additional helper functions
export const getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        const chats = await Chat.find({ 'participants.users': userId })
            .populate('participants.aiModels', 'name version basePrompt')
            .sort('-createdAt');

        res.status(200).json({
            status: 'success',
            count: chats.length,
            data: chats
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: 'Failed to retrieve chat history'
        });
    }
};




