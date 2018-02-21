'use strict';

class Transaction {

    constructor(senderAddress, recipientAddress, senderPublicKey, amount, fee, dateCreated, senderSignature) {
        this.from = senderAddress;
        this.to = recipientAddress;
        this.senderPubKey = senderPublicKey;
        this.value = amount;
        this.fee = fee;
        this.dateCreated = dateCreated;
        this.senderSignature = senderSignature;
    }

    static loadTransaction(request) {

        return new Transaction(
            request.body['from'],
            request.body['to'],
            request.body['senderPubKey'],
            request.body['value'],
            request.body['fee'],
            request.body['dateCreated'],
            request.body['senderSignature']
        );
    }
}

module.exports = Transaction;
