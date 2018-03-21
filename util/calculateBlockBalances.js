const node = require("../index");

function calculateBlockBalances(block) {
    if(block.transactions.length > 0) {
        for (const transaction of block.transactions) {
            if (transaction.paid === true) {
                console.log("transaction is paid");
                node.balnances[transaction.form] -= transaction.value + transaction.fee;
                node.balnances[transaction.to] += transaction.value;
            }
        }
    }


}

module.exports = calculateBlockBalances;