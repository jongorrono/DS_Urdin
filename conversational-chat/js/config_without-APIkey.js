// ChatGPT API Configuration
// Replace 'your-openai-api-key-here' with your actual OpenAI API key
// Get your API key from: https://platform.openai.com/api-keys

const CONFIG = {
    // 🔑 REPLACE THIS WITH YOUR ACTUAL OPENAI API KEY
    // Format: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    OPENAI_API_KEY: 'Here goes the API KEY',
    
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    
    // Add fallback configuration for when API is not available
    FALLBACK_MODE: true,
    
    // Add local knowledge base fallback messages
    FALLBACK_MESSAGES: {
        NO_ANSWER: "I don't have specific information about that, but I can help you with questions about Jon's experience, projects, or how he fits for specific roles. Try asking about his work at ZARA, his design systems experience, or his projects in SaaS, fintech, or automotive industries.",
        GENERAL_HELP: "I'm here to help you learn about Jon's experience and skills. You can ask me about his work history, specific projects, or how well he fits for particular roles. What would you like to know?",
        API_UNAVAILABLE: "I'm currently running in local mode. I can answer questions about Jon's experience from my knowledge base, but for general questions, you'll need to configure the ChatGPT API key in config.js"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 🚀 TO ACTIVATE CHATGPT API:
// 1. Get your API key from: https://platform.openai.com/api-keys
// 2. Replace 'your-openai-api-key-here' above with your actual key
// 3. Save this file
// 4. Refresh your browser
// 5. The system will automatically detect and use the API key

