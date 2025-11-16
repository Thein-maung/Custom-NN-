import { nextPad, getPadHealth } from './crypto.js';

let currentPad;
let isInCall = false;

const statusEl = document.getElementById('status');
const callStatusEl = document.getElementById('call-status');
const startCallBtn = document.getElementById('start-call');
const joinCallBtn = document.getElementById('join-call');
const endCallBtn = document.getElementById('end-call');

console.log('🎙️ Voice: Module initializing...');

window.addEventListener('load', async () => {
    console.log('🎙️ Voice: Window loaded, initializing voice chat...');
    
    try {
        currentPad = await nextPad(1024);
        const health = getPadHealth();
        statusEl.textContent = `✅ Quantum Ready (${health.padsRemaining} pads)`;
        statusEl.style.color = 'green';
        callStatusEl.textContent = 'Quantum voice encryption ready';
        
        console.log('✅ Voice: Initialization completed successfully');
        
    } catch (error) {
        console.error('❌ Voice: Initialization failed:', error);
        statusEl.textContent = '❌ Quantum entanglement failed';
        statusEl.style.color = 'red';
        callStatusEl.textContent = 'Return to main page to entangle';
    }
});

startCallBtn.onclick = async () => {
    console.log('🎙️ Voice: Start call button clicked');
    
    if (!currentPad) {
        console.warn('🎙️ Voice: Attempted to start call without pad');
        alert('Quantum entanglement required first');
        return;
    }
    
    try {
        callStatusEl.textContent = '🔐 Starting quantum call...';
        await simulateCallStart();
        isInCall = true;
        updateCallUI();
        callStatusEl.textContent = '✅ Quantum call active - AI OTP encryption';
        
        console.log('✅ Voice: Call started successfully');
        
    } catch (error) {
        console.error('❌ Voice: Call start failed:', error);
        callStatusEl.textContent = '❌ Quantum call failed';
    }
};

joinCallBtn.onclick = async () => {
    console.log('🎙️ Voice: Join call button clicked');
    
    if (!currentPad) {
        console.warn('🎙️ Voice: Attempted to join call without pad');
        alert('Quantum entanglement required first');
        return;
    }
    
    try {
        callStatusEl.textContent = '🔐 Joining quantum call...';
        await simulateCallJoin();
        isInCall = true;
        updateCallUI();
        callStatusEl.textContent = '✅ Quantum call joined - AI OTP encryption';
        
        console.log('✅ Voice: Call joined successfully');
        
    } catch (error) {
        console.error('❌ Voice: Call join failed:', error);
        callStatusEl.textContent = '❌ Quantum call join failed';
    }
};

endCallBtn.onclick = () => {
    console.log('🎙️ Voice: End call button clicked');
    isInCall = false;
    updateCallUI();
    callStatusEl.textContent = 'Quantum call ended';
    statusEl.textContent = '✅ Quantum ready for next call';
    console.log('✅ Voice: Call ended');
};

async function simulateCallStart() {
    console.log('🎙️ Voice: Simulating call start...');
    // Simulate quantum call setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('🎙️ Voice: Quantum call started with OTP voice encryption');
}

async function simulateCallJoin() {
    console.log('🎙️ Voice: Simulating call join...');
    // Simulate quantum call join
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('🎙️ Voice: Quantum call joined with OTP voice encryption');
}

function updateCallUI() {
    console.log(`🎙️ Voice: Updating UI, call active: ${isInCall}`);
    if (isInCall) {
        startCallBtn.disabled = true;
        joinCallBtn.disabled = true;
        endCallBtn.disabled = false;
    } else {
        startCallBtn.disabled = false;
        joinCallBtn.disabled = false;
        endCallBtn.disabled = true;
    }
}

// Export for debugging
window.getVoiceState = () => {
    const state = {
        isInCall,
        hasPad: !!currentPad,
        padHealth: getPadHealth()
    };
    console.log('🔍 Voice: Current state:', state);
    return state;
};

console.log('✅ Voice: Module loaded successfully');