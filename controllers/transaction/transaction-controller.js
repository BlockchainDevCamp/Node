'use strict';

const node = require('../../index');

const Transaction = require('./Transaction');
const TransactionData = require('./TransactionData');
const TransactionHash = require('./TransactionHash');
const Crypto = require('../../modules/Crypto');

const Node = require('../../modules/Node');
const Request = require('request');

function validateTransactionRequest(request) {
    let from = request.body["from"];
    if (!from || from.length != 40) {
        throw new Error("Invalid sender address.");
    }

    let recipientAddress = request.body['to'];
    if (!recipientAddress || recipientAddress.length != 40) {
        throw new Error("Invalid recipient address.");
    }

    let senderPublicKey = request.body["senderPubKey"];
    if (!senderPublicKey || senderPublicKey.length != 65) {
        throw new Error("Invalid sender public key.");
    }

    let amount = request.body['value'];
    if (!amount || amount <= 0) {
        throw new Error("Invalid transaction amount.");
    }

    let fee = request.body['fee'];
    if (!fee || fee <= 0) {
        throw new Error("Invalid transaction fee.");
    }

    let dateCreated = request.body['dateCreated'];
    if (!dateCreated) {
        throw new Error("Invalid transaction date.");
    }

    let senderSignature = request.body['senderSignature'];
    if (!senderSignature || senderSignature.length != 2
        || !senderSignature[0] || !senderSignature[1])
    {
        throw new Error("Invalid sender signature.");
    }
}

module.exports = {
    getTransaction: (req, res) => {
        const tranHash = req.params['transactionHash'];
        const blocks = node.blocks;
        let tranExists = false;
        let transaction;

        for (var i = 0; i < blocks.length; i++) {
            let transactions = blocks[i].transactions;
            for (var t = 0; t < transactions.length; t++) {
                if (transactions[i].transactionHash === tranHash) {
                    tranExists = true;
                    transaction = transactions[t];
                    break;
                }
            }
        }

        if (tranExists) {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(transaction));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify({ "Error": "Invalid transaction hash" }));
        }
    },

    getBalance: (req, res) => {
        const tranHash = req.params['transactionHash'];
        const confirmationNum = req.params['confirmationNum'];
        const blocks = node.blocks;

        let tranExists = false;
        let firstTranBlock;

        for (var i = 0; i < blocks.length; i++) {
            let transactions = blocks[i].transactions;
            for (var t = 0; t < transactions.length; t++) {
                if (transactions[i].transactionHash === tranHash) {
                    firstTranBlock = true;
                    currentBlock = blocks[i].index;
                    break;
                }
            }
        }

        let confirmationNumber = blocks.length - firstTranBlock;
        let confirmedBalance = 0;
        let lastMinedBalance = 0;
        for (var i = currentBlock; i < blocks.length; i++) {
            let transactions = blocks[i].transactions;
            for (var t = 0; t < transactions.length; t++) {
                if (transactions[i].transactionHash === tranHash && confirmationNumber >= confirmationNum) {
                    confirmedBalance += transactions[i].value;
                    lastMinedBalance = transactions[i].value;
                }
            }
        }

        let pendingBalance = 0;
        for (var i = 0; i < blocks.pendingTransactions.length; i++) {
            let transactions = blocks[i].pendingTransactions;
            for (var t = 0; t < transactions.length; t++) {
                if (transactions[i].transactionHash === tranHash) {
                    pendingBalance += transactions[i].value;
                }
            }
        }

        if (tranExists) {
            let tran = {
                "address": tranHash,
                "confirmedBalance": { "confirmations": confirmationNumber, "balance": confirmedBalance },
                "lastMinedBalance": { "confirmations": 1, "balance": lastMinedBalance },
                "pendingBalance": { "confirmations": 0, "balance": pendingBalance }

            };
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify(tran));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.send(JSON.stringify({ "Error": "Invalid transaction hash" }));
        }
    },

    createTransaction: async (request, response) => {
        console.log(request.debug);
        let transaction = Transaction.loadTransaction(request);

        // 1. Calculates the transaction hash
        let transactionHash = new TransactionHash(transaction);

        // 3. Checks for missing / invalid fields
        try {
            validateTransactionRequest(request);
        } catch (err) {
            response.status(400);
            response.set('Content-Type', 'application/json');
            response.send(JSON.stringify({"Error": err.message}));
            return;
        }

        // 4. Validates the transaction signature
        let transactionData = TransactionData.createTransactionData(request);
        let transactionDataPayloadHash = Crypto.signSHA256(JSON.stringify(transactionData));
        let transactionSignature = {r: transaction.senderSignature[0], s: transaction.senderSignature[1]};
        let isTransactionValid = Crypto.verifySignature(transaction.senderPubKey, transactionDataPayloadHash, transactionSignature);
        if (!isTransactionValid) {
            response.status(400);
            response.set('Content-Type', 'application/json');
            response.send(JSON.stringify({"Error": "Compromised transaction."}));
            return;
        }

        // 2. Checks for collisions -> duplicated transactions are skipped
        let existingTransaction = node.pendingTransactions[transactionHash];
        if (existingTransaction !== undefined) {
            response.status(409);
            response.set('Content-Type', 'application/json');
            response.send(JSON.stringify({"Error": "Transaction already exists."}));
            return;
        }
        for (let blockIndex = 0; blockIndex < node.blocks.length; blockIndex++) {
            let block = node.blocks[blockIndex];
            for (let txIndex = 0; txIndex < block.transactions; txIndex++) {
                if (transactionHash === block.transactions[txIndex].transactionHash) {
                    response.status(409);
                    response.set('Content-Type', 'application/json');
                    response.send(JSON.stringify({"Error": "Transaction already exists."}));
                    return; // next();
                }
            }
        }

        // 5. Puts the transaction in the "pending transactions" pool
        node.pendingTransactions.push(transaction);

        response.status(201);
        response.set('Content-Type', 'application/json');
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.send(transactionHash);

        // 6. Sends the transaction to all peer nodes through the REST API
        //    - The transaction is sent from peer to peer until it reaches the entire network
        for (let peerIndex = 0; peerIndex < node.peers.length; peerIndex++) {
            let peer = node.peers[peerIndex];

            let options = {
                method: 'post',
                body: transactionData,
                json: true,
                // TODO: move to configuration
                url: peer.peerUrl + ":5555/transactions",
            };

            await Request(options, function (err, res, transactionHashBody) {
                if (err) {
                    console.error(err);
                }
                if (!transactionHashBody || !transactionHashBody.transactionHash
                    || transactionHash.transactionHash !== transactionHashBody.transactionHash) {
                    console.warn("Compromised transaction for peer: " + peer.name);
                }
            });
        }
    }

};