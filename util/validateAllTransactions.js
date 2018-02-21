const validateTransaction = require("./validateTransaction");

function validateAllTransactionsInBlock(block) {
    for(const transaction of block.transactions){
        
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