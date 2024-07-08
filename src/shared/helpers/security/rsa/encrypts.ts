const { publicEncrypt } = require('crypto');

const data = 'Data to encrypt';
const encryptedData = publicEncrypt(
  {
    key: publicKey,
    padding: process.env.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256',
  },
  Buffer.from(data),
);
// encryptedData is a Buffer containing the encrypted data
