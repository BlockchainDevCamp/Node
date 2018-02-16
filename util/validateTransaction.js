const node = require("../index");
const hash = require('hash.js');

function validateTransaction(transaction, block) {
    // check if transaction is successfull
    if(transaction.paid === false){
        return true;
    }
    
    // check is signature is correct TODO

    // check if minedIndexBLock is correct
    if(transaction.minedInBlockIndex !== block.index){
        return false;
    }

    // check if transaction hash is correct
    if(!checkIfTransactionHashIsValid){
        return false;
    }


    // check if from address has enough money to send
    if(node.balnances.get(transaction.senderPubKey) < transaction.fee + transaction.value){
        return false;
    }

    // if all checks are correct update node balances
    //updateNodeBalances(transaction);


    return true;
}

function checkIfTransactionHashIsValid(transaction) {

    // TODO

    return true;
}

module.exports = validateTransaction;