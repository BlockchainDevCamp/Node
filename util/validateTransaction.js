const node = require("../index");
const hash = require('hash.js');

function validateTransaction(transaction) {
    // check if transaction is successfull
    if (transaction.paid === false) {
        return true;
    }

    // check is signature is correct TODO

    // check if transaction hash is correct
    if (!checkIfTransactionHashIsValid) {
        return false;
    }

    // check if from address has enough money to send
    if (node.balnances.get(transaction.from) < transaction.fee + transaction.value) {
        return false;
    }


    return true;


    function checkIfTransactionHashIsValid(transaction) {

        let transactionHash = hash(
            transaction.from,
            transaction.to,
            transaction.value,
            transaction.senderPubKey,
            transaction.senderSignature,
            transaction.dateReceived,
            transaction.minedInBlockIndex,
            transaction.paid,
            transaction.fee
        );

        if (transactionHash !== transaction.transactionHash){
            return false;
        }

        return true;
    }
}

module.exports = validateTransaction;