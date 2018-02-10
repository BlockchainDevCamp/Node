class Transaction {
    constructor(from, to, value, senderPubKey, senderSignature, transactionHash, dateReceived, minedInBlockIndex, paid, fee){
        this.from = from; // address
        this.to = to; // address
        this.value = value; // number
        this.senderPubKey = senderPubKey; // num
        this.senderSignature = senderSignature; // number[2]
        this.transactionHash = transactionHash; // hash
        this.dateReceived = dateReceived; // date
        this.minedInBlockIndex = minedInBlockIndex; // number
        this.paid = paid; // bool
        this.fee = fee; // number
    }
}

module.exports = Block;