const validateTransaction = require("./validateTransaction");

function validateAllTransactionsInBlock(block) {

    for(var transaction of block.transactions){

        if (transaction.minedInBlockIndex !== block.index) {
            console.log("mineInBlockIndex incorrect");
            console.log("MinedInBlockIndex ---> " + transaction.minedInBlockIndex);
            console.log("Block Index ---> " + block.index);
            return false;
        }

        if(!validateTransaction(transaction)){
            console.log("transaction not valid");
            return false;
        }
    }

    return true;
}

module.exports = validateAllTransactionsInBlock;