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
            [{
                from: '0000000000000000000000000000000000000000',
                to: '9cb729548b18dd625aa5a52769844e2ed915da42',
                value: 1000000000,
                fee: 0,
                dateCreated: '2018-01-29T00:00:00.000Z',
                transactionHash: '6b20cf805996fe707393964cc1dbc1a147eb63d5b066ed93f98e38fa790f332b',
                minedInBlockIndex: 0
            }],
            3,
            "0000000000000000000000000000000000000000000000000000000000000000",
            "0000000000000000000000000000000000000000",
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "00000835758eb1551dfaee2ffd3b8fe2b1119a7f8963f390395b56dd78f2225c",
            2837614067,
            "2018-03-21T00:01:37.883Z",
        );

        return genesisBlock;
    }
}

module.exports = Block;