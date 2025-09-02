// DOM Elements
const mainInput = document.getElementById('mainInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const clearSearch = document.getElementById('clearSearch');
const searchInput = document.querySelector('.search-input');
const actionCards = document.querySelectorAll('.card');

/* ---------- Projects Data ---------- */

let projectsData = [];

// System messages loaded from data/system-message_kb.json
let systemMessages = null;
async function loadSystemMessages() {
    try {
        const response = await fetch('./data/system-message_kb.json');
        if (response.ok) {
            systemMessages = await response.json();
        } else {
            console.warn('Failed to load system messages JSON:', response.status);
        }
    } catch (error) {
        console.warn('Error loading system messages JSON:', error);
    }
}

// ---------------- Company Fit Utilities ----------------
let companyFitActive = false;

function isInCompanyFitContext() {
    return companyFitActive === true;
}

function showCompanyFitPrompt() {
    if (chatBot) {
        const promptFromKB = systemMessages && systemMessages.welcome_messages && systemMessages.welcome_messages.company_fit_prompt;
        const prompt = promptFromKB || "Enter a role or keyword (e.g., 'Product Designer', 'Fintech', 'Design Systems') to analyze fit.";
        chatBot.addMessage(prompt, 'bot');
    }
}

function resetCompanyFitContext() {
    companyFitActive = false;
}

function ensureToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '16px';
        container.style.right = '16px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';
        document.body.appendChild(container);
    }
    return container;
}

