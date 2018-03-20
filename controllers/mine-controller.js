const node = require('../index');
const Block = require('../modules/Block');
const validateBlock = require('../util/validateBlock');
const notifyAllPeers = require('../util/notifyAllPeers');
const Crypto = require('../modules/Crypto');

module.exports = {
    startMine: (req, res) => {
        let minerAddres = req.params.address;

        let lastBlock = node.blocks[node.blocks.length - 1];

        let blockData = {
            index: lastBlock.index,
            transactions: node.pendingTransactions,
            difficulty: node.difficulty,
            prevBlockHash: lastBlock.blockHash,
            minedBy: minerAddres
        };

        let blockDataHash = Crypto.getSHA256(blockData);

        node.miningJobs.set(minerAddres, {
            index: lastBlock.index + 1,
            transactions: node.pendingTransactions,
            difficulty: node.difficulty,
            prevBlockHash: lastBlock.blockHash,
            blockDataHash: blockDataHash
        });

        let responseObj = {
            index: lastBlock.index + 1,
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
        try {
            console.log('--Block Submited for Verification!--')
            let index = req.body.index;
            let nonce = req.body.nonce;
            let dateCreated = req.body.dateCreated;
            let blockHash = req.body.blockHashMiner;
            let minerAddress = req.body.minerAddress;
            let blockDataHash = req.body.blockDataHash;

            let minerJob = node.miningJobs.get(minerAddress);

            let lastBlock = node.blocks[node.blocks.length - 1];

            let blockTransactions = minerJob.transactions;
            console.log("----- TRANSACTIONS ------");
            console.log(blockTransactions);
            
            let candidateBlock = new Block(index, minerJob.transactions, minerJob.difficulty, minerJob.prevBlockHash,
                minerAddress, blockDataHash, blockHash, nonce, dateCreated);

            console.log(candidateBlock);

            let isBlockValid = await validateBlock(candidateBlock);


            if (blockHash.startsWith("0".repeat(node.difficulty)) && index === node.blocks.length && isBlockValid) {
                let newBlock = new Block(index, minerJob.transactions, node.difficulty, lastBlock.blockHash, minerAddress, minerJob.blockDataHash, blockHash, nonce, dateCreated);

                node.blocks.push(newBlock);

                let responseObj = {
                    "status": "accepted",
                    "message": "Block accepted, expected reward: 10 coins"
                }

                res.setHeader('Content-Type', 'application/json');
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.send(JSON.stringify(responseObj));
                console.log("New block mined.");
                notifyAllPeers(newBlock.index);
                return;
            }

            let responseObj = {
                "status": "error"
            }
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(responseObj));


        } catch (err) {
            console.error(err);
            let responseObj = {
                "status": "error"
            }
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(responseObj));
        }


    }
}