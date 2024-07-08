const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048, // Length of your key in bits
  publicKeyEncoding: {
    type: 'spki', // Recommended to use 'spki' for the public key
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8', // Recommended to use 'pkcs8' for the private key
    format: 'pem',
  },
});
// publicKey and privateKey are in PEM format
