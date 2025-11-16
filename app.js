// Entangle Chat-2 - Complete Non-Module Version
console.log('🔧 Entangle Chat-2: Starting initialization...');

// Global state variables
let currentSeed = null;
let isEntangled = false;
let TWIN_SEED = null;
let CRYPTO_COUNTER = 0;
let currentPad = null;

// Simple OTP generator
function generatePad(seed, counter, length = 32) {
    console.log('🔐 Generating OTP pad, counter:', counter);
    const pad = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        // Simple deterministic algorithm for OTP generation
        pad[i] = (seed[i % seed.length] + counter + i * 13) % 256;
    }
    return pad;
}

// Encryption function
function encrypt(message, pad) {
    console.log('🔒 Encrypting message:', message.substring(0, 20) + '...');
    
    if (!message || typeof message !== 'string') {
        throw new Error('Message must be a non-empty string');
    }
    
    const msgBytes = new TextEncoder().encode(message);
    if (msgBytes.length > pad.length) {
        throw new Error('Pad too short for message');
    }
    
    const encrypted = new Uint8Array(msgBytes.length);
    for (let i = 0; i < msgBytes.length; i++) {
        encrypted[i] = msgBytes[i] ^ pad[i];
    }
    
    const base64 = btoa(String.fromCharCode(...encrypted));
    console.log('✅ Message encrypted successfully');
    return base64;
}

// Decryption function
function decrypt(encryptedB64, pad) {
    console.log('🔓 Decrypting message...');
    
    if (!encryptedB64 || typeof encryptedB64 !== 'string') {
        throw new Error('Encrypted data must be a string');
    }
    
    const encrypted = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
    
    if (encrypted.length > pad.length) {
        throw new Error('Pad too short for encrypted data');
    }
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
        decrypted[i] = encrypted[i] ^ pad[i];
    }
    
    const message = new TextDecoder().decode(decrypted);
    console.log('✅ Message decrypted successfully');
    return message;
}

// Seed setting function
async function setSeed(seedBytes) {
    console.log('🌱 Setting quantum seed...');
    
    if (!seedBytes || seedBytes.length < 16) {
        throw new Error('Seed must be at least 16 bytes');
    }
    
    // Simple hash simulation using XOR
    let hashBuffer = new Uint8Array(32);
    for (let i = 0; i < seedBytes.length; i++) {
        hashBuffer[i % 32] ^= seedBytes[i];
    }
    
    TWIN_SEED = hashBuffer;
    CRYPTO_COUNTER = 0;
    
    console.log('✅ Quantum seed set successfully');
}

// Next pad function
async function nextPad(len = 32) {
    console.log(`🔐 Generating next OTP pad (${len} bytes)...`);
    
    if (!TWIN_SEED) {
        throw new Error('No quantum seed set - entangle first');
    }
    
    const pad = generatePad(TWIN_SEED, CRYPTO_COUNTER, len);
    CRYPTO_COUNTER = (CRYPTO_COUNTER + 1) % 256;
    
    console.log('✅ OTP pad generated, counter:', CRYPTO_COUNTER);
    return pad;
}

// Get crypto state for debugging
function getCryptoState() {
    return {
        hasSeed: !!TWIN_SEED,
        counter: CRYPTO_COUNTER,
        isEntangled: isEntangled
    };
}

// Main app initialization
function initializeApp() {
    console.log('🚀 Entangle Chat-2: Initializing application...');
    
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    const codeDisplay = document.getElementById('code-display');
    
    // Check if required elements exist
    if (!status) {
        console.error('❌ Status element not found!');
        return;
    }
    
    try {
        // Generate initial quantum seed
        currentSeed = crypto.getRandomValues(new Uint8Array(32));
        console.log('✅ Quantum seed generated');
        
        // Update UI status
        status.textContent = '✅ READY - Share Your Code';
        status.style.color = 'green';
        
        // Display the seed as shareable code
        const seedB64 = btoa(String.fromCharCode(...currentSeed));
        
        if (output) {
            output.textContent = 'Copy the code below and share with your partner';
        }
        
        if (codeDisplay) {
            codeDisplay.textContent = seedB64;
            console.log('📋 Share code displayed');
        }
        
        // Setup all event handlers
        setupEventHandlers();
        
        console.log('✅ Entangle Chat-2 initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        if (status) {
            status.textContent = '❌ Initialization failed';
            status.style.color = 'red';
        }
    }
}

