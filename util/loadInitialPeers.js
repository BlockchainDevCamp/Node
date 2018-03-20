const node = require("../index");
const request = require('request');

export default async () => {
    let peers = request.get(`{TODO node address}/peers`);

    if (peers > 0) {
        node.peers = peers;
        console.log(`Peers sync - ${peers.length}`)
    }

    let info = request.get(`{TODO node address}/info`);

    if (info.blocks > node.blocks.length) {
        let newBlockChain = request.get(`{TODO node address}/blocks`);
        let pow = await validateBlockChain(newBlockChain);

        if (pow === false) {
            return false;
        }

        if (pow <= node.pow) {
            return false;
        }

        node.blocks = newBlockChain;
        node.balnances = new Map();
        node.pendingTransactions = [];

        // calculate node.balances
        calculateBlockchainBalances();
        console.log(`The new blockchain is sync correctly`)
    }
}