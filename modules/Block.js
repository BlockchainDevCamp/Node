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

    calucateHash(
        index, 
        transactions,
        difficulty,
        prevBlockHash,
        minedBy,) {
        // TODO
        return "000000000000000000552b92559bcdbbf021e4f19a2af753f0f3b1d57a2724c0";
    }

    generageGenesisBlock() {
        let genesisBlock = new Block(
            0,
            [],
            5,
            "0000000000000000000000000000000000000000000000000000000000000000",
            "18pF4dNsxjT2EAXToobbisg2MjKc2cSoWW",
            "56b1bcd43cfec5f54b32d4166d09acaa5a2a3afd7007262b11fe8da86b5a827c",
            1859140553,
            new Date("2018-12-17"),
            "00000000000000000038eb8467d006870364a46b7d3ad6f341a4aa41745d125c"
        );

        return genesisBlock;
    }
}

module.exports = Block;