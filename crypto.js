console.log('🔐 Crypto: Module loading...');

let TWIN_SEED;
let COUNTER = 0;

// Simple deterministic OTP generator (bypass neural network for now)
function simplePadGenerator(seed, counter, len = 32) {
    console.log('🔐 Crypto: Generating pad...');
    const pad = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        // Simple deterministic algorithm
        const value = (seed[i % seed.length] + counter + i * 7) % 256;
        pad[i] = value;
    }
    return pad;
}

export async function setSeed(seedBytes) {
    console.log('🔐 Crypto: Setting seed...');
    
    if (!seedBytes || seedBytes.length < 16) {
        throw new Error('Seed too short');
    }
    
    // Simple hash simulation
    let hashBuffer = new Uint8Array(32);
    for (let i = 0; i < seedBytes.length; i++) {
        hashBuffer[i % 32] ^= seedBytes[i];
    }
    
    TWIN_SEED = hashBuffer;
    COUNTER = 0;
    
    console.log('✅ Crypto: Seed set successfully');
}

export async function nextPad(len = 32) {
    console.log('🔐 Crypto: Generating next pad...');
    
    if (!TWIN_SEED) {
        throw new Error('No seed set');
    }
    
    const pad = simplePadGenerator(TWIN_SEED, COUNTER, len);
    COUNTER = (COUNTER + 1) % 256;
    
    console.log('✅ Crypto: Pad generated, counter:', COUNTER);
    return pad;
}

export function encrypt(message, pad) {
    console.log('🔐 Crypto: Encrypting message...');
    
    const msgBytes = new TextEncoder().encode(message);
    if (msgBytes.length > pad.length) {
        throw new Error('Pad too short');
    }
    
    const encrypted = new Uint8Array(msgBytes.length);
    for (let i = 0; i < msgBytes.length; i++) {
        encrypted[i] = msgBytes[i] ^ pad[i];
    }
    
    const base64 = btoa(String.fromCharCode(...encrypted));
    console.log('✅ Crypto: Message encrypted');
    return base64;
}

export function decrypt(encryptedB64, pad) {
    console.log('🔐 Crypto: Decrypting message...');
    
    const encrypted = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0));
    
    if (encrypted.length > pad.length) {
        throw new Error('Pad too short');
    }
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
        decrypted[i] = encrypted[i] ^ pad[i];
    }
    
    const message = new TextDecoder().decode(decrypted);
    console.log('✅ Crypto: Message decrypted');
    return message;
}

export function getCryptoState() {
    return {
        hasSeed: !!TWIN_SEED,
        counter: COUNTER
    };
}

console.log('✅ Crypto: Module loaded');
