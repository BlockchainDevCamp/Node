const node = require("../index");
const calculateBlockBalances = require("./calculateBlockBalances");

function calculateBlockchainBalances() {
    for(const block of node.blocks){
        calculateBlockBalances(block);
    }
}

module.exports = calculateBlockchainBalances;