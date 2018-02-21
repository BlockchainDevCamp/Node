const validateBlock = require("./validateBlock");

function validateBlockchain(blockchain) {
    let proofOfWork = 0; 

    for(const block of blockchain){
        let previousBlock = blockchain[block.index - 1];

        // check if block index === last block index + 1
        if(block.index !== previousBlock.index + 1){
            return false;
        }

        // check if prevblockhash is correct
        if(block.prevBlockHash !== previousBlock.blockHash){
            return false;
        }

        // check if block creation is greater then prev block creation
        if(block.dateCreated >= previousBlock.dateCreated){
            return false;
        }

        // validete block
        if(!validateBlock(block)){
            return false;
        }

        proofOfWork += block.difficulty;
    }

    return proofOfWork;
}

module.exports = validateBlockchain;