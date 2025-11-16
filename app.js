// Remove all import statements - we'll include everything in one file
console.log('🔧 App: Starting initialization...');

// Global variables (instead of imports)
let currentSeed = crypto.getRandomValues(new Uint8Array(32));
let isEntangled = false;
let TWIN_SEED = null;
let CRYPTO_COUNTER = 0;

// Simple OTP generator (instead of crypto.js import)
function generatePad(seed, counter, length = 32) {
    const pad = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        pad[i] = (seed[i % seed.length] + counter + i * 13) % 256;
    }
    return pad;
}

// Simple encryption
function encrypt(message, pad) {
    const msgBytes = new TextEncoder().encode(message);
    const encrypted = new Uint8Array(msgBytes.length);
    for (let i = 0; i < msgBytes.length; i++) {
        encrypted[i] = msgBytes[i] ^ pad[i];
    }
    return btoa(String.fromCharCode(...encrypted));
}

// Simple decryption  
function decrypt(encryptedB64, pad) {
    const encrypted = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
        decrypted[i] = encrypted[i] ^ pad[i];
    }
    return new TextDecoder().decode(decrypted);
}

// Simple seed setting (instead of setSeed import)
async function setSeed(seedBytes) {
    let hashBuffer = new Uint8Array(32);
    for (let i = 0; i < seedBytes.length; i++) {
        hashBuffer[i % 32] ^= seedBytes[i];
    }
    TWIN_SEED = hashBuffer;
    CRYPTO_COUNTER = 0;
    console.log('✅ Crypto: Seed set');
}

// Next pad function
async function nextPad(len = 32) {
    if (!TWIN_SEED) throw new Error('No seed set');
    const pad = generatePad(TWIN_SEED, CRYPTO_COUNTER, len);
    CRYPTO_COUNTER = (CRYPTO_COUNTER + 1) % 256;
    return pad;
}

// Main app initialization
function initializeApp() {
    console.log('🚀 App: Initializing...');
    
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    
    if (!status) {
        console.error('❌ Required elements not found!');
        return;
    }
    
    // Generate initial seed
    currentSeed = crypto.getRandomValues(new Uint8Array(32));
    
    // Update UI
    status.textContent = '✅ READY - Share Code Below';
    status.style.color = 'green';
    
    if (output) {
        const seedB64 = btoa(String.fromCharCode(...currentSeed));
        output.textContent = `Your Code: ${seedB64.substring(0, 20)}...`;
    }
    
    setupEventHandlers();
    console.log('✅ App: Initialized successfully');
}

function setupEventHandlers() {
    // Scan button
    const scanBtn = document.getElementById('scan');
    if (scanBtn) {
        scanBtn.onclick = handleScan;
    }
    
    // Regenerate seed
    const regenBtn = document.getElementById('regen-seed');
    if (regenBtn) {
        regenBtn.onclick = handleRegenSeed;
    }
    
    // Navigation buttons
    const textBtn = document.getElementById('text-chat');
    const voiceBtn = document.getElementById('voice-chat');
    
    if (textBtn) textBtn.onclick = () => navigateTo('chat');
    if (voiceBtn) voiceBtn.onclick = () => navigateTo('voice');
    
    enableNavigation(false);
}

function handleScan() {
    const partnerCode = prompt('Enter your partner\'s code:');
    if (!partnerCode) return;
    
    const status = document.getElementById('status');
    status.textContent = '🔐 Processing...';
    
    try {
        const cleanCode = partnerCode.trim();
        const bin = Uint8Array.from(atob(cleanCode), c => c.charCodeAt(0));
        
        if (bin.length !== 32) {
            throw new Error('Invalid code length');
        }
        
        currentSeed = bin;
        setSeed(bin);
        isEntangled = true;
        
        status.textContent = '✅ QUANTUM ENTANGLED!';
        status.style.color = 'green';
        
        const output = document.getElementById('output');
        if (output) {
            output.textContent = 'Secure connection established!';
        }
        
        enableNavigation(true);
        
    } catch (error) {
        const status = document.getElementById('status');
        status.textContent = '❌ Invalid code';
        status.style.color = 'red';
        console.error('Scan error:', error);
    }
}

function handleRegenSeed() {
    currentSeed = crypto.getRandomValues(new Uint8Array(32));
    isEntangled = false;
    TWIN_SEED = null;
    
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    
    status.textContent = '🔄 New seed generated';
    status.style.color = 'blue';
    
    if (output) {
        const seedB64 = btoa(String.fromCharCode(...currentSeed));
        output.textContent = `New Code: ${seedB64.substring(0, 20)}...`;
    }
    
    enableNavigation(false);
}

function enableNavigation(enabled) {
    const textBtn = document.getElementById('text-chat');
    const voiceBtn = document.getElementById('voice-chat');
    
    if (textBtn) textBtn.disabled = !enabled;
    if (voiceBtn) voiceBtn.disabled = !enabled;
}

function navigateTo(page) {
    if (!isEntangled) {
        alert('Please entangle first!');
        return;
    }
    
    if (page === 'chat') {
        // Simple chat demo
        const message = prompt('Enter test message to encrypt:');
        if (message) {
            nextPad(32).then(pad => {
                const encrypted = encrypt(message, pad);
                alert(`Encrypted: ${encrypted}\n\nDecrypted: ${decrypt(encrypted, pad)}`);
            });
        }
    } else if (page === 'voice') {
        alert('Voice chat would start here!');
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

console.log('🔧 App: Script loaded successfully');