function showFitToast(score, title, description) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    
    // Determine state based on score
    let state = 'low';
    let icon = '🎲';
    let bgColor = '#FF8F8B'; // Low fit background color from Figma
    
    if (score >= 80) {
        state = 'excellent';
        icon = '🏆';
        bgColor = '#6DCC7A'; // Excellent fit background color from Figma
    } else if (score >= 60) {
        state = 'good';
        icon = '🚀';
        bgColor = '#6DCC7A'; // Good fit background color from Figma
    } else if (score >= 40) {
        state = 'partial';
        icon = '⚡';
        bgColor = '#EBFFA4'; // Partial fit background color from Figma
    }
    
    // Create toast HTML structure matching Figma design
    toast.innerHTML = `
        <div class="fit-toast ${state}-fit" style="
            background: ${bgColor};
            border-radius: 12px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 8px;
            transition: all 0.3s ease;
        ">
            <div class="fit-icon" style="
                font-size: 24px;
                flex-shrink: 0;
            ">${icon}</div>
            <div class="fit-content" style="
                flex: 1;
                color: #333;
            ">
                <div class="fit-title" style="
                    font-weight: bold;
                    font-size: 16px;
                    margin-bottom: 4px;
                    color: #333;
                ">${title}</div>
                <div class="fit-description" style="
                    font-size: 14px;
                    color: #666;
                    line-height: 1.4;
                ">${description}</div>
            </div>
            <div class="fit-score" style="
                font-weight: bold;
                font-size: 20px;
                color: #333;
                flex-shrink: 0;
            ">${score}%</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-remove after 4 seconds
    window.setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        window.setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Keep the original showToast for other uses
function showToast(message) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.padding = '12px 16px';
    toast.style.background = 'rgba(0,0,0,0.85)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.fontSize = '14px';
    toast.style.maxWidth = '320px';
    toast.style.backdropFilter = 'saturate(180%) blur(6px)';
    container.appendChild(toast);
    window.setTimeout(() => {
        toast.style.transition = 'opacity 0.3s ease';
        toast.style.opacity = '0';
        window.setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Load fit scores data
let fitScoresData = null;

async function loadFitScores() {
    try {
        const response = await fetch('./data/fit_scores.json');
        if (response.ok) {
            fitScoresData = await response.json();
            console.log('✅ Fit scores loaded:', Object.keys(fitScoresData.fit_scores).length, 'categories');
        } else {
            console.warn('Failed to load fit scores JSON:', response.status);
        }
    } catch (error) {
        console.warn('Error loading fit scores JSON:', error);
    }
}

function computeCompanyFitScore(userQuery) {
    const q = (userQuery || '').toLowerCase().trim();
    
    // First, try to find exact role match in fit_scores.json
    if (fitScoresData && fitScoresData.fit_scores) {
        for (const category of Object.values(fitScoresData.fit_scores)) {
            for (const [key, role] of Object.entries(category)) {
                const roleTitle = role.title.toLowerCase();
                if (q.includes(roleTitle) || roleTitle.includes(q)) {
                    console.log('✅ Exact role match found:', role.title, 'Score:', role.score);
                    return role.score;
                }
            }
        }
    }
    
    // Fallback to keyword matching if no exact role found
    let matches = 0;
    for (const keyword of Object.keys(KEYWORD_TO_INTENT_MAP)) {
        if (q.includes(keyword)) {
            matches += 1;
        }
    }
    
    // Simple heuristic scoring 40..95 for unknown roles
    const score = Math.max(40, Math.min(95, 40 + matches * 10));
    console.log('🔍 Using keyword matching, score:', score);
    return score;
}

async function handleCompanyFitQuery(userQuery) {
    try {
        const score = computeCompanyFitScore(userQuery);
        
        // Determine title and description based on score (matching Figma design)
        let title, description;
        if (score >= 80) {
            title = "Excellent fit!";
            description = "Jon's profile aligns almost perfectly.";
        } else if (score >= 60) {
            title = "Good fit!";
            description = "Jon covers many of the key needs.";
        } else if (score >= 40) {
            title = "Partial fit!";
            description = "A few overlaps, but not a strong fit.";
        } else {
            title = "Low fit!";
            description = "Jon's skills don't match this role.";
        }
        
        // Show the new styled toast
        showFitToast(score, title, description);
        
        if (chatBot) chatBot.showTypingIndicator();
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (chatBot) chatBot.hideTypingIndicator();
        
        // Answer section - use the same system as main input for consistent answers
        const explanation = await getAnswerFromMainSystem(userQuery);
        
        if (chatBot) chatBot.addMessage(explanation, 'bot');
    } catch (e) {
        if (chatBot) chatBot.hideTypingIndicator();
        if (chatBot) chatBot.addMessage("Sorry, I couldn't compute the fit right now.", 'bot');
    }
}

// Simple out-of-scope detection based on allow/deny keywords
function isOutOfScope(userQuestion) {
    const q = (userQuestion || '').toLowerCase();
    const allowList = [
        'jon', 'gorroño', 'gorro\u00f1o', 'design', 'ux', 'ui', 'research', 'design systems', 'system', 'project', 'projects', 'case study', 'zara', 'gestamp', 'saas', 'fintech', 'healthcare', 'automotive', 'accessibility', 'figma', 'company', 'enterprise', 'startup', 'portfolio', 'career', 'experience', 'product', 'designer'
    ];
    const denyList = [
        'weather', 'stock', 'stocks', 'football', 'soccer', 'nba', 'recipe', 'cooking', 'celebrity', 'politics', 'election', 'joke', 'riddle', 'math puzzle', 'translate', 'travel', 'vacation', 'movie', 'tv show', 'game', 'gaming', 'crypto'
    ];
    const hasAllow = allowList.some(k => q.includes(k));
    const hasDeny = denyList.some(k => q.includes(k));
    return !hasAllow || hasDeny;
}

// Function to fetch projects data from API
async function fetchProjectsData() {
    try {
        console.log('Fetching projects data from API...');
        const response = await fetch('https://689f4cb03fed484cf879b9a0.mockapi.io/Apicall/Proyects');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        projectsData = data;
        console.log('Projects data fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching projects data:', error);
        // Fallback to default data if API fails
        projectsData = [
            {
                id: "1",
                order: "1",
                icon: "💡",
                title: "Designing an Engaging Developer Platform for ZARA",
                description: "As a UX Designer on the team, I contributed to the redesign of Zara Tools—the internal platform for the engineering community—helping boost adoption and daily use among developers. I improved internal processes and collaborated with multidisciplinary squads (engineering, content, design, PMs).",
                domain: "Fashion, B2C, Platform",
                skillsUsed: ["UX research", "design systems", "UX Design", "UI Design"],
                measurableResults: "🚀 +77% adoption in engineering community",
                link: ""
            }
        ];
        return projectsData;
    }
}

// Chat functionality
class ChatBot {
    constructor() {
        this.conversationHistory = [];
        this.isTyping = false;
    }

    // Add message to chat
    addMessage(content, type = 'user') {
        if (!chatMessages) {
            console.warn('⚠️ chatMessages element not found, cannot add message');
            return null;
        }

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
        
        try {
            // Generate contextual response based on user input
            const response = await this.getContextualResponse(userMessage.toLowerCase());
            
        // Simulate processing time
        await new Promise(resolve => {
            const delay = 1500 + Math.random() * 1000;
            const timer = window.setTimeout(resolve, delay);
            return () => window.clearTimeout(timer);
        });
        
        this.hideTypingIndicator();
        this.addMessage(response, 'bot');
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm having trouble processing your question right now. Please try again.", 'bot');
        }
    }

    // Get contextual response using knowledge base
    async getContextualResponse(message) {
        try {
            console.log('🔍 getContextualResponse called with:', message);
            
            // Try to get answer from knowledge base first
            console.log('🧠 Calling getSmartAnswer...');
            const kbAnswer = await getSmartAnswer(message);
            console.log('🧠 getSmartAnswer returned:', kbAnswer);
            
            if (kbAnswer && kbAnswer !== "I found information about that in my knowledge base.") {
                console.log('✅ Using knowledge base answer');
                return kbAnswer;
            }
            
            console.log('⚠️ Knowledge base answer not found, falling back to hardcoded responses');
            
            // Fallback to specific hardcoded responses for basic queries
    const m = (message || "")
      .toLowerCase()
                .replace(/[\u2010-\u2015]/g, "-")
                .replace(/-/g, " ")
                .replace(/\s+/g, " ")
      .trim();
  
            console.log('🔍 Normalized message:', m);
            
    const responses = {
                "saas": "I have extensive experience with SaaS platforms! I've worked on several SaaS products, including customer management systems, subscription billing platforms, and analytics dashboards. My expertise includes React, Node.js, and cloud infrastructure.",
                "case study": "Great choice! Let me share a case study about a SaaS platform I built for a startup. It included user authentication, subscription management, and real-time analytics. The project improved user engagement by 40% and reduced churn by 25%.",
                "company": "I'm passionate about companies that value innovation and user experience. I thrive in environments that encourage creative problem-solving and rapid iteration. My background in both design and development makes me a great fit for product-focused teams.",
                "about": "I'm Jon, a full-stack developer and designer with 5+ years of experience. I specialize in building intuitive user interfaces and scalable backend systems. I love solving complex problems and creating products that users actually enjoy using.",
                "project": "I've worked on projects ranging from mobile apps to enterprise web applications. Some highlights include a real-time collaboration tool, an AI-powered analytics platform, and a healthcare management system. Each project taught me something new about user needs and technical challenges."
            };
            
            // Match by substring
    for (const [key, response] of Object.entries(responses)) {
                if (m.includes(key)) {
                    console.log('🔍 Matched hardcoded response for:', key);
                    return response;
                }
            }
            
            console.log('⚠️ No hardcoded response matched, using final fallback');
            // Final fallback
            return "I'd be happy to share more about my experience in that area. Could you be more specific about what you'd like to know?";
            
        } catch (error) {
            console.error('Error getting contextual response:', error);
            return "I'm having trouble accessing my knowledge base right now. Please try asking about my experience in design, SaaS, or enterprise projects.";
        }
  }
  
    // Clear chat history
    clearChat() {
        chatMessages.innerHTML = '';
        this.conversationHistory = [];
    }
}

// Knowledge Base Functions - Simple and Working
async function loadKB() {
    try {
        console.log('🔍 Loading knowledge base...');
        const response = await fetch('./data/jon_know_how.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
                const data = await response.json();
        console.log('✅ Knowledge base loaded:', data.length, 'items');
        return data;
        
        } catch (error) {
        console.error('❌ Failed to load knowledge base:', error);
        return []; // Return empty array instead of throwing
    }
}

// Intent Detection Function
async function detectIntent(userQuestion) {
    try {
        console.log('🎯 Detecting intent for:', userQuestion);
        
        const question = userQuestion
            .toLowerCase()
            .replace(/behavioural/g, 'behavioral');
        const kb = await loadKB();
        
        if (!kb || kb.length === 0) {
            console.log('⚠️ No knowledge base available for intent detection');
            return null;
        }
        
        // Check against knowledge base intents
        const intent = kb.find(item => {
            // Check question variants FIRST (most reliable)
            if (item.question_variants && Array.isArray(item.question_variants)) {
                for (const variant of item.question_variants) {
                    const variantLower = variant.toLowerCase().replace(/[?.,!]/g, '').trim();
                    const questionClean = question.replace(/[?.,!]/g, '').trim();
                    
                    // Exact match
                    if (variantLower === questionClean) {
                        console.log('✅ Exact variant match found:', variant);
                        return true;
                    }
                    
                    // Contains match
                    if (variantLower.includes(questionClean) || questionClean.includes(variantLower)) {
                        console.log('✅ Contains variant match found:', variant);
                        return true;
                    }
                    
                    // Word-based matching (more flexible)
                    const variantWords = variantLower.split(/\s+/);
                    const questionWords = questionClean.split(/\s+/);
                    const commonWords = variantWords.filter(word => questionWords.includes(word));
                    
                    if (commonWords.length >= 3) { // At least 3 words in common
                        console.log('✅ Word-based variant match found:', variant, 'Common words:', commonWords);
                        return true;
                    }
                }
            }
            
            // Check canonical question
            if (item.canonical_question) {
                const canonicalLower = item.canonical_question.toLowerCase().replace(/[?.,!]/g, '').trim();
                const questionClean = question.replace(/[?.,!]/g, '').trim();
                
                if (canonicalLower.includes(questionClean) || questionClean.includes(canonicalLower)) {
                    console.log('✅ Canonical question match found:', item.canonical_question);
                    return true;
                }
            }
            
            // Check tags (less reliable but good fallback)
            if (item.tags && Array.isArray(item.tags)) {
                for (const tag of item.tags) {
                    const tagLower = tag.toLowerCase();
                    if (question.includes(tagLower)) {
                        console.log('✅ Tag match found:', tag);
                        return true;
                    }
                }
            }
            
            // Check intent_key as last resort (least reliable)
            if (item.intent_key) {
                const intentLower = item.intent_key.toLowerCase().replace(/_/g, ' ');
                if (question.includes(intentLower)) {
                    console.log('✅ Intent key match found:', item.intent_key);
                    return true;
                }
            }
            
            return false;
        });
        
        if (intent) {
            console.log('✅ Intent detected:', intent.intent_key);
            return intent.intent_key;
        } else {
            console.log('⚠️ No intent detected for:', userQuestion);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Intent detection failed:', error);
        return null;
    }
}

// Enhanced Search with Fuzzy Matching
async function findDirectMatch(userQuestion) {
    try {
        console.log('🔍 Searching for direct match:', userQuestion);
        
        const kb = await loadKB();
        if (!kb || kb.length === 0) {
            console.log('⚠️ No knowledge base available for search');
            return null;
        }
        
        const question = userQuestion
            .toLowerCase()
            .replace(/behavioural/g, 'behavioral');
        let bestMatch = null;
        let bestScore = 0;
        
        for (const item of kb) {
            let score = 0;
            const matchedFields = [];
            
            // Check canonical question
            if (item.canonical_question) {
                const canonical = item.canonical_question.toLowerCase();
                if (canonical.includes(question) || question.includes(canonical)) {
                    score += 10;
                    matchedFields.push('canonical_question');
                }
            }
            
            // Check question variants
            if (item.question_variants && Array.isArray(item.question_variants)) {
                for (const variant of item.question_variants) {
                    const variantLower = variant.toLowerCase();
                    if (variantLower.includes(question) || question.includes(variantLower)) {
                        score += 8;
                        matchedFields.push('question_variants');
                        break;
                    }
                }
            }
            
            // Check tags
            if (item.tags && Array.isArray(item.tags)) {
                for (const tag of item.tags) {
                    const tagLower = tag.toLowerCase();
                    if (tagLower.includes(question) || question.includes(tagLower)) {
                        score += 6;
                        matchedFields.push('tags');
                        break;
                    }
                }
            }
            
            // Check industries
            if (item.industries && Array.isArray(item.industries)) {
                for (const industry of item.industries) {
                    const industryLower = industry.toLowerCase();
                    if (industryLower.includes(question) || question.includes(industryLower)) {
                        score += 5;
                        matchedFields.push('industries');
                        break;
                    }
                }
            }
            
            // Check answer content
            if (item.answer_en) {
                const answer = item.answer_en.toLowerCase();
                if (answer.includes(question)) {
                    score += 4;
                    matchedFields.push('answer_content');
                }
            }
            
            // Update best match
            if (score > bestScore) {
                bestScore = score;
                bestMatch = {
                    item: item,
                    score: score,
                    matchedFields: matchedFields
                };
            }
        }
        
        if (bestMatch && bestMatch.score >= 5) {
            console.log('✅ Direct match found:', bestMatch.item.intent_key, 'Score:', bestMatch.score);
            console.log('📋 Matched fields:', bestMatch.matchedFields);
            return bestMatch.item;
    } else {
            console.log('⚠️ No direct match found. Best score:', bestScore);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Direct match search failed:', error);
        return null;
    }
}

// Smart Answer Function with Local Data + ChatGPT Fallback
async function getSmartAnswer(userQuestion) {
    try {
        console.log('🧠 Getting smart answer for:', userQuestion);
        
        // 1. Try keyword matching first (for short queries)
        const keywordIntent = findKeywordMatch(userQuestion);
        if (keywordIntent) {
            console.log('🔑 Keyword match found:', keywordIntent);
            const kb = await loadKB();
            const keywordItem = kb.find(item => item.intent_key === keywordIntent);
            if (keywordItem) {
                console.log('✅ Using KB answer for keyword intent:', keywordIntent);
                return keywordItem.answer_en || keywordItem.answer || "I found information about that in my knowledge base.";
            }
        }
        
        // 2. Try local knowledge base (for full questions)
        const localMatch = await findDirectMatch(userQuestion);
        if (localMatch) {
            console.log('✅ Local KB match found:', localMatch.intent_key);
            return localMatch.answer_en || localMatch.answer || "I found information about that in my knowledge base.";
        }
        
        // 2. Try intent detection
        const intent = await detectIntent(userQuestion);
        if (intent) {
            console.log('✅ Intent detected:', intent);
            const kb = await loadKB();
            const intentItem = kb.find(item => item.intent_key === intent);
            if (intentItem) {
                console.log('✅ Using KB answer for intent:', intent);
                return intentItem.answer_en || intentItem.answer || "I can help you with that topic.";
            }
        }
        
        // 3. ChatGPT fallback with KB context (IMPROVED)
        if (typeof getChatGPTResponse === 'function') {
            try {
                console.log('🤖 Trying ChatGPT fallback with KB context...');
                
                // Get relevant KB context for grounding
                const kb = await loadKB();
                let contextSnippets = [];
                
                // Find relevant snippets based on keywords
                const question = userQuestion.toLowerCase();
                for (const item of kb) {
                    let relevance = 0;
                    
                    // Check question variants
                    if (item.question_variants) {
                        for (const variant of item.question_variants) {
                            if (variant.toLowerCase().includes(question) || question.includes(variant.toLowerCase())) {
                                relevance += 10;
                            }
                        }
                    }
                    
                    // Check tags
                    if (item.tags) {
                        for (const tag of item.tags) {
                            if (question.includes(tag.toLowerCase())) {
                                relevance += 5;
                            }
                        }
                    }
                    
                    // Check answer content
                    if (item.answer_en && item.answer_en.toLowerCase().includes(question)) {
                        relevance += 3;
                    }
                    
                    if (relevance > 0) {
                        contextSnippets.push({
                            id: item.id,
                            intent: item.intent_key,
                            question: item.canonical_question,
                            answer: item.answer_en,
                            relevance: relevance
                        });
                    }
                }
                
                // Sort by relevance and take top 3
                contextSnippets.sort((a, b) => b.relevance - a.relevance);
                contextSnippets = contextSnippets.slice(0, 3);
                
                // Create contextualized prompt
                let contextualPrompt = userQuestion;
                if (contextSnippets.length > 0) {
                    console.log('📚 Providing KB context to ChatGPT:', contextSnippets.length, 'snippets');
                    contextualPrompt = `Question: ${userQuestion}\n\nContext about Jon's experience:\n`;
                    contextSnippets.forEach((snippet, index) => {
                        contextualPrompt += `${index + 1}. ${snippet.question}\n   Answer: ${snippet.answer}\n\n`;
                    });
                    contextualPrompt += `\nInstructions: Answer the question using ONLY the provided context about Jon's experience. If the context doesn't cover the question, say "I don't have specific information about that in Jon's profile yet." Do not provide generic or made-up information.`;
                } else {
                    console.log('⚠️ No relevant KB context found for ChatGPT');
                    contextualPrompt = `Question: ${userQuestion}\n\nInstructions: You are JonBot, a chatbot about Jon's professional experience. Answer ONLY using Jon's actual experience. If you don't have specific information about this topic, say "I don't have specific information about that in Jon's profile yet." Do not provide generic or made-up information.`;
                }
                
                const aiResponse = await getChatGPTResponse(contextualPrompt);
                if (aiResponse && aiResponse.trim() !== '') {
                    console.log('✅ ChatGPT response generated with KB context');
                    return aiResponse;
                }
            } catch (error) {
                console.log('⚠️ ChatGPT fallback failed:', error.message);
            }
        }
        
        // 4. Intelligent fallback message (IMPROVED)
        console.log('💡 Providing intelligent fallback...');
        return provideIntelligentFallback(userQuestion);
        
    } catch (error) {
        console.error('❌ Smart answer generation failed:', error);
        return "I'm sorry, I encountered an error while processing your question. Please try asking about Jon's experience in design systems, SaaS, or enterprise projects.";
    }
}