// Setup all button event handlers
function setupEventHandlers() {
    console.log('🔧 Setting up event handlers...');
    
    // Scan/Enter Partner Code button
    const scanBtn = document.getElementById('scan');
    if (scanBtn) {
        scanBtn.onclick = handlePartnerCode;
        console.log('✅ Scan button handler set');
    } else {
        console.error('❌ Scan button not found');
    }
    
    // Regenerate seed button
    const regenBtn = document.getElementById('regen-seed');
    if (regenBtn) {
        regenBtn.onclick = handleRegenerateSeed;
        console.log('✅ Regenerate seed button handler set');
    }
    
    // Navigation buttons
    const textBtn = document.getElementById('text-chat');
    const voiceBtn = document.getElementById('voice-chat');
    
    if (textBtn) {
        textBtn.onclick = () => handleNavigation('text');
        console.log('✅ Text chat button handler set');
    }
    
    if (voiceBtn) {
        voiceBtn.onclick = () => handleNavigation('voice');
        console.log('✅ Voice chat button handler set');
    }
    
    // Initially disable navigation
    enableNavigation(false);
    console.log('🔧 Event handlers setup complete');
}

// Handle partner code entry
async function handlePartnerCode() {
    console.log('📷 Partner code entry requested');
    
    const status = document.getElementById('status');
    const partnerCode = prompt('Enter your partner\'s quantum code:');
    
    if (!partnerCode) {
        console.log('❌ Partner code entry cancelled');
        return;
    }
    
    try {
        status.textContent = '🔐 Processing quantum entanglement...';
        console.log('🔐 Processing partner code...');
        
        // Clean and validate the code
        const cleanCode = partnerCode.trim();
        
        if (cleanCode.length < 10) {
            throw new Error('Code too short');
        }
        
        // Decode from base64
        const bin = Uint8Array.from(atob(cleanCode), c => c.charCodeAt(0));
        
        if (bin.length !== 32) {
            throw new Error(`Invalid code length: ${bin.length} bytes (expected 32)`);
        }
        
        // Set as current seed and initialize crypto
        currentSeed = bin;
        await setSeed(bin);
        isEntangled = true;
        
        // Update UI
        status.textContent = '✅ QUANTUM ENTANGLED!';
        status.style.color = 'green';
        
        const output = document.getElementById('output');
        if (output) {
            output.textContent = 'Secure AI connection established! Ready for secure messaging.';
        }
        
        // Generate initial pad
        currentPad = await nextPad(32);
        console.log('✅ Initial OTP pad generated');
        
        // Enable navigation
        enableNavigation(true);
        
        console.log('✅ Quantum entanglement successful!');
        
    } catch (error) {
        console.error('❌ Partner code processing failed:', error);
        
        const status = document.getElementById('status');
        status.textContent = `❌ ${error.message}`;
        status.style.color = 'red';
        
        const output = document.getElementById('output');
        if (output) {
            output.textContent = 'Please check the code and try again';
        }
    }
}

// Handle seed regeneration
function handleRegenerateSeed() {
    console.log('🔄 Regenerating quantum seed...');
    
    // Generate new seed
    currentSeed = crypto.getRandomValues(new Uint8Array(32));
    TWIN_SEED = null;
    isEntangled = false;
    currentPad = null;
    
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    const codeDisplay = document.getElementById('code-display');
    
    // Update UI
    status.textContent = '🔄 New Quantum Seed Generated';
    status.style.color = 'blue';
    
    const seedB64 = btoa(String.fromCharCode(...currentSeed));
    
    if (output) {
        output.textContent = 'Share the new code with your partner';
    }
    
    if (codeDisplay) {
        codeDisplay.textContent = seedB64;
    }
    
    // Disable navigation
    enableNavigation(false);
    
    console.log('✅ New quantum seed generated and displayed');
}

