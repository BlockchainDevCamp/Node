'use strict'

const expect = require('chai').expect;
const BigInteger = require("big-integer");

const TransactionSigner = require('../../modules/TransactionSigner');

describe('TransactionSigner Spec', () => {

    const privateKeyStr = "7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34";
    const compressedPublicKey = 'c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1';

    // TODO: serialise a transaction object instead of hardcoding a string
    const transactionPayload = '{\n' +
        '  "from": "c3293572dbe6ebc60de4a20ed0e21446cae66b17",\n' +
        '  "to": "f51362b7351ef62253a227a77751ad9b2302f911",\n' +
        '  "senderPubKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",\n' +
        '  "value": 25000, "fee": 10, "dateCreated": "2018-02-10T17:53:48.972Z"\n' +
        '}\n';

    it('should derive public key from private key hex', function () {
        // const publicKeyX = BigInteger(90141916975496105403554792622420402072568750034081502346832171012967471516602);
        // const publicKeyY = BigInteger(74763522831925341399825755661848755545105060270287148177912358782964422257391);

        let publicKey = TransactionSigner.derivePublicKey(privateKeyStr);

        // TODO improve big integer comparison
        expect(BigInteger(publicKey.x).toString(16)).to.be.eq('c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba');
        expect(BigInteger(publicKey.y).toString(16)).to.be.eq('a54aa7835a34e10dc6c8e386dc32e98bb18583f7c7259be3e444fe2876b9aaef');
    });

    it('should compress Y coordinate of public key', function () {
        // TODO create EC point using public key coordinates on the fly
        let publicKey = TransactionSigner.derivePublicKey(privateKeyStr);

        let compressedYCoordinate = TransactionSigner.compressPublicKeyY(publicKey.y);

        expect(compressedYCoordinate).to.be.eq(1);
    });

    it('should compress public key', function () {

        // TODO create EC point using public key coordinates on the fly
        let publicKey = TransactionSigner.derivePublicKey(privateKeyStr);

        let actualCompressedPublicKey = TransactionSigner.compressPublicKey(publicKey);

        expect(actualCompressedPublicKey).to.be.eq(compressedPublicKey);
    });

    it('should create address derived from the public key (RipeMD160)', function () {
        let actualAddress = TransactionSigner.createAddress(compressedPublicKey);

        expect(actualAddress).to.be.eq('c3293572dbe6ebc60de4a20ed0e21446cae66b17');
    });

    it('should create a transaction hash for signing (SHA-256)', function () {
        let actualTransactionHash = TransactionSigner.signSHA256(transactionPayload);

        expect(actualTransactionHash).to.be.eq('f241a5598fbe5ba048918fa1cafe8eb727794cfb0f72f425ba332479de22e2b7');
    });

    it('should create deterministic ECDSA signature, based on the curve secp256k1and RFC-6979 with HMAC-SHA256', function () {
        let transactionPayloadHash = TransactionSigner.signSHA256(transactionPayload);
        let transactionSignature = TransactionSigner.createTransactionSignature(privateKeyStr, transactionPayloadHash);

        // TODO create EC point using signature's cooridnates on the fly
        expect(transactionSignature.r.toString(16)).to.be.eq('1aaf55dcb11060749b391d547f37b4727222dcb90e793d9bdb945c64fe4968b0');
        expect(transactionSignature.s.toString(16)).to.be.eq('87250a2841f7a56910b0f7ebdd067589632ccf19d352c15f16cfdba9b7687960');
    });

    // not much sense of this test but adding it for sake of completeness
    xit('should create SHA256 hash of a signed transaction', function () {
        // TODO: serialise a transaction object instead of hardcoding a string
        let signedTransactionPayload = {
            "from": "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
            "to": "f51362b7351ef62253a227a77751ad9b2302f911",
            "senderPubKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
            "value": 25000, "fee": 10, "dateCreated": "2018-02-10T17:53:48.972Z",
            "senderSignature": [
                "1aaf55dcb11060749b391d547f37b4727222dcb90e793d9bdb945c64fe4968b0",
                "87250a2841f7a56910b0f7ebdd067589632ccf19d352c15f16cfdba9b7687960"
            ]
        };

        let signedTransactionPayloadHash = TransactionSigner.signSHA256(signedTransactionPayload);

        // TODO provide the expected value
        expect(signedTransactionPayloadHash).to.be.eq('cd8d9a345bb208c6f9b8acd6b8eefe6...');
    });

    it('should return true when big integer is odd', function () {
        expect(TransactionSigner.isOdd(BigInteger(1))).to.be.true;
    });

    it('should return false when big integer is even', function () {
        expect(TransactionSigner.isOdd(BigInteger(2))).to.be.true;
    });

});