// Intelligent Fallback Function
function provideIntelligentFallback(userQuestion) {
    const question = userQuestion.toLowerCase();
    
    // Check for specific topics and provide helpful responses (more specific matching)
    if ((question.includes('design') && (question.includes('system') || question.includes('ux') || question.includes('ui'))) || 
        (question.includes('ux') && question.includes('research')) ||
        (question.includes('ui') && question.includes('design'))) {
        return "I can tell you about Jon's experience in design systems, UX research, and UI design. He has worked on projects for ZARA, Veridata, and various SaaS platforms. What specific aspect of design would you like to know about?";
    }
    
    if ((question.includes('saas') && question.includes('platform')) || 
        (question.includes('startup') && question.includes('company')) ||
        (question.includes('enterprise') && question.includes('company'))) {
        return "Jon has extensive experience in both SaaS startups and enterprise environments. He's worked on platforms for fintech, e-commerce, and government services. Would you like to know about his specific projects or methodologies?";
    }
    
    if ((question.includes('project') && question.includes('case')) || 
        (question.includes('case study') && question.includes('example'))) {
        return "Jon has worked on diverse projects including ZARA's internal tools, Veridata's government services, and various fintech platforms. I can share details about specific projects, methodologies, or outcomes. What interests you most?";
    }
    
    if ((question.includes('research') && question.includes('user')) || 
        (question.includes('stakeholder') && question.includes('alignment'))) {
        return "Jon specializes in UX research, stakeholder alignment, and user-centered design processes. He has experience with both qualitative and quantitative research methods. What specific research aspect would you like to explore?";
    }
    
    // Out-of-scope check before general fallback
    if (isOutOfScope(userQuestion)) {
        const outOfScope = systemMessages && systemMessages.error_messages && systemMessages.error_messages.out_of_scope;
        if (outOfScope) return outOfScope;
        return "That's an interesting topic! I'm focused on sharing Jon Gorroño's professional experience and career as a Product Designer. Would you like to know more about his design approach, his projects, or his collaboration with teams?";
    }

    // General fallback (from system messages if available)
    const fallbackFromKB = systemMessages && systemMessages.error_messages && systemMessages.error_messages.general_fallback;
    return fallbackFromKB || "I can help you learn about Jon's experience in design systems, UX research, SaaS platforms, and enterprise projects. Try asking about specific areas like 'design systems experience', 'SaaS projects', or 'UX research methods'.";
}

