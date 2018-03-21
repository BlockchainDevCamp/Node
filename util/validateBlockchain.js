const validateBlock = require("./validateBlock");

function validateBlockchain(blockchain) {
    let proofOfWork = 0; 

    for(const block of blockchain){
        console.log("BLOCK --> " + block);
        console.log("INDEX --> " + block.index);

        if(block.index > 0) {
            let previousBlock = blockchain[block.index - 1];

            // check if block index === last block index + 1
            if (block.index !== previousBlock.index + 1) {
                console.log("block index not corrext");
                console.log("Block Index: " + block.index);
                console.log("PrevBlock Index: " + blockchain[block.index - 1]);
                return false;
            }

            // check if prevblockhash is correct
            if (block.prevBlockHash !== previousBlock.blockHash) {
                console.log("prevblockhash not correct");
                console.log("PrevBlockHash: " + block.prevBlockHash);
                console.log("Previous Block Hash: " + previousBlock.blockHash);
                return false;
            }

           /* // check if block creation is greater then prev block creation
            if (block.dateCreated >= previousBlock.dateCreated) {
                console.log("datecreated not correct");
                console.log("This Block Date: " + block.dateCreated);
                console.log("Previous Block Date: " + previousBlock.dateCreated);
                return false;
            }*/
        }

        // validete block
        if(!validateBlock(block)){
            return false;
        }

        proofOfWork += block.difficulty;
    }
    console.log("BlockChain Validated with POW = " + proofOfWork);
    return proofOfWork;
}

module.exports = validateBlockchain;