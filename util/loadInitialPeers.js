const Block = require('../modules/Block');
const Peer = require('../modules/Peer');
const request = require('request');
const validateBlockChain = require('./validateBlockChain');
const calculateBlockchainBalances = require('./calculateBlockchainBalances');
const node = require("../index");

function initNode(node) {
    console.log("Initializing the new BlockChain");
    let genesisBlock = new Block().generageGenesisBlock();
    node.blocks.push(genesisBlock);
    node.peers = [];
}

class LoadInitPeers {
    async load(node) {
        let initialPeerUrl = process.env.INIT_PEER_URL;
        // TODO add validation

        if (!initialPeerUrl) {
            console.log("No Peer");
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

            if(remotePeersList) {
                if (remotePeersList.length > 0) {
                    node.peers = remotePeersList;
                }
            }

            let initialPeer = new Peer(initialPeerUrl, initialPeerUrl);
            node.peers.push(initialPeer);


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
                console.log("PEERURL: " + initialPeerUrl+ '/blocks');
                console.log("REQUEST ----> " + blocks);
                remoteBlockChain = blocks;

                let remotePoW = validateBlockChain(remoteBlockChain);

                if (!remotePoW || remotePoW === false) {
                    console.log("Remote POW: " + remotePoW)
                    initNode(node);
                    return;
                }

                if (remotePoW <= node.pow && remoteBlockChain > 0) {
                    console.log("Remote POW not valid");
                    initNode(node);
                    return;
                }

                node.blocks = remoteBlockChain;
                node.balnances = new Map();
                node.pendingTransactions = [];

                //TODO make a POST request to the PEER with the nodeAddress
                let optionsForPostPeers = {
                    method: 'post',
                    json: true,
                    url: initialPeerUrl + '/peers',
                    body: {
                        url: node.address,
                        name: node.name
                    }
                };

                request(optionsForPostPeers, (err, res, message) => {
                    if(err) {
                        console.log(err);
                    }
                    console.log("PEER POST SENT");
                    console.log(optionsForPostPeers);
                    //console.log(message);
                })



                // calculate node.balances
                calculateBlockchainBalances(node);

                console.log(`The new blockchain is sync-ed correctly`)
            });
        });
    }
}

module.exports = LoadInitPeers;