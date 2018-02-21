'use strict';

const node = require('../../index');

const Transaction = require('./Transaction');
const TransactionHash = require('./TransactionHash');

const Node = require('../../modules/Node');

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
            res.send(JSON.stringify(transaction));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
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
        for(var i = 0; i < blocks.pendingTransactions.length; i++) {
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
                "confirmedBalance": {"confirmations": confirmationNumber, "balance": confirmedBalance},
                "lastMinedBalance": {"confirmations": 1, "balance": lastMinedBalance},
                "pendingBalance": {"confirmations": 0, "balance": pendingBalance}

            };
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(tran));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "Error": "Invalid transaction hash" }));
        }
    },

    createTransaction: (request, response) => {
        let transaction = Transaction.loadTransaction(request);

        // 1. Calculates the transaction hash
        let transactionHash = new TransactionHash(transaction);

        // 2. Checks for collisions -> duplicated transactions are skipped

        // 3. Checks for missing / invalid fields
        // 4. Validates the transaction signature
        // 5. Puts the transaction in the "pending transactions" pool
        // 6. Sends the transaction to all peer nodes through the REST API
        //    - The transaction is sent from peer to peer until it reaches the entire network

        // validate balance
        // TODO add new transaction to pending transactions pool


        response.status(201);
        response.set('Content-Type', 'application/json');
        response.send(transactionHash);
    },

    validateTransactionRequest(request, response, next) {
        try {
            console.log(request.body);

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
            // TODO add more thorough validation (if possible)
            {
                throw new Error("Invalid sender signature.");
            }
        } catch (err) {
            next(err);
            return;
        }
        next();
    }

};