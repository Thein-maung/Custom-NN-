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

// Global error handler
window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', event.error);
    status.textContent = '❌ System Error - Check console';
    status.style.color = 'red';
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    status.textContent = '❌ Async Error - Check console';
    status.style.color = 'red';
});

// Fast QR generation
async function showQR() {
    try {
        console.log('📱 App: Generating QR code...');
        const seedB64 = btoa(String.fromCharCode(...currentSeed));
        console.log('📱 App: Seed (base64):', seedB64);
        
        await QRCode.toCanvas(qrcvs, seedB64, { 
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        qrcvs.hidden = false;
        console.log('✅ App: QR code generated successfully');
    } catch (error) {
        console.error('❌ App: QR generation failed:', error);
        status.textContent = '❌ QR generation failed';
        status.style.color = 'red';
    }
}

// Quick initialization
window.addEventListener('load', async () => {
    console.log('🚀 App: Window loaded, starting initialization...');
    status.textContent = '🚀 Starting quantum network...';
    
    try {
        // Show QR immediately
        await showQR();
        
        status.textContent = '🤖 AI crypto ready';
        status.style.color = 'green';
        output.textContent = 'Scan or show QR to entangle';
        console.log('✅ App: Initialization completed successfully');
        
    } catch (error) {
        console.error('❌ App: Initialization failed:', error);
        status.textContent = '❌ Initialization failed';
        status.style.color = 'red';
    }
});

// Enhanced scanning with better UX
scanBtn.onclick = () => {
    console.log('📷 App: Scan button clicked');
    status.textContent = '📷 Scanning...';
    status.style.color = 'blue';
    
    // Simple QR input for demo (in real app, use camera)
    const qrData = prompt('Enter QR code data (or use camera in real implementation):');
    console.log('📷 App: QR data received:', qrData ? `${qrData.substring(0, 20)}...` : 'null');
    
    if (qrData) {
        processQRData(qrData);
    } else {
        console.log('📷 App: QR input cancelled');
        status.textContent = '📱 Ready - Show QR or Scan';
        status.style.color = 'green';
    }
};

async function processQRData(data) {
    try {
        console.log('🔐 App: Processing QR data...');
        status.textContent = '🔐 Processing entanglement...';
        
        console.log('🔐 App: Decoding base64 QR data...');
        const bin = Uint8Array.from(atob(data), c => c.charCodeAt(0));
        console.log('🔐 App: Decoded data length:', bin.length);
        
        if (bin.length !== 32) {
            throw new Error(`Invalid seed length: ${bin.length} (expected 32)`);
        }
        
        // Validate seed content
        const allZeros = bin.every(byte => byte === 0);
        console.log('🔐 App: Seed all zeros check:', allZeros);
        if (allZeros) {
            throw new Error('Invalid seed (all zeros)');
        }
        
        status.textContent = '🤖 Loading quantum AI...';
        console.log('🤖 App: Setting seed and loading AI...');
        
        currentSeed = bin;
        await setSeed(bin);
        isEntangled = true;
        
        console.log('✅ App: Quantum entanglement successful');
        status.textContent = '✅ Quantum Entangled!';
        status.style.color = 'green';
        output.textContent = 'Secure AI connection established!';
        
        // Update QR to show we're now paired
        await showQR();
        
        // Enable navigation immediately
        enableNavigation(true);
        console.log('✅ App: Navigation enabled');
        
    } catch (error) {
        console.error('❌ App: QR processing failed:', error);
        console.error('❌ App: Error stack:', error.stack);
        status.textContent = `❌ ${error.message}`;
        status.style.color = 'red';
        output.textContent = 'Please try scanning again';
    }
}

// Seed regeneration
regenSeedBtn.onclick = () => {
    console.log('🔄 App: Regenerating seed...');
    currentSeed = crypto.getRandomValues(new Uint8Array(32));
    isEntangled = false;
    enableNavigation(false);
    status.textContent = '🔄 New quantum seed generated';
    status.style.color = 'blue';
    output.textContent = 'Scan or show the new QR code';
    showQR();
    console.log('✅ App: Seed regenerated');
};

// Better navigation handling
function enableNavigation(enabled) {
    console.log(`🔧 App: Setting navigation to ${enabled ? 'enabled' : 'disabled'}`);
    textBtn.disabled = !enabled;
    voiceBtn.disabled = !enabled;
    
    if (enabled) {
        textBtn.style.opacity = '1';
        voiceBtn.style.opacity = '1';
    } else {
        textBtn.style.opacity = '0.5';
        voiceBtn.style.opacity = '0.5';
    }
}

// Initialize navigation state
enableNavigation(false);

textBtn.onclick = () => {
    console.log('💬 App: Text chat button clicked');
    if (!isEntangled) {
        console.warn('⚠️ App: Attempted to access text chat without entanglement');
        alert('Please entangle first by scanning a QR code!');
        return;
    }
    console.log('💬 App: Navigating to chat.html');
    location.href = 'chat.html';
};

voiceBtn.onclick = () => {
    console.log('🎙️ App: Voice chat button clicked');
    if (!isEntangled) {
        console.warn('⚠️ App: Attempted to access voice chat without entanglement');
        alert('Please entangle first by scanning a QR code!');
        return;
    }
    console.log('🎙️ App: Navigating to voice.html');
    location.href = 'voice.html';
};

// Export state for debugging
window.getAppState = () => {
    const state = {
        isEntangled,
        seedLength: currentSeed.length,
        seedPreview: Array.from(currentSeed.slice(0, 4)),
        currentTime: new Date().toISOString()
    };
    console.log('🔍 App: Current state:', state);
    return state;
};

// Service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            console.log('🔧 App: Registering service worker...');
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ App: Service worker registered:', registration);
        } catch (registrationError) {
            console.error('❌ App: Service worker registration failed:', registrationError);
        }
    });
} else {
    console.warn('⚠️ App: Service workers not supported');
}

console.log('🔧 App: Setup completed, waiting for user interaction...');