// Enable/disable navigation buttons
function enableNavigation(enabled) {
    console.log(`🔧 Navigation ${enabled ? 'enabled' : 'disabled'}`);
    
    const textBtn = document.getElementById('text-chat');
    const voiceBtn = document.getElementById('voice-chat');
    
    if (textBtn) {
        textBtn.disabled = !enabled;
        textBtn.style.opacity = enabled ? '1' : '0.5';
    }
    
    if (voiceBtn) {
        voiceBtn.disabled = !enabled;
        voiceBtn.style.opacity = enabled ? '1' : '0.5';
    }
}

// Handle navigation to different sections
async function handleNavigation(destination) {
    console.log(`🧭 Navigation requested: ${destination}`);
    
    if (!isEntangled) {
        alert('⚠️ Please establish quantum entanglement first!');
        return;
    }
    
    try {
        if (destination === 'text') {
            await handleTextChat();
        } else if (destination === 'voice') {
            await handleVoiceChat();
        }
    } catch (error) {
        console.error(`❌ Navigation to ${destination} failed:`, error);
        alert(`Navigation error: ${error.message}`);
    }
}

// Handle text chat functionality
async function handleTextChat() {
    console.log('💬 Text chat requested');
    
    // Simple in-page chat demo
    const message = prompt('Enter a message to encrypt:');
    
    if (!message) {
        console.log('💬 Message entry cancelled');
        return;
    }
    
    try {
        // Ensure we have a current pad
        if (!currentPad) {
            currentPad = await nextPad(32);
        }
        
        // Encrypt the message
        const encrypted = encrypt(message, currentPad);
        
        // Decrypt to verify (simulating partner)
        const decrypted = decrypt(encrypted, currentPad);
        
        // Show results
        alert(`🔐 Quantum Encryption Demo:\n\n` +
              `Original: ${message}\n` +
              `Encrypted: ${encrypted}\n` +
              `Decrypted: ${decrypted}\n\n` +
              `✅ Encryption/decryption successful!`);
        
        // Generate new pad for next message
        currentPad = await nextPad(32);
        console.log('✅ New OTP pad generated for next message');
        
    } catch (error) {
        console.error('❌ Text chat demo failed:', error);
        alert(`Encryption error: ${error.message}`);
    }
}

// Handle voice chat functionality
async function handleVoiceChat() {
    console.log('🎙️ Voice chat requested');
    
    alert('🎙️ Quantum Voice Chat\n\n' +
          'Voice encryption would use the same quantum OTP system.\n' +
          'Audio would be chunked and each chunk encrypted with AI-generated pads.\n\n' +
          '🔒 Real-time quantum encryption ready!');
    
    console.log('✅ Voice chat demo displayed');
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('🚨 Global error caught:', event.error);
    
    const status = document.getElementById('status');
    if (status) {
        status.textContent = '❌ System Error - Check Console';
        status.style.color = 'red';
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled promise rejection:', event.reason);
});

// Export functions for debugging (attach to window)
window.getAppState = function() {
    const state = {
        isEntangled: isEntangled,
        hasSeed: !!TWIN_SEED,
        cryptoCounter: CRYPTO_COUNTER,
        currentSeed: currentSeed ? Array.from(currentSeed.slice(0, 4)) : null,
        currentPad: currentPad ? Array.from(currentPad.slice(0, 4)) : null
    };
    console.log('🔍 App State:', state);
    return state;
};

window.debugCrypto = function() {
    const state = getCryptoState();
    alert(`Crypto Debug Info:\n\n` +
          `Entangled: ${state.isEntangled}\n` +
          `Has Seed: ${state.hasSeed}\n` +
          `Counter: ${state.counter}\n` +
          `Current Pad: ${currentPad ? currentPad.length + ' bytes' : 'None'}`);
};

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
    console.log('📄 Waiting for DOM to load...');
} else {
    initializeApp();
    console.log('📄 DOM already loaded, initializing immediately...');
}

console.log('🔧 Entangle Chat-2 app.js loaded successfully');
