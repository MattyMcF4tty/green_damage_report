import * as CryptoJS from 'crypto-js';
import { CustomerDamageReport } from "../schemas/damageReportSchemas/customerReportSchema";
import { getEnvVariable } from '../logic/misc';

// ENCRYPTION
export const encryptText = (text: string) => {
  if (text.length <= 0) {
    return text;  
  }

  const key = getEnvVariable('ENCRYPTION_KEY')
  const encryptedText = CryptoJS.AES.encrypt(text, key);

  return encryptedText.toString();
};


// DECRYPTION
export const decryptText = (text: string) => {
  if (text.length <= 0) {
    return text;  
  }

  const key = getEnvVariable('ENCRYPTION_KEY')
  const decryptedText = CryptoJS.AES.decrypt(text, key);

  return decryptedText.toString(CryptoJS.enc.Utf8);
};


// ENCRYPT DECRYPT ARRAY -----------------------------------------------------------------------------
export const encryptArray = (array: string[]) => {
  const encryptedArray = array.map((item) => {
    return encryptText(item);
  })

  return encryptedArray;
}


export const decryptArray = (array: string[]) => {
  const decryptedText = array.map((item) => {
    return decryptText(item);
  })

  return decryptedText;
}

// ENCRYPT DECRYPT OBJECT -----------------------------------------------------------------------------
export const encryptObject = (obj: object): object => {
  const encryptedObj: Record<string, any> = { ...obj }; 

  Object.keys(encryptedObj).forEach((key) => {
    const value = encryptedObj[key];
  
    if (typeof value === 'string') {
      encryptedObj[key] = encryptText(value);
    } 
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      encryptedObj[key] = encryptObject(value);
    }
  });

  return encryptedObj;
};


export const decryptObject = (obj: Record<string, any>): object => {
  const decryptedObj: Record<string, any> = { ...obj }; 
  
  Object.keys(decryptedObj).forEach((key) => {
    const value = decryptedObj[key];
    
    if (typeof value === 'string') {
      decryptedObj[key] = decryptText(value); // Utilizing your decryptText function here
    } 
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      decryptedObj[key] = decryptObject(value); // Recursive call for nested objects
    }
  });

  return decryptedObj;
};
