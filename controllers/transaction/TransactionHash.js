'use strict';

const Crypto = require('../../modules/Crypto')

class TransactionHash {

    constructor(transaction) {
        let transactionPayload = JSON.stringify(transaction);
        this.transactionHash = Crypto.signSHA256(transactionPayload);
    }
}

module.exports = TransactionHash;