// Keyword to Intent Mapping System
const KEYWORD_TO_INTENT_MAP = {
    // UX/UI Keywords
    'ux': 'ux_process_methodology',
    'ux research': 'ux_research_experience',
    'ux/ui': 'UX_UI', 
    'product design': 'UX_UI',
    'visual design': 'UI_Visual_Design',
    'ui design': 'UI_Visual_Design',
    'ui': 'UI_Visual_Design',
    'user research': 'ux_research_experience',
    'research': 'ux_research_experience',
    
    // Design Systems
    'design systems': 'design_systems_experience',
    'design system': 'design_systems_experience',
    'ds': 'design_systems_experience',

    // Behavioral / Behavioural Design
    'behavioral design': 'behavioral_design_experience',
    'behavioural design': 'behavioral_design_experience',
    'behavioral': 'behavioral_design_experience',
    'behavioural': 'behavioral_design_experience',
    'behavioral science': 'behavioral_design_experience',
    'behavioural science': 'behavioral_design_experience',
    'nudge': 'behavioral_design_experience',
    'nudges': 'behavioral_design_experience',
    'habit design': 'behavioral_design_experience',
    'com-b': 'behavioral_design_experience',
    'bj fogg': 'behavioral_design_experience',
    
    // Tools
    'figma': 'skills_design_tools',
    'tools': 'skills_design_tools',
    'software': 'skills_design_tools',
    
    // Experience Types
    'leadership': 'project_leadership_experience',
    'team': 'project_leadership_experience',
    'management': 'project_leadership_experience',
    
    // Soft Skills
    'soft skills': 'soft_skills_profile',
    'communication': 'soft_skills_profile',
    'collaboration': 'soft_skills_profile',
    'mentoring': 'soft_skills_profile',
    
    // Industries
    'saas': 'sector_saas',
    'enterprise': 'seniority_enterprise_scale',
    'startup': 'sector_saas',
    
    // Skills
    'prototyping': 'skills_design_tools',
    'wireframes': 'skills_design_tools',
    'accessibility': 'accessibility_inclusive_design',
    'testing': 'ux_research_experience'
};

// Enhanced keyword matching function
function findKeywordMatch(userQuestion) {
    const question = userQuestion.toLowerCase().trim();
    
    // Direct keyword match
    if (KEYWORD_TO_INTENT_MAP[question]) {
        return KEYWORD_TO_INTENT_MAP[question];
    }
    
    // Partial keyword match
    for (const [keyword, intent] of Object.entries(KEYWORD_TO_INTENT_MAP)) {
        if (question.includes(keyword) || keyword.includes(question)) {
            return intent;
        }
    }
    
    return null;
}

// Function to get answers using the same system as main input
async function getAnswerFromMainSystem(userQuery) {
    try {
        // Use the same logic as the main input system
        const localMatch = await findDirectMatch(userQuery);
        if (localMatch && localMatch.answer_en) {
            console.log('✅ Found direct match in knowledge base');
            return localMatch.answer_en;
        }
        
        const intent = await detectIntent(userQuery);
        if (intent) {
            console.log('✅ Found intent-based answer');
            return intent;
        }
        
        // If no local match, use ChatGPT API if available
        if (window.chatGPTKey) {
            console.log('🔄 No local match found, trying ChatGPT API');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.chatGPTKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Jon\'s AI assistant. Answer questions about Jon\'s professional experience, skills, and fit for different roles. Keep answers concise and relevant to Jon\'s background as a Senior Product Designer with experience in SaaS, enterprise platforms, and design systems.'
                        },
                        {
                            role: 'user',
                            content: userQuery
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    console.log('✅ Generated answer using ChatGPT API');
                    return data.choices[0].message.content;
                }
            }
        }
        
        // Fallback
        console.log('⚠️ No answer found, using fallback');
        return "I can help you understand Jon's experience and how it relates to this role. Jon has worked as a Senior Product Designer with expertise in UX/UI design, design systems, and enterprise platforms. Would you like to know more about his specific skills or projects?";
        
    } catch (error) {
        console.error('Error getting answer from main system:', error);
        return "I'm having trouble accessing my knowledge base right now. Jon has extensive experience in product design, UX research, and design systems across various industries.";
    }
}

