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
        res.send(JSON.stringify(infoObj));
    },

    getBalance: (req, res) => {
        res.send("GET Balance");
        // TODO
    },
};