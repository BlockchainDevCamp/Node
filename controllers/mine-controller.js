const node = require('../index');
const hash = require('hash.js');
const Block = require('../modules/Block');
const validateBlock = require('../util/validateBlock');
const Crypto = require('../modules/Crypto');

module.exports = {
    startMine: (req, res) => {
        let minerAddres = req.params.address;

        let lastBlock = node.blocks[node.blocks.length - 1];

        let blockDataHash = Crypto.signSHA256(lastBlock.index+node.pendingTransactions+node.difficulty+lastBlock.blockHash+minerAddres);

        node.miningJobs.set(minerAddres, {
            index: lastBlock.index,
            transactions: node.pendingTransactions,
            difficulty: node.difficulty,
            prevBlockHash: lastBlock.blockHash,
            blockDataHash: blockDataHash
        });

        let responseObj = {
            index: lastBlock.index,
            transactionsIncluded: node.pendingTransactions.length,
            expectedReward: 10,
            difficulty: node.difficulty,
            blockDataHash: blockDataHash
        }

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(responseObj));
    },
    submitBlock: async (req, res) => {
        let index = req.body.index;
        let nonce = req.body.nonce;
        let dataCreated = req.body.dataCreated;
        let blockHashMiner = req.body.blockHash;
        let minerAddres = req.body.minerAddress;

        let minerJob = node.miningJobs(minerAddres)

        let lastBlock = node.blocks[node.blocks - 1];

        let blockHash = hash(lastBlock.index, node.pendingTransactions.length, node.difficulty, minerJob.blockDataHash, nonce, dataCreated);

        let isBlockValid = await validateBlock(newBlock);


        if (blockHash.startsWith("0".repeat(node.difficulty)) && blockHash === blockHashMiner && index === node.blocks.length && blockHash === blockHashMiner && isBlockValid) {
            let newBlock = new Block(index, minerJob.transactions, node.difficulty, lastBlock.blockHash, minerAddres, minerJob.blockDataHash, blockHash, nonce, dataCreated);

            node.blocks.push(newBlock);

            let responseObj = {
                "status": "accepted",
                "message": "Block accepted, expected reward: 10 coins"
            }

            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(responseObj));
            return;
        }

        let responseObj = {
            "status": "error"
        }
        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(responseObj));


    }
}