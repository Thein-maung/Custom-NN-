// Mobile-friendly debug console
console.log('🔧 Debug: Initializing mobile debug console...');

class MobileDebug {
    constructor() {
        this.isInitialized = false;
        this.logs = [];
        this.maxLogs = 100;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createConsoleUI();
        this.overrideConsoleMethods();
        this.isInitialized = true;
        
        console.log('🔧 Mobile Debug Console Ready');
    }

    createConsoleUI() {
        // Create console container
        const consoleDiv = document.createElement('div');
        consoleDiv.id = 'mobile-debug-console';
        consoleDiv.innerHTML = `
            <div style="
                position: fixed;
                bottom: 10px;
                right: 10px;
                width: 95%;
                height: 300px;
                background: rgba(0,0,0,0.9);
                color: #00ff00;
                font-family: monospace;
                font-size: 12px;
                border: 2px solid #00ff00;
                border-radius: 10px;
                z-index: 10000;
                display: none;
                flex-direction: column;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    background: #000;
                    padding: 8px;
                    border-bottom: 1px solid #00ff00;
                ">
                    <strong>📱 Debug Console</strong>
                    <div>
                        <button onclick="mobileDebug.clear()" style="margin-right: 5px; background: #ff4444; color: white; border: none; padding: 2px 8px; border-radius: 3px;">Clear</button>
                        <button onclick="mobileDebug.toggle()" style="background: #666; color: white; border: none; padding: 2px 8px; border-radius: 3px;">Hide</button>
                    </div>
                </div>
                <div id="debug-log" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    line-height: 1.4;
                "></div>
                <div style="
                    display: flex;
                    border-top: 1px solid #00ff00;
                    background: #000;
                ">
                    <input type="text" id="debug-command" placeholder="Enter JavaScript command..." style="
                        flex: 1;
                        background: #000;
                        color: #00ff00;
                        border: none;
                        padding: 8px;
                        outline: none;
                    ">
                    <button onclick="mobileDebug.executeCommand()" style="
                        background: #00ff00;
                        color: #000;
                        border: none;
                        padding: 8px 12px;
                        font-weight: bold;
                    ">Run</button>
                </div>
            </div>
            <button onclick="mobileDebug.toggle()" style="
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: #00ff00;
                color: #000;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">🐛</button>
        `;

        document.body.appendChild(consoleDiv);
        console.log('✅ Debug: Console UI created');
    }

    toggle() {
        const console = document.getElementById('mobile-debug-console');
        const logContainer = document.getElementById('debug-log');
        
        if (console.style.display === 'none' || !console.style.display) {
            console.style.display = 'flex';
            this.updateLogDisplay();
            console.log('🔧 Debug: Console opened');
        } else {
            console.style.display = 'none';
            console.log('🔧 Debug: Console closed');
        }
    }

    overrideConsoleMethods() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        console.log = (...args) => {
            this.addLog('log', args);
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            this.addLog('error', args);
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.addLog('warn', args);
            originalWarn.apply(console, args);
        };

        console.info = (...args) => {
            this.addLog('info', args);
            originalInfo.apply(console, args);
        };

        console.log('✅ Debug: Console methods overridden');
    }

    addLog(type, args) {
        const timestamp = new Date().toLocaleTimeString();
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');

        this.logs.push({
            type,
            timestamp,
            message,
            color: this.getColorForType(type)
        });

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        this.updateLogDisplay();
    }

    getColorForType(type) {
        const colors = {
            log: '#00ff00',
            error: '#ff4444',
            warn: '#ffaa00',
            info: '#4488ff'
        };
        return colors[type] || '#00ff00';
    }

    updateLogDisplay() {
        const logContainer = document.getElementById('debug-log');
        if (!logContainer) return;

        logContainer.innerHTML = this.logs.map(log => `
            <div style="color: ${log.color}; margin-bottom: 4px;">
                <span style="opacity: 0.7;">[${log.timestamp}]</span>
                <span style="font-weight: bold;">${log.type.toUpperCase()}:</span>
                ${log.message}
            </div>
        `).join('');

        logContainer.scrollTop = logContainer.scrollHeight;
    }

    clear() {
        this.logs = [];
        this.updateLogDisplay();
        console.log('🔧 Debug console cleared');
    }

    executeCommand() {
        const input = document.getElementById('debug-command');
        const command = input.value.trim();
        
        if (!command) return;

        try {
            const result = eval(command);
            console.log('💻 Command Result:', result);
        } catch (error) {
            console.error('💻 Command Error:', error);
        }

        input.value = '';
    }
}

// Initialize mobile debug console
const mobileDebug = new MobileDebug();

// Export for global access
window.mobileDebug = mobileDebug;

// Add global error handlers
window.addEventListener('error', (event) => {
    console.error('🚨 Global Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled Promise:', event.reason);
});

console.log('✅ Mobile Debug System Loaded');