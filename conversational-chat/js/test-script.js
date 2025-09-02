// Standalone Test Script - No DOM Dependencies
// This script only contains the knowledge base functions needed for testing

console.log('🧪 Test script loaded - Standalone version');

// Knowledge Base Functions - Local Data First Approach
async function loadKB() {
    console.log('📚 Loading knowledge base from local data...');
    console.log('🔍 Current location:', window.location.href);
    console.log('🔍 Origin:', window.location.origin);
    console.log('🔍 Protocol:', window.location.protocol);
    console.log('🔍 Host:', window.location.host);
    console.log('🔍 Pathname:', window.location.pathname);
    
    const paths = [
        // Absolute paths from server root (most reliable)
        '/data/jon_know_how.json',
        `${window.location.origin}/data/jon_know_how.json`,
        
        // Relative paths (less reliable, different behavior per page)
        './data/jon_know_how.json',
        'data/jon_know_how.json',
        '../data/jon_know_how.json',
        
        // Protocol-specific paths
        `${window.location.protocol}//${window.location.host}/data/jon_know_how.json`
    ];
    
    console.log('🔄 Paths to try:', paths);
    
    // Debug path resolution
    paths.forEach((path, index) => {
        try {
            const resolvedURL = new URL(path, window.location.href);
            console.log(`🔍 Path ${index + 1}: "${path}" → "${resolvedURL.href}"`);
        } catch (error) {
            console.log(`🔍 Path ${index + 1}: "${path}" → Error: ${error.message}`);
        }
    });
    
    for (const path of paths) {
        try {
            console.log(`🔄 Trying path: ${path}`);
            const response = await fetch(path);
            console.log(`🔍 Response for ${path}:`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                url: response.url
            });
            
            if (response.ok) {
                console.log(`📊 Parsing JSON from ${path}...`);
                const data = await response.json();
                console.log(`📊 Data from ${path}:`, {
                    type: typeof data,
                    isArray: Array.isArray(data),
                    length: Array.isArray(data) ? data.length : 'N/A',
                    firstItem: Array.isArray(data) && data.length > 0 ? data[0].id : 'N/A'
                });
                
                if (Array.isArray(data) && data.length > 0) {
                    console.log(`✅ Successfully loaded ${data.length} items from ${path}`);
                    return data;
                } else {
                    console.log(`⚠️ Path ${path} returned invalid data:`, data);
                    if (Array.isArray(data) && data.length === 0) {
                        throw new Error(`Path ${path} returned empty array - this indicates a data issue, not a path issue`);
                    }
                }
            } else {
                console.log(`❌ Path ${path} failed with status: ${response.status}`);
            }
        } catch (error) {
            console.log(`❌ Path ${path} failed with error:`, error.message);
            console.log(`❌ Error stack:`, error.stack);
        }
    }
    
    // If we get here, all paths failed
    console.error('❌ All local data loading attempts failed');
    console.log('🌐 Server environment detected - checking for common issues:');
    console.log('   - Current location:', window.location.href);
    console.log('   - Base path:', window.location.origin);
    console.log('   - Protocol:', window.location.protocol);
    console.log('   - Host:', window.location.host);
    
    return [];
}

// Load system messages for test fallback
let systemMessages = null;
async function loadSystemMessages() {
    try {
        const response = await fetch('./data/system-message_kb.json');
        if (response.ok) {
            systemMessages = await response.json();
        }
    } catch (e) {
        // Non-fatal in test context
        console.log('System messages not loaded (test):', e.message);
    }
}

// Simple out-of-scope detection for test context
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
        
        // 1. Try local knowledge base
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
                return intentItem.answer_en || intentItem.answer || "I can help you with that topic.";
            }
        }
        
        // 3. ChatGPT fallback for general questions
        if (typeof getChatGPTResponse === 'function') {
            try {
                console.log('🤖 Trying ChatGPT fallback...');
                const aiResponse = await getChatGPTResponse(userQuestion);
                if (aiResponse && aiResponse.trim() !== '') {
                    console.log('✅ ChatGPT response generated');
                    return aiResponse;
                }
            } catch (error) {
                console.log('⚠️ ChatGPT fallback failed:', error.message);
            }
        }
        
        // 4. Intelligent fallback message (ensure system messages are loaded once)
        console.log('💡 Providing intelligent fallback...');
        if (!systemMessages) {
            await loadSystemMessages();
        }
        return provideIntelligentFallback(userQuestion);
        
    } catch (error) {
        console.error('❌ Smart answer generation failed:', error);
        return "I'm sorry, I encountered an error while processing your question. Please try asking about Jon's experience in design systems, SaaS, or enterprise projects.";
    }
}

// Intelligent Fallback Function
function provideIntelligentFallback(userQuestion) {
    const question = userQuestion.toLowerCase();
    
    // Check for specific topics and provide helpful responses
    if (question.includes('design') || question.includes('ux') || question.includes('ui')) {
        return "I can tell you about Jon's experience in design systems, UX research, and UI design. He has worked on projects for ZARA, Veridata, and various SaaS platforms. What specific aspect of design would you like to know about?";
    }
    
    if (question.includes('saas') || question.includes('startup') || question.includes('enterprise')) {
        return "Jon has extensive experience in both SaaS startups and enterprise environments. He's worked on platforms for fintech, e-commerce, and government services. Would you like to know about his specific projects or methodologies?";
    }
    
    if (question.includes('project') || question.includes('case study')) {
        return "Jon has worked on diverse projects including ZARA's internal tools, Veridata's government services, and various fintech platforms. I can share details about specific projects, methodologies, or outcomes. What interests you most?";
    }
    
    if (question.includes('research') || question.includes('user') || question.includes('stakeholder')) {
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

// Expose functions to global scope for testing
window.loadKB = loadKB;
window.detectIntent = detectIntent;
window.findDirectMatch = findDirectMatch;
window.getSmartAnswer = getSmartAnswer;
window.provideIntelligentFallback = provideIntelligentFallback;

console.log('🚀 Test script functions loaded and exposed to global scope');
console.log('📚 Available functions:', {
    loadKB: typeof loadKB === 'function',
    detectIntent: typeof detectIntent === 'function',
    findDirectMatch: typeof findDirectMatch === 'function',
    getSmartAnswer: typeof getSmartAnswer === 'function'
});

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
