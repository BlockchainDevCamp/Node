const node = require("../index");
const Block = require('../modules/Block');
const Peer = require('../modules/Peer');
const request = require('request');
const validateBlockChain = require('./validateBlockChain');
const calculateBlockchainBalances = require('./calculateBlockchainBalances');

function initNode(node) {
    let genesisBlock = new Block().generageGenesisBlock();
    node.blocks.push(genesisBlock);
    node.peers = [];
}

class LoadInitPeers {


    async load(node) {

        let initialPeerUrl = process.env.INIT_PEER_URL;
        // TODO add validation

        if (!initialPeerUrl) {
            initNode(node);
            return;
        }

        let options = {
            method: 'get',
            json: true,
            url: initialPeerUrl + '/peers',
        };
        request(options, function (err, res, remotePeersList) {
            if (err) {
                console.error(err);
                initNode(node);
                return;
            }
            console.log("remotePeersList > " + JSON.stringify(remotePeersList));


            if (remotePeersList.length > 0) {
                node.peers = remotePeersList;
            }

            let initialPeer = new Peer(initialPeerUrl, initialPeerUrl);
            node.peers.push(initialPeer);

            // TODO notify initialPeer for our existence


            let remoteBlockChain = null;

            let options = {
                method: 'get',
                json: true,
                url: initialPeerUrl + '/blocks',
            };
            request(options, function (err, responze, blocks) {
                if (err) {
                    console.error(err);

                    initNode(node);
                    return;
                }
                remoteBlockChain = blocks;


                let remotePoW = null;

                console.log("remoteBlockChain: \n" + JSON.stringify(remoteBlockChain));

                remotePoW = validateBlockChain(remoteBlockChain);

                if (!remotePoW || remotePoW === false) {
                    initNode(node);
                    return;
                }

                if (remotePoW <= node.pow) {
                    initNode(node);
                    return;
                }

                node.blocks = remoteBlockChain;
                node.balnances = new Map();
                node.pendingTransactions = [];

                // calculate node.balances
                calculateBlockchainBalances();

                console.log(`The new blockchain is sync correctly`)

            });

        });
    }
}

module.exports = LoadInitPeers;