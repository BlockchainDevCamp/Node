const validateAllTransactions =  require("./validateAllTransactions");
const crypto = require('../modules/Crypto');

function validateBlock(candidateBlock) {

    var nonce          = candidateBlock.nonce;
    var blockDataHash  = candidateBlock.blockDataHash;
    var date           = candidateBlock.dateCreated

    // check if blockDateHash is valid
    if(calculateBlockDataHash(candidateBlock) !== blockDataHash){
        console.log("blockDataHash not correct!");
        return false;
    }


    // check if blockHash is correct
    if(calculateBlockHash(blockDataHash,nonce,date) !== candidateBlock.blockHash){
        console.log("minerHash not correct!");
        return false;
    }

    // check if transactions are more then 50
    if(candidateBlock.transactions.length > 50){
        return false;
    }

    // check if all transaction are valid (if there is transactions at all)
    if(candidateBlock.transactions.length > 0) {
        if (!validateAllTransactions(candidateBlock)) {
            console.log("transactions not valid");
            return false
        }
    }

    return true;

}

function calculateBlockDataHash(block) {

    let blockData = {
        index: block.index,
        transactions: block.transactions,
        difficulty: block.difficulty,
        prevBlockHash: block.prevBlockHash,
        minedBy: block.minedBy
    };

    return crypto.getSHA256(blockData);;

}


function calculateBlockHash(blockDataHash, nonce, date) {

    var hashData = blockDataHash + "|" + nonce + "|" + date;

    console.log(hashData +  "-->" + crypto.getSHA256(hashData));

    return crypto.getSHA256(hashData);
}

module.exports = validateBlock;