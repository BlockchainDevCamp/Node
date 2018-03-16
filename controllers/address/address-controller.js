const node = require('../../index');

const Balance = require('./Balance');

module.exports = {

    getBalance: (req, res) => {
        node.blocks = [
            {
                index: 0,
                transactions: [
                    {
                        from: "ac51700449340e5400e13772741c94cc9c457799",
                        to: "0a37ccb342861218ea8331fdf6e4a4a6521e3e55",
                        value: 5,
                        paid: true,
                        minedInBlockIndex: 0
                    },
                    {
                        from: "0a37ccb342861218ea8331fdf6e4a4a6521e3e55",
                        to: "353c42f7ca9cfcc532e9f252ffd88fcf74af8efb",
                        value: 10,
                        paid: true,
                        minedInBlockIndex: 0
                    },
                    {
                        from: "353c42f7ca9cfcc532e9f252ffd88fcf74af8efb",
                        to: "ac51700449340e5400e13772741c94cc9c457799",
                        value: 20,
                        paid: true,
                        minedInBlockIndex: 0
                    }
                ]
            },
            {
                index: 1,
                transactions: [
                    {
                        from: "0a37ccb342861218ea8331fdf6e4a4a6521e3e55",
                        to: "ac51700449340e5400e13772741c94cc9c457799",
                        value: 10,
                        paid: true,
                        minedInBlockIndex: 1
                    },
                    {
                        from: "353c42f7ca9cfcc532e9f252ffd88fcf74af8efb",
                        to: "ac51700449340e5400e13772741c94cc9c457799",
                        value: 5,
                        paid: false,
                        minedInBlockIndex: 1
                    }
                ]
            }
        ];
        node.pendingTransactions = [
            {
                from: "ac51700449340e5400e13772741c94cc9c457799",
                to: "353c42f7ca9cfcc532e9f252ffd88fcf74af8efb",
                value: 5
            },
            {
                from: "0a37ccb342861218ea8331fdf6e4a4a6521e3e55",
                to: "353c42f7ca9cfcc532e9f252ffd88fcf74af8efb",
                value: 10
            }
        ];
        const address = req.params['address'];
        // TODO validate address

        const requestedConfirmationNumber = 2;
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