// Function to get role-specific answers from knowledge base (keeping for reference)
async function getAnswerFromKnowledgeBase(roleQuery) {
    try {
        // First try to find a direct match in the knowledge base
        const localMatch = await findDirectMatch(roleQuery);
        if (localMatch && localMatch.answer_en) {
            console.log('✅ Found role-specific answer in knowledge base');
            return localMatch.answer_en;
        }
        
        // If no direct match, try to detect intent and get contextual response
        const intent = await detectIntent(roleQuery);
        if (intent) {
            console.log('✅ Found intent-based answer for role');
            return intent;
        }
        
        // If still no match, try to find related content by searching for role keywords
        const kb = await loadKB();
        if (kb && kb.length > 0) {
            const roleKeywords = roleQuery.toLowerCase().split(' ');
            let bestMatch = null;
            let bestScore = 0;
            
            for (const item of kb) {
                let score = 0;
                
                // Check if any role keywords match the item's content
                for (const keyword of roleKeywords) {
                    if (item.canonical_question && item.canonical_question.toLowerCase().includes(keyword)) {
                        score += 5;
                    }
                    if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword))) {
                        score += 3;
                    }
                    if (item.answer_en && item.answer_en.toLowerCase().includes(keyword)) {
                        score += 2;
                    }
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = item;
                }
            }
            
            if (bestMatch && bestScore >= 3) {
                console.log('✅ Found related answer in knowledge base');
                return bestMatch.answer_en;
            }
        }
        
        // Final fallback: use ChatGPT API if available
        if (window.chatGPTKey) {
            console.log('🔄 No local match found, trying ChatGPT API');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.chatGPTKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Jon\'s AI assistant. Answer questions about Jon\'s professional experience, skills, and fit for different roles. Keep answers concise and relevant to Jon\'s background as a Senior Product Designer with experience in SaaS, enterprise platforms, and design systems.'
                        },
                        {
                            role: 'user',
                            content: roleQuery
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    console.log('✅ Generated answer using ChatGPT API');
                    return data.choices[0].message.content;
                }
            }
        }
        
        // Ultimate fallback
        console.log('⚠️ No answer found, using fallback');
        return "I can help you understand Jon's experience and how it relates to this role. Jon has worked as a Senior Product Designer with expertise in UX/UI design, design systems, and enterprise platforms. Would you like to know more about his specific skills or projects?";
        
    } catch (error) {
        console.error('Error getting answer from knowledge base:', error);
        return "I'm having trouble accessing my knowledge base right now. Jon has extensive experience in product design, UX research, and design systems across various industries.";
    }
}

// Expose functions to global scope for testing
window.loadKB = loadKB;
window.detectIntent = detectIntent;
window.findDirectMatch = findDirectMatch;
window.getSmartAnswer = getSmartAnswer;
window.provideIntelligentFallback = provideIntelligentFallback;

console.log('🚀 Knowledge Base functions loaded and exposed to global scope');
console.log('📚 Available functions:', {
    loadKB: typeof loadKB === 'function',
    detectIntent: typeof detectIntent === 'function',
    findDirectMatch: typeof findDirectMatch === 'function',
    getSmartAnswer: typeof getSmartAnswer === 'function'
});

// Test this RIGHT NOW in your console:
window.testLoad = async function() {
    console.clear();
    console.log('🧪 TESTING KNOWLEDGE BASE LOAD...');
    
    try {
        const data = await loadKB();
        console.log('🎉 SUCCESS! System can now function.');
        console.log('First item:', data[0]);
        
        // Test matching
        const testQuestion = "Has Jon led projects or guided teams?";
        console.log('Testing question:', testQuestion);
        
        // Simple test - look for leadership intent
        const leadershipItem = data.find(item => item.intent_key === 'project_leadership_experience');
        if (leadershipItem) {
            console.log('✅ Found leadership item:', leadershipItem.answer_en);
        } else {
            console.log('❌ Could not find leadership item in data');
        }
        
    } catch (error) {
        console.error('💥 CATASTROPHIC FAILURE:', error.message);
    }
};

console.log('🧪 TEST FUNCTION READY: Run testLoad() in console to test knowledge base loading');

// Test function to verify knowledge base loading
window.testKnowledgeBase = async function() {
    console.log('🧪 Testing knowledge base functionality...');
    
    try {
        // Test 1: Load knowledge base
        console.log('📚 Test 1: Loading knowledge base...');
        const kb = await loadKB();
        console.log('✅ Knowledge base loaded:', kb.length, 'items');
        
        // Test 2: Intent detection
        console.log('🎯 Test 2: Testing intent detection...');
        const intent = await detectIntent('design systems');
        console.log('✅ Intent detected:', intent);
        
        // Test 3: Direct match
        console.log('🔍 Test 3: Testing direct match...');
        const match = await findDirectMatch('design systems');
        console.log('✅ Direct match:', match ? match.intent_key : 'None');
        
        // Test 4: Smart answer
        console.log('🧠 Test 4: Testing smart answer...');
        const answer = await getSmartAnswer('design systems');
        console.log('✅ Smart answer length:', answer.length);
        
        console.log('🎉 All knowledge base tests passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Knowledge base test failed:', error);
        return false;
    }
};

// Comprehensive test function to debug KB loading and intent detection
window.debugKBStepByStep = async function(userQuestion) {
    console.log('🔍 === COMPREHENSIVE KB DEBUG ===');
    console.log('🔍 Testing question:', userQuestion);
    
    try {
        // Step 1: Test KB loading
        console.log('\n📋 Step 1: Testing KB loading...');
        const kb = await loadKB();
        console.log('📊 KB load result:', {
            type: typeof kb,
            isArray: Array.isArray(kb),
            length: Array.isArray(kb) ? kb.length : 'N/A',
            firstItem: Array.isArray(kb) && kb.length > 0 ? kb[0].id : 'N/A'
        });
        
        if (!kb || kb.length === 0) {
            console.log('❌ KB loading failed - this is why intent detection fails');
            return { status: 'kb_load_failed', kb: kb };
        }
        
        // Step 2: Test intent detection
        console.log('\n📋 Step 2: Testing intent detection...');
        const intent = await detectIntent(userQuestion);
        console.log('🎯 Intent detection result:', intent);
        
        if (!intent) {
            console.log('❌ Intent detection failed - checking why...');
            
            // Debug the matching logic
            const question = userQuestion.toLowerCase();
            console.log('🔍 Normalized question:', question);
            
            // Check each item manually
            for (const item of kb) {
                console.log(`\n🔍 Checking item: ${item.id} (${item.intent_key})`);
                
                if (item.question_variants && Array.isArray(item.question_variants)) {
                    console.log('📋 Question variants:');
                    for (const variant of item.question_variants) {
                        const variantLower = variant.toLowerCase().replace(/[?.,!]/g, '').trim();
                        const questionClean = question.replace(/[?.,!]/g, '').trim();
                        
                        console.log(`  - "${variant}" → "${variantLower}"`);
                        console.log(`  - Question: "${questionClean}"`);
                        
                        // Test each matching method
                        const exactMatch = variantLower === questionClean;
                        const containsMatch = variantLower.includes(questionClean) || questionClean.includes(variantLower);
                        
                        const variantWords = variantLower.split(/\s+/);
                        const questionWords = questionClean.split(/\s+/);
                        const commonWords = variantWords.filter(word => questionWords.includes(word));
                        const wordMatch = commonWords.length >= 3;
                        
                        console.log(`    - Exact match: ${exactMatch}`);
                        console.log(`    - Contains match: ${containsMatch}`);
                        console.log(`    - Word match (${commonWords.length}/3): ${wordMatch}`);
                        console.log(`    - Common words: [${commonWords.join(', ')}]`);
                        
                        if (exactMatch || containsMatch || wordMatch) {
                            console.log(`    ✅ MATCH FOUND!`);
                            return { status: 'manual_match_found', item: item, matchType: exactMatch ? 'exact' : containsMatch ? 'contains' : 'word' };
                        }
                    }
                }
            }
            
            console.log('❌ No manual matches found either');
            return { status: 'no_matches', kb: kb };
        }
        
        // Step 3: Test getting the answer
        console.log('\n📋 Step 3: Testing answer retrieval...');
        const intentItem = kb.find(item => item.intent_key === intent);
        if (intentItem) {
            console.log('✅ Intent item found:', intentItem.id);
            console.log('📝 Answer preview:', intentItem.answer_en?.substring(0, 200) + '...');
            return { status: 'success', intent: intent, item: intentItem };
        } else {
            console.log('❌ Intent item not found in KB');
            return { status: 'intent_not_found', intent: intent };
        }
        
    } catch (error) {
        console.error('❌ Debug failed:', error);
        return { status: 'error', error: error.message };
    }
};

