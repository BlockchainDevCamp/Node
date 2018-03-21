//const node = require("../index");
const calculateBlockBalances = require("./calculateBlockBalances");

function calculateBlockchainBalances(node) {
    console.log(node.blocks);
    for(const block of node.blocks){
        calculateBlockBalances(block);
    }
}

module.exports = calculateBlockchainBalances;