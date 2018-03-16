const node = require('../index');

const Balance = require('./address/Balance');

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
    }
};