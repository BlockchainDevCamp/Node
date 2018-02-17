const node = require('../index');

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
    postTransaction: (req, res) => {
        res.send("POST Transactions");
        // TODO
    }
};