const node = require("../index");
const request = require('request');

const hardCodeNodeAddress = "TODO";

class LoadInitPeers {
    async load() {
        let peers = await request.get(`${hardCodeNodeAddress}/peers`);

        if (peers > 0) {
            node.peers = peers;
            console.log(`Peers sync - ${peers.length}`)
        }

        let info = await request.get(`${hardCodeNodeAddress}/info`);

        if (info.blocks > node.blocks.length) {
            let newBlockChain = await request.get(`${hardCodeNodeAddress}/blocks`);
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
}

module.exports=LoadInitPeers;