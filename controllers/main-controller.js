const Node = require('../index');

module.exports = {
    info: (req, res) => {
        console.log(Node);
        res.send("GET Info");
        // TODO
    },
    
    getBalance: (req, res) => {
        res.send("GET Balance");
        // TODO
    },
};