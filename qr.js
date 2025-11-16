// QR Code utilities
console.log('📷 QR: Module initializing...');

export function startScan(onSuccess, onError) {
    console.log('📷 QR: startScan() called');
    // Simple QR input for demo (in real app, use camera API)
    const qrData = prompt('Enter QR code data (or use camera in real implementation):');
    console.log('📷 QR: QR data received:', qrData ? `${qrData.substring(0, 20)}...` : 'null');
    
    if (qrData && onSuccess) {
        console.log('✅ QR: QR data processed successfully');
        onSuccess(qrData);
    } else if (onError) {
        console.log('❌ QR: QR input cancelled');
        onError(new Error('QR input cancelled'));
    }
}

export function generateQR(canvas, data, options = {}) {
    console.log('📷 QR: generateQR() called');
    return new Promise((resolve, reject) => {
        try {
            QRCode.toCanvas(canvas, data, options, (error) => {
                if (error) {
                    console.error('❌ QR: QR generation failed:', error);
                    reject(error);
                } else {
                    console.log('✅ QR: QR code generated successfully');
                    resolve();
                }
            });
        } catch (error) {
            console.error('❌ QR: QR generation error:', error);
            reject(error);
        }
    });
}

console.log('✅ QR: Module loaded successfully');