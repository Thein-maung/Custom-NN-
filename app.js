import { setSeed } from './crypto.js';

let currentSeed = crypto.getRandomValues(new Uint8Array(32));
let isEntangled = false;

const status = document.getElementById('status');
const qrcvs = document.getElementById('qrcvs');
const output = document.getElementById('output');
const scanBtn = document.getElementById('scan');
const regenSeedBtn = document.getElementById('regen-seed');
const textBtn = document.getElementById('text-chat');
const voiceBtn = document.getElementById('voice-chat');

console.log('🔧 App: Starting initialization...');

// Simple QR generation without external library
function showQR() {
    try {
        console.log('📱 App: Generating QR code...');
        const seedB64 = btoa(String.fromCharCode(...currentSeed));
        
        // Create simple text-based QR for now
        const qrText = `QUANTUM-SEED:${seedB64}`;
        output.textContent = `Share this code: ${seedB64.substring(0, 16)}...`;
        
        console.log('✅ App: QR data ready');
        
    } catch (error) {
        console.error('❌ App: QR setup failed:', error);
        status.textContent = '❌ Setup failed';
        status.style.color = 'red';
    }
}

// Quick initialization
window.addEventListener('load', async () => {
    console.log('🚀 App: Window loaded');
    status.textContent = '🚀 Starting...';
    
    try {
        // Show basic info immediately
        showQR();
        
        status.textContent = '✅ Ready';
        status.style.color = 'green';
        output.textContent = 'Enter partner code below';
        
        console.log('✅ App: Initialization completed');
        
    } catch (error) {
        console.error('❌ App: Initialization failed:', error);
        status.textContent = '❌ Init failed - check console';
        status.style.color = 'red';
    }
});

// Manual code entry instead of QR scanning
scanBtn.onclick = () => {
    const partnerCode = prompt('Enter your partner\'s quantum code:');
    if (partnerCode) {
        processPartnerCode(partnerCode);
    }
};

async function processPartnerCode(code) {
    try {
        status.textContent = '🔐 Entangling...';
        
        // Remove prefix if present
        const cleanCode = code.replace('QUANTUM-SEED:', '');
        const bin = Uint8Array.from(atob(cleanCode), c => c.charCodeAt(0));
        
        if (bin.length !== 32) {
            throw new Error('Invalid code length');
        }
        
        currentSeed = bin;
        await setSeed(bin);
        isEntangled = true;
        
        status.textContent = '✅ Quantum Entangled!';
        status.style.color = 'green';
        output.textContent = 'Secure connection established!';
        
        enableNavigation(true);
        showQR(); // Update display
        
    } catch (error) {
        console.error('❌ Partner code failed:', error);
        status.textContent = '❌ Invalid code';
        status.style.color = 'red';
    }
}

regenSeedBtn.onclick = () => {
    currentSeed = crypto.getRandomValues(new Uint8Array(32));
    isEntangled = false;
    enableNavigation(false);
    status.textContent = '🔄 New seed';
    showQR();
};

function enableNavigation(enabled) {
    textBtn.disabled = !enabled;
    voiceBtn.disabled = !enabled;
}

enableNavigation(false);

textBtn.onclick = () => {
    if (!isEntangled) {
        alert('Please entangle first!');
        return;
    }
    location.href = 'chat.html';
};

voiceBtn.onclick = () => {
    if (!isEntangled) {
        alert('Please entangle first!');
        return;
    }
    location.href = 'voice.html';
};

// Service worker (non-blocking)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered'))
        .catch(err => console.log('SW failed:', err));
}
