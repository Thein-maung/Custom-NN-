import { loadTwin, infer } from './twinnet.js';

let TWIN_SEED;
let COUNTER = 0;

console.log('🔐 Crypto: Module initializing...');

export async function setSeed(seedBytes) {
    console.log('🔐 Crypto: setSeed() called with bytes length:', seedBytes.length);
    
    if (!seedBytes || seedBytes.length < 16) {
        const error = new Error('Seed must be at least 16 bytes');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    try {
        console.log('🔐 Crypto: Hashing seed with SHA-256...');
        // Quantum hash function
        const hash = await crypto.subtle.digest('SHA-256', seedBytes);
        TWIN_SEED = new Uint8Array(hash);
        COUNTER = 0;
        
        console.log('🔐 Crypto: Seed hash result:', Array.from(TWIN_SEED.slice(0, 5)), '...');
        
        // Preload quantum AI
        console.log('🔐 Crypto: Preloading quantum AI...');
        await loadTwin();
        
        console.log('✅ Crypto: Quantum seed set, AI ready');
        console.log('🔐 Crypto: Counter reset to 0');
        
    } catch (error) {
        console.error('❌ Crypto: Seed setting failed:', error);
        console.error('❌ Crypto: Error stack:', error.stack);
        throw new Error('Failed to set quantum seed: ' + error.message);
    }
}

export async function nextPad(len = 32) {
    console.log(`🔐 Crypto: nextPad() called for ${len} bytes`);
    
    if (!TWIN_SEED) {
        const error = new Error('Entangle first - no quantum seed');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    if (len <= 0 || len > 1024) {
        const error = new Error('Pad length must be between 1 and 1024');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    try {
        // Create quantum input: seed + counter
        const input = new Uint8Array(33);
        input.set(TWIN_SEED, 0);
        input[32] = COUNTER;
        
        console.log('🔐 Crypto: AI input prepared, counter:', COUNTER);
        console.log('🔐 Crypto: Input sample:', Array.from(input.slice(0, 5)), '...');
        
        // Generate OTP pad using quantum AI
        const normalizedInput = Array.from(input).map(v => v / 255);
        console.log('🔐 Crypto: Normalized input range:', Math.min(...normalizedInput), 'to', Math.max(...normalizedInput));
        
        const raw = infer([normalizedInput]);
        console.log('🔐 Crypto: Raw AI output length:', raw.length);
        console.log('🔐 Crypto: Raw output range:', Math.min(...raw), 'to', Math.max(...raw));
        
        // Increment quantum counter
        COUNTER = (COUNTER + 1) % 256;
        
        // Convert AI output to OTP bytes
        const pad = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            let value = Math.floor((raw[i % raw.length] + 1) * 127.5);
            pad[i] = Math.max(0, Math.min(255, value));
        }
        
        console.log(`✅ Crypto: Generated quantum pad ${len} bytes, counter: ${COUNTER}`);
        console.log('🔐 Crypto: Pad sample (first 10 bytes):', Array.from(pad.slice(0, 10)));
        
        return pad;
        
    } catch (error) {
        console.error('❌ Crypto: Quantum pad generation failed:', error);
        console.error('❌ Crypto: Error stack:', error.stack);
        throw new Error('Failed to generate quantum pad: ' + error.message);
    }
}

export function encrypt(message, pad) {
    console.log('🔐 Crypto: encrypt() called, message length:', message.length);
    
    if (!message || typeof message !== 'string') {
        const error = new Error('Message must be a non-empty string');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    if (!pad || !(pad instanceof Uint8Array)) {
        const error = new Error('Pad must be a Uint8Array');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    const msgBytes = new TextEncoder().encode(message);
    console.log('🔐 Crypto: Message bytes length:', msgBytes.length);
    
    if (msgBytes.length > pad.length) {
        const error = new Error(`Quantum pad too short: need ${msgBytes.length} bytes, have ${pad.length}`);
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    try {
        const encrypted = new Uint8Array(msgBytes.length);
        for (let i = 0; i < msgBytes.length; i++) {
            encrypted[i] = msgBytes[i] ^ pad[i];
        }
        
        const base64 = btoa(String.fromCharCode(...encrypted));
        console.log(`✅ Crypto: Encrypted ${msgBytes.length} bytes with quantum OTP`);
        console.log('🔐 Crypto: Encrypted base64 (first 50 chars):', base64.substring(0, 50));
        
        return base64;
        
    } catch (error) {
        console.error('❌ Crypto: Quantum encryption failed:', error);
        throw new Error('Quantum encryption failed');
    }
}

export function decrypt(encryptedB64, pad) {
    console.log('🔐 Crypto: decrypt() called, base64 length:', encryptedB64.length);
    
    if (!encryptedB64 || typeof encryptedB64 !== 'string') {
        const error = new Error('Encrypted data must be a non-empty string');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    if (!pad || !(pad instanceof Uint8Array)) {
        const error = new Error('Pad must be a Uint8Array');
        console.error('❌ Crypto:', error.message);
        throw error;
    }
    
    try {
        // Validate base64
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encryptedB64)) {
            const error = new Error('Invalid quantum encoding');
            console.error('❌ Crypto:', error.message);
            throw error;
        }
        
        console.log('🔐 Crypto: Decoding base64...');
        const encrypted = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
        console.log('🔐 Crypto: Decrypted bytes length:', encrypted.length);
        
        if (encrypted.length > pad.length) {
            const error = new Error(`Quantum pad too short: need ${encrypted.length} bytes, have ${pad.length}`);
            console.error('❌ Crypto:', error.message);
            throw error;
        }
        
        const decrypted = new Uint8Array(encrypted.length);
        for (let i = 0; i < encrypted.length; i++) {
            decrypted[i] = encrypted[i] ^ pad[i];
        }
        
        const message = new TextDecoder().decode(decrypted);
        console.log(`✅ Crypto: Decrypted ${encrypted.length} bytes with quantum OTP`);
        console.log('🔐 Crypto: Decrypted message:', message);
        
        return message;
        
    } catch (error) {
        console.error('❌ Crypto: Quantum decryption failed:', error);
        console.error('❌ Crypto: Error stack:', error.stack);
        throw new Error('Quantum decryption failed: ' + error.message);
    }
}

// Quantum state management
export function getCryptoState() {
    const state = {
        hasSeed: !!TWIN_SEED,
        seedLength: TWIN_SEED?.length || 0,
        counter: COUNTER,
        seedPreview: TWIN_SEED ? Array.from(TWIN_SEED.slice(0, 4)) : null
    };
    console.log('🔍 Crypto: Current state:', state);
    return state;
}

export function resetCrypto() {
    console.log('🔄 Crypto: Resetting crypto state...');
    TWIN_SEED = null;
    COUNTER = 0;
    console.log('✅ Crypto: Quantum crypto state reset');
}

export function getPadHealth() {
    const padsRemaining = 256 - COUNTER;
    const healthPercent = (padsRemaining / 256) * 100;
    
    const health = {
        counter: COUNTER,
        padsRemaining,
        healthPercent,
        status: healthPercent > 20 ? 'healthy' : healthPercent > 5 ? 'warning' : 'critical'
    };
    
    console.log('🔍 Crypto: Pad health:', health);
    return health;
}

console.log('✅ Crypto: Module loaded successfully');