// Test function to verify data quality
window.testDataQuality = async function() {
    console.log('🔍 === DATA QUALITY TEST ===');
    
    try {
        const kb = await loadKB();
        console.log('📊 KB loaded:', kb.length, 'items');
        
        if (kb.length === 0) {
            console.log('❌ No items loaded - check review status and JSON syntax');
            return;
        }
        
        // Check for design systems questions
        const designSystemsItems = kb.filter(item => 
            item.intent_key === 'design_systems_experience' || 
            item.canonical_question?.toLowerCase().includes('design systems')
        );
        
        console.log('\n🎯 Design Systems Items:', designSystemsItems.length);
        designSystemsItems.forEach(item => {
            console.log(`   - ${item.id}: ${item.intent_key}`);
            console.log(`     Question: ${item.canonical_question}`);
            console.log(`     Status: ${item.review_status}`);
            console.log(`     Confidence: ${item.confidence_score}`);
        });
        
        // Check for duplicates
        const canonicalQuestions = kb.map(item => item.canonical_question).filter(Boolean);
        const uniqueQuestions = new Set(canonicalQuestions);
        
        console.log('\n📋 Duplicate Check:');
        console.log(`   - Total questions: ${canonicalQuestions.length}`);
        console.log(`   - Unique questions: ${uniqueQuestions.size}`);
        console.log(`   - Duplicates: ${canonicalQuestions.length - uniqueQuestions.size}`);
        
        if (canonicalQuestions.length > uniqueQuestions.size) {
            console.log('⚠️ Duplicates found - check the logs above for details');
        }
        
        // Show sample items
        console.log('\n📝 Sample Items:');
        kb.slice(0, 3).forEach(item => {
            console.log(`   - ${item.id}: ${item.intent_key}`);
            console.log(`     Status: ${item.review_status}`);
            console.log(`     Question: ${item.canonical_question?.substring(0, 60)}...`);
        });
        
        return {
            totalItems: kb.length,
            designSystemsItems: designSystemsItems.length,
            duplicates: canonicalQuestions.length - uniqueQuestions.size,
            sampleItems: kb.slice(0, 3)
        };
        
    } catch (error) {
        console.error('❌ Data quality test failed:', error);
        return { error: error.message };
    }
};

// Initialize chat bot
const chatBot = new ChatBot();

// Initialize action cards with data
async function initializeActionCards() {
    try {
        console.log('🎯 Initializing action cards...');
        
        // Load projects data
        await fetchProjectsData();
        
        // Update case study card
        const caseStudyTitle = document.getElementById('case-study-title');
        const caseStudyDescription = document.getElementById('case-study-description');
        if (caseStudyTitle && caseStudyDescription) {
            caseStudyTitle.textContent = 'Case Studies';
            caseStudyDescription.textContent = 'Explore Jon\'s recent work and project outcomes';
        }
        
        // Update company fit card
        const companyFitTitle = document.getElementById('company-fit-title');
        const companyFitDescription = document.getElementById('company-fit-description');
        if (companyFitTitle && companyFitDescription) {
            companyFitTitle.textContent = 'Company Fit';
            companyFitDescription.textContent = 'See how Jon aligns with your company culture';
        }
        
        // Update about Jon card
        const aboutJonTitle = document.getElementById('about-jon-title');
        const aboutJonDescription = document.getElementById('about-jon-description');
        if (aboutJonTitle && aboutJonDescription) {
            aboutJonTitle.textContent = 'About Jon';
            aboutJonDescription.textContent = 'Learn about Jon\'s background and expertise';
        }
        
        console.log('✅ Action cards initialized successfully');
        
            } catch (error) {
        console.error('❌ Failed to initialize action cards:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActionCards);
        } else {
    initializeActionCards();
}

// Event Listeners

// Send message on button click
if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

// Send message on Enter key
if (mainInput) {
    mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Clear search functionality
if (clearSearch) {
    clearSearch.addEventListener('click', () => {
        // Clear search input
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        
        // Clear chat messages
        if (chatBot) {
            chatBot.clearChat();
        }
        
        // Reset company fit context if active
        if (companyFitActive) {
            resetCompanyFitContext();
        }
        
        // Add a brief visual feedback
        clearSearch.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clearSearch.style.transform = '';
        }, 150);
    });
}

// Action card interactions
if (actionCards && actionCards.length > 0) {
    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            
            // Add enhanced visual feedback
            card.style.transform = 'scale(0.95)';
            card.style.background = 'rgba(255, 255, 255, 0.15)';
            
            setTimeout(() => {
                card.style.transform = '';
                card.style.background = '';
            }, 150);
            
            // Handle the action
            handleCardAction(action);
        });
    });
}

// Functions



async function handleCardAction(action) {
    if (action === 'case-study') {
        // Ensure projects data is loaded before showing
        if (projectsData.length === 0) {
            console.log('Projects data not loaded, fetching...');
            await fetchProjectsData();
        }
        // Small delay to ensure DOM is ready
        window.setTimeout(() => {
            showProjectsDisplay();
        }, 100);
        return;
    }

    if (action === 'company-fit') {
        companyFitActive = true;
        showCompanyFitPrompt();
        return;
    }

    if (action === 'about-jon') {
        // Show About Jon section
        showAboutJonSection();
        return;
    }
}

