const validateTransaction = require("./validateTransaction");

function validateAllTransactionsInBlock(block) {
    console.log("++++++++");
    console.log(block);
    for(var transaction of block.transactions){

        if (transaction.minedInBlockIndex !== block.index) {
            return false;
        }

        if(!validateTransaction(transaction)){
            return false;
        }
    }

    return true;
}

module.exports = validateAllTransactionsInBlock;