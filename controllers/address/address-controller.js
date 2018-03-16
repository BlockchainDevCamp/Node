const node = require('../../index');

const Balance = require('./Balance');

module.exports = {

    getTransactionsPerAddress: (request, response) => {
        const address = request.params['address'];
        // TODO validate address

        const transactions = [];

        const blocks = node.blocks;

        // process confirmed confirmed balance
        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            let block = blocks[blockIndex];

            for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
                let tx = block.transactions[txIndex];

                if (tx.to === address || tx.from === address) {
                    transactions.push(tx);
                }
            }
        }
        for (let txIndex = 0; txIndex < node.pendingTransactions.length; txIndex++) {
            let tx = node.pendingTransactions[txIndex];
            if (tx.to === address || tx.from === address) {
                transactions.push(tx);
            }
        }

        let transactionsResult = {
            address: address,
            transactions: transactions
        };

        response.setHeader('Content-Type', 'application/json');
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        response.send(JSON.stringify(transactionsResult));
    },

    getBalance: (req, res) => {
        const address = req.params['address'];
        // TODO validate address

        const requestedConfirmationNumber = 6;
        // TODO move out to a configuration file or command line parameter

        const confirmedBalance = new Balance(address);
        const lastMinedBalance = new Balance(address);
        const pendingBalance = new Balance(address);

        const blocks = node.blocks;

        // process confirmed confirmed balance
        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            let block = blocks[blockIndex];

            for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
                let tx = block.transactions[txIndex];

                if (tx.paid && (tx.to === address || tx.from === address)
                ) {
                    // confirmed balance
                    if ((blocks.length - tx.minedInBlockIndex) >= requestedConfirmationNumber) {
                        confirmedBalance.includeTransaction(tx);
                    }
                    // last minute balance
                    lastMinedBalance.includeTransaction(tx);
                    // pending balance
                    pendingBalance.includeTransaction(tx);
                }
            }
        }
        for (let txIndex = 0; txIndex < node.pendingTransactions.length; txIndex++) {
            let tx = node.pendingTransactions[txIndex];
            if (tx.to === address || tx.from === address) {
                pendingBalance.includeTransaction(tx);
            }
        }

        let balance = {
            address: address,
            confirmedBalance: {
                confirmations: requestedConfirmationNumber,
                balance: confirmedBalance.balance
            },
            lastMinedBalance: {
                confirmations: 1,
                balance: lastMinedBalance.balance
            },
            pendingBalance: {
                confirmations: 0,
                balance: pendingBalance.balance
            }
        };

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(balance));
    }
};