const node = require("../index");
const updateBalancesWithNewBlock = require("./calculateBlockBalances");

function calculateBlockchainBalances() {
    for(const block of node.blocks){
        updateBalancesWithNewBlock(block);
    }
}

module.exports = calculateBlockchainBalances;