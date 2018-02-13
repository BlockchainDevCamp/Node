'use strict'

const BigInteger = require("big-integer");
const utf8 = require('utf8');
const EC = require('elliptic').ec;
const RipeMD160 = require('ripemd160');
const hash = require('hash.js');

// Create and initialize EC context
const secp256k1Curve = new EC('secp256k1');

// secp256k1Curve Elliptic Curve's G point
const G = secp256k1Curve.g;

class TransactionSigner {

    constructor(privateKeyString) {
        this.privateKeyString = privateKeyString;
        this.privateKey = new EC('secp256k1').keyFromPrivate(this.privateKeyString, 'hex');
        this.publicKey = TransactionSigner.derivePublicKey(this.privateKeyString);

        this.publicKeyCompressed = TransactionSigner.compressPublicKey(this.publicKey);
        this.address = TransactionSigner.createAddress(this.publicKeyCompressed);
    }

    static derivePublicKey(privateKeyString) {

        // point P = k * G
        return G.mul(privateKeyString);
    }

    static isOdd(bigInteger) {

        // https://en.wikipedia.org/wiki/Most_significant_bit
        // The Most Significant Bit can also correspond to the sign bit of a signed binary number in one's or two's
        // complement notation, "1" meaning negative and "0" meaning positive.
        return !bigInteger[0];
    };

    static compressPublicKeyY(publicKey) {
        if (TransactionSigner.isOdd(BigInteger(publicKey.y))) {
            return 1;
        }
        return 0;
    }

    // hex(publicKey.x) + compressed(publicKey.y)
    static compressPublicKey(publicKey) {
        let compressedY = TransactionSigner.compressPublicKeyY(publicKey);
        return BigInteger(publicKey.x).toString(16) + compressedY;
    }

    // address derived from the public key compacted to 40 symbols (RipeMD160)
    static createAddress(publicKeyCompressed) {

        // let publicKeySha256Value = hash.sha256().update(publicKeyCompressed).digest('hex');
        // let senderAddress = new RipeMD160().update(publicKeySha256Value).digest('hex');

        let address = new RipeMD160().update(publicKeyCompressed).digest('hex');

        return address;
    }

    static signSHA256(transactionPayloadString) {

        // remove whitespaces
        let transactionPayloadWithoutWhiteSpaces = transactionPayloadString.replace(/[\s]/g, "");

        // Transaction hash for signing (SHA-256)
        let transactionPayloadHash = hash.sha256().update(utf8.encode(transactionPayloadWithoutWhiteSpaces)).digest('hex');

        return transactionPayloadHash;
    }

    static createTransactionSignature(privateKeyStr, transactionPayloadHash) {
        let privateKey = secp256k1Curve.keyFromPrivate(privateKeyStr, 'hex');

        // Using deterministic ECDSA signature, based on the curve secp256k1and RFC-6979 with HMAC-SHA256
        let transactionSignature = privateKey.sign(transactionPayloadHash);

        return transactionSignature;
    }

    static signedTransactionHash() {
        return null;
    }
}

module.exports = TransactionSigner;