import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "../ToggleTheme";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import { BsArrowLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

const AIChatSupport = () => {
  // State for managing messages and loading states
  const [messages, setMessages] = useState([
    {
      content:
        "Hello! It's nice to meet you. Is there something I can help you with or would you like to chat?",
      senderType: "ai_model",
      senderId: "ai-assistant",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Ref for scrolling to the bottom of messages
  const messagesEndRef = useRef(null);

  // Profile pictures (replace with your actual image paths)
  const userProfilePic = "https://randomuser.me/api/portraits/men/1.jpg";
  const botProfilePic = "https://i.imgur.com/6VRWJYR.png";

  // User ID (would typically come from auth context in a real app)
  const userId = "665f2d8b7c3d4e2a1c8b4a1d";

  /**
   * Effect to scroll to bottom whenever messages change
   * Uses setTimeout to ensure DOM is updated before scrolling
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  /**
   * Handles sending a new message to the API
   * Updates UI optimistically while waiting for API response
   */
  const handleSendMessage = async () => {
    // Don't send empty messages
    if (!inputMessage.trim()) return;

    setIsLoading(true);

    // Create user message object
    const userMessage = {
      content: inputMessage,
      senderType: "user",
      senderId: userId,
      timestamp: new Date().toISOString(),
    };

    // Optimistically update UI with user message
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message to API endpoint
      const response = await fetch("http://localhost:3000/api/ollamaChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: userId,
        }),
      });

      const data = await response.json();

      // If API call succeeds, add AI response to messages
      if (data.status === "success") {
        const aiMessage = {
          content: data.data.response,
          senderType: "ai_model",
          senderId: data.data.participants.aiModels[0]._id,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      // Always remove loading states
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Main Chat Container */}
      <div className="flex flex-col h-full">
        {/* Chat Header with AI Assistant Info */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center">
          <Link to={"/"} className="pr-3">
            <BsArrowLeft size={25} />
          </Link>
          <img
            src={botProfilePic}
            alt="AI Assistant"
            className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
          />
          <div className="flex justify-between w-full items-center">
            <div>
              <h2 className="text-xl font-semibold dark:text-white text-nowrap">
                AI Support Assistant
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Model: llama2-uncensored
              </p>
            </div>
            <div className="pr-7 max-sm:pr-1">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Messages Container with scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 bg-zinc-50 dark:bg-zinc-900">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.senderType === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-3/4 ${
                    message.senderType === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Sender profile picture */}
                  <img
                    src={
                      message.senderType === "user"
                        ? userProfilePic
                        : botProfilePic
                    }
                    alt={
                      message.senderType === "user" ? "User" : "AI Assistant"
                    }
                    className={`w-8 h-8 rounded-full ${
                      message.senderType === "user" ? "ml-3" : "mr-3"
                    }`}
                  />
                  {/* Message bubble */}
                  <div
                    className={`rounded-lg px-4 pt-2 pb-1 ${
                      message.senderType === "user"
                        ? "bg-blue-500 text-white"
                        : " bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-zinc-800 dark:text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator when AI is responding */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex max-w-3/4">
                  <img
                    src={botProfilePic}
                    alt="AI Assistant"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"></div>
                      <div
                        className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
          <div className="flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-1 px-3 pt-3 pb-2 border border-zinc-300 dark:border-zinc-600 rounded-l-md outline-none dark:bg-zinc-700 dark:text-white"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-[13.5px] rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="-mb-1 mr-2">Send</span>
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatSupport;
