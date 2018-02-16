const node = require("../index");

function updateBalancesWithNewBlock(block) {

    for (const transaction of block.transactions) {
        if (transactions.pain === true) {
            node.balnances[transaction.form] -= transaction.value + transaction.fee;
            node.balnances[transaction.to] += transaction.value;
        }
    }


}

module.exports = updateBalancesWithNewBlock;