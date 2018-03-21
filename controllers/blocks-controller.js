const node = require("../index");
const validateBlockChain = require("../util/validateBlockchain");
const validateBlock = require("../util/validateBlock");
const calculateBlockBalances = require("../util/calculateBlockBalances");
const calculateBlockchainBalances = require("../util/calculateBlockchainBalances");

const request = require('request');

module.exports = {
    getAllBlocks: (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(node.blocks));
    },
    getBlockByIndex: (req, res) => {
        const index = Number(req.params.index);
        const blocks = node.blocks;

        if (index >= 0 && index < blocks.length) {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(blocks[index]));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify({ "Error": "Invalid block index" }));
        }
    },
    postNotifyBlock: async (req, res) => {
        let blockIndex = req.body.index;
        let lastBlock = node.blocks[node.blocks.length - 1];
        let nodeAddress = req.body.nodeAddress;

        if (blockIndex === lastBlock.index + 1) {
            let options = {
                method: 'get',
                json: true,
                url: `${nodeAddress}blocks/${blockIndex}`,
            };

            request(options, (err, res, newBlock) => {
                if (err) {
                    console.log(err);
                    return;
                }

                // check if block index === last block index + 1
                if (newBlock.index !== lastBlock + 1) {
                    return false;
                }

                // check if prevblockhash is correct
                if (newBlock.prevBlockHash !== lastBlock.blockHash) {
                    return false; // TODO request full blockchain ...
                }

                // check if block creation is greater then prev block creation
                if (newBlock.dateCreated >= lastBlock.dateCreated) {
                    return false;
                }

                // validete block
                let isBlockValid = validateBlock(newBlock)
                if (!isBlockValid) {
                    return false;
                }

                node.blocks.push(block);

                calculateBlockBalances(block);
                console.log(`The new block is sync correctly`)

            });



        }
        else if (blockIndex > lastBlock.index) {
            let options = {
                method: 'get',
                json: true,
                url: `${nodeAddress}blocks`,
            };

            request(options, (err, res, newBlockChain) => {
                if (err) {
                    console.log(err);
                    return
                }

                let pow = validateBlockChain(newBlockChain);

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
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify({ "message": "Thank you" }));
    }
}