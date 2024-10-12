// thank you claude I HATE ENCRYPTION >:(
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const keyLength = 32; // 256 bits
const ivLength = 12; // 96 bits for GCM

function deriveKey(password) {
    return crypto.scryptSync(password, process.env.ENCRYPTION_SALT, keyLength);
}

module.exports = {
    // INSECURE LEGACY METHODS
    encrypt(text) {
        const iv = crypto.randomBytes(ivLength);
        const key = deriveKey(process.env.ENCRYPTION_KEY);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag().toString('hex');
        
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted,
            authTag: authTag
        };
    },

    decrypt(encryptedObj) {
        const iv = Buffer.from(encryptedObj.iv, 'hex');
        const key = deriveKey(process.env.ENCRYPTION_KEY);
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        
        decipher.setAuthTag(Buffer.from(encryptedObj.authTag, 'hex'));
        
        let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    },

    hash(text) {
        const hash = crypto.createHash('sha256');
        hash.update(text);
        return hash.digest('hex');
    }
};