// Function to display projects in an attractive format
function showProjectsDisplay() {
    // Clear existing chat messages with fade out effect
    chatMessages.style.opacity = '0';
    chatMessages.style.transform = 'translateY(20px)';
    
    window.setTimeout(() => {
        chatMessages.innerHTML = '';
        
        // Create projects header
        const projectsHeader = document.createElement('div');
        projectsHeader.className = 'projects-header';
        projectsHeader.innerHTML = `
            <h2 class="projects-title">Here are some of Jon's recent project:</h2>
        `;
        chatMessages.appendChild(projectsHeader);
        
        // Create projects container
        const projectsContainer = document.createElement('div');
        projectsContainer.className = 'projects-container';
        
        // Check if projects data is available
        if (!projectsData || projectsData.length === 0) {
            const noDataMessage = document.createElement('div');
            noDataMessage.className = 'project-item';
            noDataMessage.innerHTML = `
                <div class="project-header">
                    <div class="project-title">Loading projects... (Data length: ${projectsData ? projectsData.length : 'undefined'})</div>
                </div>
            `;
            projectsContainer.appendChild(noDataMessage);
            console.log('Projects data not available:', projectsData);
            return;
        }
        
        console.log('Projects data available:', projectsData);
        
        // Add each project as expandable items
        projectsData.forEach((project, index) => {
            console.log(`Processing project ${index}:`, project);
            console.log(`Skills used for project ${index}:`, project.SkillsUsed || project.skillsUsed, typeof (project.SkillsUsed || project.skillsUsed));
            
            // Skip invalid projects
            if (!project || typeof project !== 'object') {
                console.warn(`Skipping invalid project at index ${index}:`, project);
                return;
            }
            
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.dataset.projectId = project.id;
            
            const hasCaseStudy = (project.Link && project.Link !== '' && project.Link !== '#') || (project.link && project.link !== '' && project.link !== '#');
            
            projectItem.innerHTML = `
                <div class="project-header">
                    <div class="project-icon">
                        <span class="project-emoji">${project.icon || '📋'}</span>
                    </div>
                    <div class="project-title">${project.Title || project.title || 'Untitled Project'}</div>
                    <div class="expand-indicator">+</div>
                </div>
                <div class="project-details" id="project-details-${project.id}" style="display: none;">
                    <div class="project-description">${project.Description || project.description || 'No description available'}</div>
                    <div class="project-domain">
                        <div class="project-label">DOMAIN</div>
                        <div class="project-content">${project.Domain || project.domain || 'Not specified'}</div>
                    </div>
                    <div class="project-skills">
                        <div class="project-label">SKILLS USED</div>
                        <div class="project-content">${Array.isArray(project.SkillsUsed) ? project.SkillsUsed.join(', ') : (Array.isArray(project.skillsUsed) ? project.skillsUsed.join(', ') : (project.SkillsUsed || project.skillsUsed || 'Not specified'))}</div>
                    </div>
                    <div class="project-impact">
                        <div class="project-label">MEASURABLE RESULTS</div>
                        <div class="project-content">${project.MeasurableResults || project.measurableResults || 'Not available'}</div>
                    </div>
                    ${hasCaseStudy ? 
                        `<a href="${project.Link || project.link}" target="_blank" class="case-study-link">
                            <span class="link-icon">+</span>
                            View case study
                        </a>` : ''
                    }
                </div>
            `;
            
            // Add click event listener to the project header
            const projectHeader = projectItem.querySelector('.project-header');
            projectHeader.addEventListener('click', () => {
                const detailsElement = projectItem.querySelector('.project-details');
                const expandIndicator = projectItem.querySelector('.expand-indicator');
                
                console.log('Project header clicked, current display:', detailsElement.style.display);
                console.log('Details element:', detailsElement);
                console.log('Details content:', detailsElement.innerHTML);
                
                if (detailsElement.style.display === 'none' || detailsElement.style.display === '') {
                    // Expand
                    console.log('Expanding project details...');
                    detailsElement.style.display = 'block';
                    detailsElement.style.visibility = 'visible';
                    detailsElement.style.opacity = '1';
                    detailsElement.style.height = 'auto';
                    expandIndicator.textContent = '-';
                    projectItem.classList.add('expanded');
                    
                    // Force a reflow to ensure styles are applied
                    detailsElement.offsetHeight;
                    
                    console.log('Project expanded, display:', detailsElement.style.display, 'visibility:', detailsElement.style.visibility);
                } else {
                    // Collapse
                    console.log('Collapsing project details...');
                    detailsElement.style.transition = 'all 0.3s ease';
                    detailsElement.style.opacity = '0';
                    detailsElement.style.transform = 'translateY(-10px)';
                    
                    setTimeout(() => {
                        detailsElement.style.display = 'none';
                        expandIndicator.textContent = '+';
                        projectItem.classList.remove('expanded');
                    }, 300);
                }
            });
            
            projectsContainer.appendChild(projectItem);
        });
        
        chatMessages.appendChild(projectsContainer);
            
            // Fade in the new content
            chatMessages.style.transition = 'all 0.5s ease';
            chatMessages.style.opacity = '1';
            chatMessages.style.transform = 'translateY(0)';
            
            // Scroll to top smoothly
            chatMessages.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 200);
}

// Function to display About Jon section
function showAboutJonSection() {
    console.log('About Jon section clicked!'); // Debug log
    
    // Clear existing chat messages with fade out effect
    chatMessages.style.opacity = '0';
    chatMessages.style.transform = 'translateY(20px)';
    
    window.setTimeout(() => {
        chatMessages.innerHTML = '';
        
        // Create About Jon header
        const aboutHeader = document.createElement('div');
        aboutHeader.className = 'about-header';
        aboutHeader.innerHTML = `
            <h2 class="about-title">Senior Product Designer & UX Engineer</h2> <!-- No dash character -->
        `;
        chatMessages.appendChild(aboutHeader);
        
        // Create About Jon content
        const aboutContent = document.createElement('div');
        aboutContent.className = 'about-content';
        aboutContent.innerHTML = `
            <div class="about-text">
                <p>I'm Jon Gorroño, a designer who bridges the gap between technical complexity and human experience. With 10+ years of experience, I specialize in transforming complex systems into simple, intuitive, and visually compelling products.</p>
                
                <p>My unique background—an IT degree from Deusto and a Master's in Design from Barcelona—allows me to design with a developer's mindset and code with a designer's eye. I've delivered digital products, design systems, and UX strategies for global corporations (Inditex/ZARA, Gestamp), agile startups, and public institutions.</p>
                
                <p>I believe design has the power to make technology effortless and enjoyable—turning challenges into solutions that truly work for people.</p>
            </div>
            
            <div class="about-image-container">
                <img src="img/about-me.jpg" alt="Jon Gorroño" class="about-image" onload="console.log('Image loaded successfully')" onerror="console.log('Image failed to load')">
            </div>
        `;
        chatMessages.appendChild(aboutContent);
        
        console.log('About Jon content added to DOM'); // Debug log
        
        // Fade in the new content
        chatMessages.style.transition = 'all 0.5s ease';
        chatMessages.style.opacity = '1';
        chatMessages.style.transform = 'translateY(0)';
        
        // Scroll to top smoothly
        chatMessages.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 200);
}

// Function to show welcome message and return to chat
function showWelcomeMessage() {
    // Fade out effect
    chatMessages.style.opacity = '0';
    chatMessages.style.transform = 'translateY(-20px)';
    
    window.setTimeout(() => {
        chatMessages.innerHTML = '';
        chatBot.addMessage("Hi! I'm Jon's AI assistant. Ask me about his experience, projects, or fit for your company — or explore the cards below.", 'bot');
        
        // Fade in effect
        chatMessages.style.transition = 'all 0.5s ease';
        chatMessages.style.opacity = '1';
        chatMessages.style.transform = 'translateY(0)';
    }, 200);
}

// Add some initial interaction hints
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch projects data from API and load all data sources
    await Promise.all([
        fetchProjectsData(),
        loadSystemMessages(),
        loadFitScores()
    ]);
    
    // Add welcome message after a short delay
    setTimeout(() => {
        chatBot.addMessage("Hi! I’m Jon’s AI assistant. Ask me about his experience, projects, or fit for your company — or explore the cards below.", 'bot');
    }, 1000);
});

// Add smooth scrolling for chat messages
function smoothScrollToBottom() {
    if (chatMessages) {
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
    }
}

// Auto-scroll to bottom when new messages are added
if (chatMessages) {
const observer = new MutationObserver(() => {
    smoothScrollToBottom();
});

observer.observe(chatMessages, {
    childList: true,
    subtree: true
});
}

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
if (actionCards && actionCards.length > 0) {
actionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.cursor = 'pointer';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.cursor = 'default';
    });
});
}

// Add input focus management
if (mainInput) {
mainInput.addEventListener('focus', () => {
        if (mainInput.parentElement) {
    mainInput.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.8)';
    mainInput.parentElement.style.background = 'rgba(255, 255, 255, 0.15)';
        }
});

mainInput.addEventListener('blur', () => {
        if (mainInput.parentElement) {
    mainInput.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    mainInput.parentElement.style.background = 'rgba(255, 255, 255, 0.1)';
        }
});
}

