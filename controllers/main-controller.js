const node = require('../index');

module.exports = {
    info: (req, res) => {
        let infoObj = {
            "about": node.about,
            "nodeName": node.name,
            "peers": node.peers.length,
            "blocks": node.blocks.length,
            "confirmedTransactions": 208,
            "pendingTransactions": 7,
            "addresses": node.balnances.size,
            "coins": 18000000
        };

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(infoObj));
    },

    getBalance: (req, res) => {
        let address = req.body.address;
        let confirmationNum = req.body.confirmationNum;
        let txBalance = node.balnances[address];

        let obj = {
            "address": address,
            "confirmedBalance": { "confirmations": confirmationNum, "balance": txBalance }
        }

        res.setHeader('Content-Type', 'application/json');
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(JSON.stringify(obj));
    },
};