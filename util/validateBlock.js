const validateAllTransactions =  require("./validateAllTransactions");
const hash = require('hash.js');

function validateBlock(block) {

    // check if blockDateHash is valid
    if(calculateBlockDataHash(block) !== block.blockDataHash){
        return false;
    }

    // check if blockHash is correct
    if(calculateBlockHash(block) !== block.blockHash){
        return false;
    }
    
    // check if transactions are more then 50
    if(block.transactions.length > 50){
        return false;
    }

    // check if all transaction are valid
    if(!validateAllTransactions(block.transactions)){
        return false
    }

    return true;

    function calculateBlockDataHash(block) {
        let blockDataHash = hash(
            block.index,
            block.transactions,
            block.difficulty,
            block.prevBlockHash,
            block.minedBy
        );

        return blockDataHash;
    }


    function calculateBlockHash(block) {
        let blockHash = hash(
            block.blockDataHash,
            block.nonce,
            block.dateCreated
        );

        return blockHash;
    }
}

module.exports = validateBlock;