// Add loading state for send button
function setSendButtonLoading(loading) {
    if (!sendBtn) return;
    
    if (loading) {
        sendBtn.innerHTML = '⏳';
        sendBtn.disabled = true;
    } else {
        sendBtn.innerHTML = '💬';
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
    
    // Company Fit override: first show toast score, then explanation
    if (isInCompanyFitContext()) {
        handleCompanyFitQuery(message).finally(() => {
            setSendButtonLoading(false);
        });
        return;
    }
    
    // Generate bot response
    chatBot.generateResponse(message).finally(() => {
        setSendButtonLoading(false);
    });
}

// Debug function to show intent detection process
window.debugIntentDetection = async function(userQuestion) {
    console.log('🔍 Debugging intent detection for:', userQuestion);
    
    try {
        const kb = await loadKB();
        if (!kb || kb.length === 0) {
            console.log('❌ No knowledge base available');
            return;
        }
        
        const question = userQuestion.toLowerCase();
        console.log('🔍 Normalized question:', question);
        
        // Check each item for potential matches
        for (const item of kb) {
            console.log(`\n🔍 Checking item: ${item.id} (${item.intent_key})`);
            
            // Check question variants
            if (item.question_variants && Array.isArray(item.question_variants)) {
                console.log('📋 Question variants:');
                for (const variant of item.question_variants) {
                    const variantLower = variant.toLowerCase().replace(/[?.,!]/g, '').trim();
                    const questionClean = question.replace(/[?.,!]/g, '').trim();
                    
                    console.log(`  - "${variant}" → "${variantLower}"`);
                    
                    // Exact match
                    if (variantLower === questionClean) {
                        console.log(`    ✅ EXACT MATCH!`);
                        return item.intent_key;
                    }
                    
                    // Contains match
                    if (variantLower.includes(questionClean) || questionClean.includes(variantLower)) {
                        console.log(`    ✅ CONTAINS MATCH!`);
                        return item.intent_key;
                    }
                    
                    // Word-based matching
                    const variantWords = variantLower.split(/\s+/);
                    const questionWords = questionClean.split(/\s+/);
                    const commonWords = variantWords.filter(word => questionWords.includes(word));
                    
                    console.log(`    - Variant words: [${variantWords.join(', ')}]`);
                    console.log(`    - Question words: [${questionWords.join(', ')}]`);
                    console.log(`    - Common words: [${commonWords.join(', ')}] (${commonWords.length}/3 needed)`);
                    
                    if (commonWords.length >= 3) {
                        console.log(`    ✅ WORD-BASED MATCH! (${commonWords.length} common words)`);
                        return item.intent_key;
                    }
                }
            }
            
            // Check canonical question
            if (item.canonical_question) {
                const canonicalLower = item.canonical_question.toLowerCase().replace(/[?.,!]/g, '').trim();
                const questionClean = question.replace(/[?.,!]/g, '').trim();
                
                console.log(`📋 Canonical: "${item.canonical_question}" → "${canonicalLower}"`);
                
                if (canonicalLower.includes(questionClean) || questionClean.includes(canonicalLower)) {
                    console.log(`    ✅ CANONICAL MATCH!`);
                    return item.intent_key;
                }
            }
        }
        
        console.log('\n❌ No intent detected - all items checked');
        return null;
        
    } catch (error) {
        console.error('❌ Intent detection debug failed:', error);
        return null;
    }
};

// Debug function to show routing decisions
window.debugRouting = async function(userQuestion) {
    console.log('🔍 Debugging routing for:', userQuestion);
    
    try {
        // Step 1: Check direct match
        console.log('\n📋 Step 1: Checking direct match...');
        const localMatch = await findDirectMatch(userQuestion);
        if (localMatch) {
            console.log('✅ Direct match found:', localMatch.intent_key);
            console.log('   Answer preview:', localMatch.answer_en?.substring(0, 100) + '...');
            return { route: 'direct_match', data: localMatch };
        } else {
            console.log('❌ No direct match found');
        }
        
        // Step 2: Check intent detection
        console.log('\n📋 Step 2: Checking intent detection...');
        const intent = await detectIntent(userQuestion);
        if (intent) {
            console.log('✅ Intent detected:', intent);
            const kb = await loadKB();
            const intentItem = kb.find(item => item.intent_key === intent);
            if (intentItem) {
                console.log('✅ Intent item found:', intentItem.id);
                console.log('   Answer preview:', intentItem.answer_en?.substring(0, 100) + '...');
                return { route: 'intent_match', data: intentItem };
            } else {
                console.log('❌ Intent item not found in KB');
            }
        } else {
            console.log('❌ No intent detected');
        }
        
        // Step 3: Check ChatGPT fallback context
        console.log('\n📋 Step 3: Checking ChatGPT fallback context...');
        const kb = await loadKB();
        let contextSnippets = [];
        
        const question = userQuestion.toLowerCase();
        for (const item of kb) {
            let relevance = 0;
            
            if (item.question_variants) {
                for (const variant of item.question_variants) {
                    if (variant.toLowerCase().includes(question) || question.includes(variant.toLowerCase())) {
                        relevance += 10;
                    }
                }
            }
            
            if (item.tags) {
                for (const tag of item.tags) {
                    if (question.includes(tag.toLowerCase())) {
                        relevance += 5;
                    }
                }
            }
            
            if (item.answer_en && item.answer_en.toLowerCase().includes(question)) {
                relevance += 3;
            }
            
            if (relevance > 0) {
                contextSnippets.push({
                    id: item.id,
                    intent: item.intent_key,
                    relevance: relevance
                });
            }
        }
        
        if (contextSnippets.length > 0) {
            console.log('✅ Found relevant context snippets:', contextSnippets.length);
            contextSnippets.forEach(snippet => {
                console.log(`   - ${snippet.id} (${snippet.intent}): relevance ${snippet.relevance}`);
            });
            return { route: 'chatgpt_with_context', context: contextSnippets };
        } else {
            console.log('❌ No relevant context found for ChatGPT');
            return { route: 'chatgpt_no_context' };
        }
        
    } catch (error) {
        console.error('❌ Routing debug failed:', error);
        return { route: 'error', error: error.message };
    }
};

// Simple fetch test to debug network issues
window.testFetch = async function() {
    console.log('🔍 === SIMPLE FETCH TEST ===');
    
    try {
        // Test 1: Simple fetch to current origin
        console.log('📋 Test 1: Fetching current page...');
        const currentPageResponse = await fetch(window.location.href);
        console.log('✅ Current page fetch:', {
            status: currentPageResponse.status,
            ok: currentPageResponse.ok
        });
        
        // Test 2: Fetch to data directory
        console.log('\n📋 Test 2: Fetching data directory...');
        const dataDirResponse = await fetch('./data/');
        console.log('✅ Data directory fetch:', {
            status: dataDirResponse.status,
            ok: dataDirResponse.ok
        });
        
        // Test 3: Fetch to specific JSON file
        console.log('\n📋 Test 3: Fetching specific JSON...');
        const jsonResponse = await fetch('./data/jon_know_how.json');
        console.log('✅ JSON fetch:', {
            status: jsonResponse.status,
            ok: jsonResponse.ok,
            contentType: jsonResponse.headers.get('content-type')
        });
        
        if (jsonResponse.ok) {
            const data = await jsonResponse.json();
            console.log('✅ JSON parsed successfully:', {
                type: typeof data,
                isArray: Array.isArray(data),
                length: Array.isArray(data) ? data.length : 'N/A'
            });
        }
        
        return { success: true };
        
    } catch (error) {
        console.error('❌ Fetch test failed:', error);
        return { success: false, error: error.message };
    }
};
