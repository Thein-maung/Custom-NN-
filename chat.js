import { nextPad, encrypt, decrypt, getPadHealth } from './crypto.js';

const statusEl = document.getElementById('status');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send');
const regenBtn = document.getElementById('regen');
const messagesEl = document.getElementById('messages');

let currentPad;

console.log('💬 Chat: Module initializing...');

window.addEventListener('load', async () => {
    console.log('💬 Chat: Window loaded, initializing chat...');
    
    try {
        console.log('💬 Chat: Generating initial OTP pad...');
        currentPad = await nextPad(32);
        const health = getPadHealth();
        
        showStatus(`✅ Quantum Synced (${health.padsRemaining} pads)`, 'green');
        enableInput(true);
        
        addMessage('🔗 Quantum entanglement established', 'system');
        addMessage('🤖 AI OTP pads ready for secure messaging', 'system');
        
        console.log('✅ Chat: Initialization completed successfully');
        
    } catch (error) {
        console.error('❌ Chat: Initialization failed:', error);
        console.error('❌ Chat: Error stack:', error.stack);
        showStatus('❌ Quantum entanglement failed', 'red');
        enableInput(false);
        addMessage('⚠️ Return to main page to entangle first', 'error');
    }
});

sendBtn.onclick = async () => {
    const msg = msgInput.value.trim();
    console.log('💬 Chat: Send button clicked, message:', msg);
    
    if (!msg || !currentPad) {
        console.warn('💬 Chat: Send attempted with empty message or no pad');
        return;
    }
    
    try {
        console.log('💬 Chat: Encrypting message...');
        const encrypted = encrypt(msg, currentPad);
        addMessage(`You: ${msg}`, 'sent');
        addMessage(`Quantum Encrypted: ${encrypted}`, 'encrypted');
        
        msgInput.value = '';
        console.log('💬 Chat: Generating new OTP pad...');
        currentPad = await nextPad(32);
        
        const health = getPadHealth();
        showStatus(`✅ Quantum Synced (${health.padsRemaining} pads)`, 'green');
        
        console.log('✅ Chat: Message sent and new pad generated');
        
    } catch (error) {
        console.error('❌ Chat: Send failed:', error);
        console.error('❌ Chat: Error stack:', error.stack);
        addMessage('❌ Quantum encryption failed', 'error');
    }
};

msgInput.addEventListener('paste', async () => {
    console.log('💬 Chat: Paste event detected');
    
    setTimeout(async () => {
        const encrypted = msgInput.value.trim();
        console.log('💬 Chat: Processing pasted content:', encrypted.substring(0, 50) + '...');
        
        if (!encrypted || !currentPad) {
            console.warn('💬 Chat: Paste attempted with empty content or no pad');
            return;
        }
        
        try {
            console.log('💬 Chat: Decrypting pasted content...');
            const plaintext = decrypt(encrypted, currentPad);
            addMessage(`Partner: ${plaintext}`, 'received');
            msgInput.value = '';
            
            console.log('💬 Chat: Generating new OTP pad after decryption...');
            currentPad = await nextPad(32);
            const health = getPadHealth();
            showStatus(`✅ Quantum Synced (${health.padsRemaining} pads)`, 'green');
            
            console.log('✅ Chat: Message decrypted successfully');
            
        } catch (error) {
            console.error('❌ Chat: Decryption failed:', error);
            console.error('❌ Chat: Error stack:', error.stack);
            addMessage('❌ Quantum decryption failed - check sync', 'error');
        }
    }, 10);
});

regenBtn.onclick = async () => {
    console.log('💬 Chat: Regenerate pad button clicked');
    
    try {
        console.log('💬 Chat: Generating new OTP pad...');
        currentPad = await nextPad(32);
        const health = getPadHealth();
        addMessage('🔄 New quantum pad generated', 'system');
        showStatus(`✅ Quantum Synced (${health.padsRemaining} pads)`, 'green');
        
        console.log('✅ Chat: New pad generated successfully');
        
    } catch (error) {
        console.error('❌ Chat: Pad regeneration failed:', error);
        console.error('❌ Chat: Error stack:', error.stack);
        addMessage('❌ Quantum pad regeneration failed', 'error');
    }
};

function showStatus(message, color) {
    console.log(`💬 Chat: Status update - ${message}`);
    statusEl.textContent = message;
    statusEl.style.color = color;
}

function enableInput(enabled) {
    console.log(`💬 Chat: Setting input to ${enabled ? 'enabled' : 'disabled'}`);
    msgInput.disabled = !enabled;
    sendBtn.disabled = !enabled;
    if (enabled) {
        msgInput.placeholder = 'Type your quantum message...';
        msgInput.focus();
    }
}

function addMessage(text, type) {
    console.log(`💬 Chat: Adding ${type} message: ${text.substring(0, 50)}...`);
    
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    const messageText = document.createElement('span');
    messageText.textContent = text;
    
    const timeEl = document.createElement('small');
    timeEl.textContent = ` [${timestamp}]`;
    timeEl.style.opacity = '0.6';
    timeEl.style.marginLeft = '8px';
    
    div.appendChild(messageText);
    div.appendChild(timeEl);
    
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Keyboard shortcuts
msgInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        console.log('💬 Chat: Enter key pressed, sending message');
        e.preventDefault();
        sendBtn.click();
    }
});

console.log('✅ Chat: Module loaded successfully');