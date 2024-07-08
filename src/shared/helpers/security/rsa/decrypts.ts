const { privateDecrypt } = require('crypto');

const decryptedData = privateDecrypt(
  {
    key: privateKey,
    padding: process.env.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  },
  encryptedData,
);
