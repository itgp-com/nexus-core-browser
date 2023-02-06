import * as CryptoJS from 'crypto-js';

function padString(str: string): string {
    const hash = CryptoJS.MD5(str).toString(CryptoJS.enc.Base64);
    return hash.slice(0, 16)
}

export class SymmetricKey{

    public static encrypt(toEncrypt:string, key:string ){

        let paddedKey = padString(key);
        let wordArray = CryptoJS.enc.Utf8.parse(paddedKey);
        let ciphertext = CryptoJS.AES.encrypt(toEncrypt, wordArray, {iv: wordArray}).toString();
        return ciphertext;
    }

    public static decrypt( toDecrypt:string, key:string, ){

        let paddedKey = padString(key);
        let wordArray = CryptoJS.enc.Utf8.parse(paddedKey);
        let decryptedData = CryptoJS.AES.decrypt(toDecrypt, wordArray, {
            iv: wordArray
        });
        return decryptedData.toString( CryptoJS.enc.Utf8 );
    }
}