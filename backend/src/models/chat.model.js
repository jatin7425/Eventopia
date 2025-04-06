import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: {
            users: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                validate: {
                    validator: function (v) {
                        return mongoose.Types.ObjectId.isValid(v);
                    },
                    message: props => `${props.value} is not a valid user ID!`
                }
            }],
            aiModels: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "OllamaModel",
                validate: {
                    validator: function (v) {
                        return mongoose.Types.ObjectId.isValid(v);
                    },
                    message: props => `${props.value} is not a valid AI model ID!`
                }
            }]
        },
        messages: [{
            content: String,
            timestamp: { type: Date, default: Date.now },
            senderType: {
                type: String,
                required: true,
                enum: ["user", "ai_model"]
            },
            senderId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                refPath: "messages.senderType"
            }
        }],
        aiModelConfig: {  // For AI-specific settings
            modelName: String,
            temperature: Number,
            maxTokens: Number,
            systemPrompt: String
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual population for easier querying
chatSchema.virtual("users", {
    ref: "User",
    localField: "participants.users",
    foreignField: "_id"
});

chatSchema.virtual("aiModels", {
    ref: "OllamaModel",
    localField: "participants.aiModels",
    foreignField: "_id"
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;