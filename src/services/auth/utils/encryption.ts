const ENCRYPTION_KEY = 'auth-storage-key';

export const encrypt = (data: string): string => {
  try {
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(data);
    // En production, utiliser des méthodes de chiffrement plus robustes
    return btoa(String.fromCharCode.apply(null, Array.from(encoded)));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = (encryptedData: string): string => {
  try {
    const decoded = atob(encryptedData);
    const textDecoder = new TextDecoder();
    return textDecoder.decode(Uint8Array.from(decoded.split('').map(c => c.charCodeAt(0))));
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};