// DOM Elements
const mainInput = document.getElementById('mainInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const clearSearch = document.getElementById('clearSearch');
const searchInput = document.querySelector('.search-input');
const actionCards = document.querySelectorAll('.card');

// Chat functionality
class ChatBot {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
    }

    // Add message to chat
    addMessage(content, type = 'user') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to conversation history
        this.conversationHistory.push({ content, type, timestamp: Date.now() });
        
        return messageDiv;
    }

    // Show typing indicator
    showTypingIndicator() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        this.isTyping = false;
    }

    // Simulate bot response
    async generateResponse(userMessage) {
        this.showTypingIndicator();
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        this.hideTypingIndicator();
        
        // Generate contextual response based on user input
        const response = this.getContextualResponse(userMessage.toLowerCase());
        this.addMessage(response, 'bot');
    }

    // Get contextual response
    getContextualResponse(message) {
        const responses = {
            'saas': "I have extensive experience with SaaS platforms! I've worked on several SaaS products, including customer management systems, subscription billing platforms, and analytics dashboards. My expertise includes React, Node.js, and cloud infrastructure.",
            'case study': "Great choice! Let me share a case study about a SaaS platform I built for a startup. It included user authentication, subscription management, and real-time analytics. The project improved user engagement by 40% and reduced churn by 25%.",
            'company': "I'm passionate about companies that value innovation and user experience. I thrive in environments that encourage creative problem-solving and rapid iteration. My background in both design and development makes me a great fit for product-focused teams.",
            'about': "I'm Jon, a full-stack developer and designer with 5+ years of experience. I specialize in building intuitive user interfaces and scalable backend systems. I love solving complex problems and creating products that users actually enjoy using.",
            'experience': "My experience spans across multiple domains - from fintech to healthcare SaaS. I've led development teams, mentored junior developers, and shipped products used by thousands of users. I'm always learning and adapting to new technologies.",
            'project': "I've worked on projects ranging from mobile apps to enterprise web applications. Some highlights include a real-time collaboration tool, an AI-powered analytics platform, and a healthcare management system. Each project taught me something new about user needs and technical challenges."
        };

        // Find the best matching response
        for (const [key, response] of Object.entries(responses)) {
            if (message.includes(key)) {
                return response;
            }
        }

        // Default responses
        const defaultResponses = [
            "That's an interesting question! I'd be happy to share more about my experience in that area.",
            "I'd love to discuss that further. Could you tell me more about what specifically interests you?",
            "Great question! Let me share some insights from my experience working on similar challenges.",
            "I'm excited to talk about that! It's an area I'm particularly passionate about.",
            "That's a topic I've spent a lot of time thinking about. Let me share my perspective."
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Clear chat history
    clearChat() {
        chatMessages.innerHTML = '';
        this.conversationHistory = [];
    }
}

// Initialize chat bot
const chatBot = new ChatBot();

// Event Listeners

// Send message on button click
sendBtn.addEventListener('click', sendMessage);

// Send message on Enter key
mainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Clear search functionality
clearSearch.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
});

// Action card interactions
actionCards.forEach(card => {
    card.addEventListener('click', () => {
        const action = card.dataset.action;
        handleCardAction(action);
        
        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    });
});

// Functions

function sendMessage() {
    const message = mainInput.value.trim();
    if (!message) return;

    // Add user message
    chatBot.addMessage(message, 'user');
    
    // Clear input
    mainInput.value = '';
    
    // Generate bot response
    chatBot.generateResponse(message);
}

function handleCardAction(action) {
    let message = '';
    
    switch (action) {
        case 'case-study':
            message = "Tell me about a case study or project you've worked on.";
            break;
        case 'company-fit':
            message = "How would you fit into our company culture and what value would you bring?";
            break;
        case 'about-jon':
            message = "Tell me about yourself and your background.";
            break;
    }
    
    if (message) {
        // Add user message (simulating user clicking the card)
        chatBot.addMessage(message, 'user');
        
        // Generate bot response
        chatBot.generateResponse(message);
    }
}

// Add some initial interaction hints
document.addEventListener('DOMContentLoaded', () => {
    // Add welcome message after a short delay
    setTimeout(() => {
        chatBot.addMessage("Hi! I'm Jon's AI assistant. Feel free to ask me anything about my experience, projects, or how I might fit with your company. You can also click on the cards below to explore specific topics!", 'bot');
    }, 1000);
});

// Add smooth scrolling for chat messages
function smoothScrollToBottom() {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// Auto-scroll to bottom when new messages are added
const observer = new MutationObserver(() => {
    smoothScrollToBottom();
});

observer.observe(chatMessages, {
    childList: true,
    subtree: true
});

// Add keyboard navigation for cards
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Handle tab navigation for accessibility
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const firstFocusableElement = document.querySelector(focusableElements);
        const focusableContent = document.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Add hover effects for better interactivity
actionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.cursor = 'pointer';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.cursor = 'default';
    });
});

// Add input focus management
mainInput.addEventListener('focus', () => {
    mainInput.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.8)';
    mainInput.parentElement.style.background = 'rgba(255, 255, 255, 0.15)';
});

mainInput.addEventListener('blur', () => {
    mainInput.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    mainInput.parentElement.style.background = 'rgba(255, 255, 255, 0.1)';
});

// Add loading state for send button
function setSendButtonLoading(loading) {
    if (loading) {
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        sendBtn.disabled = true;
    } else {
        sendBtn.innerHTML = '<i class="fas fa-comment"></i>';
        sendBtn.disabled = false;
    }
}

// Enhanced send message function with loading state
function sendMessage() {
    const message = mainInput.value.trim();
    if (!message) return;

    setSendButtonLoading(true);
    
    // Add user message
    chatBot.addMessage(message, 'user');
    
    // Clear input
    mainInput.value = '';
    
    // Generate bot response
    chatBot.generateResponse(message).finally(() => {
        setSendButtonLoading(false);
    });
}
