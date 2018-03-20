const hash = require('hash.js');
const TransactionHash = require('../controllers/transaction/TransactionHash');


function validateTransaction(transaction) {
    // check if transaction is successfull
    if (transaction.paid === false) {
        return true;
    }

    // check is signature is correct TODO
    let transactionHash = new TransactionHash(transaction);

    // check if transaction hash is correct
    if (transactionHash.transactionHash !== transaction.transactionHash) {
        return false;
    }

    // check if from address has enough money to send
    if (node.balnances.get(transaction.from) < transaction.fee + transaction.value) {
        return false;
    }

    return true;

}

module.exports = validateTransaction;