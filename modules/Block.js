class Block {
    constructor(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, blockHash, nonce, dateCreated){
        this.index = index; // number
        this.transactions = transactions; // []
        this.difficulty = difficulty; // number
        this.prevBlockHash = prevBlockHash; // hash
        this.minedBy = minedBy; // address
        this.blockDataHash = blockDataHash; // hash
        
        this.nonce = nonce; //number
        this.dateCreated = dateCreated; //date
        this.blockHash = blockHash; // hash
    }
}

module.exports = Block;