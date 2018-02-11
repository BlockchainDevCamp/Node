const node = require("../index");

module.exports = {
    getAllBlocks: (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(node.blocks));
    },
    getBlockByIndex: (req, res) => {
        const index = Number(req.params.index);
        const blocks = node.blocks;

        if (index >= 0 && index < blocks.length) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(blocks[index]));
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ "Error": "Invalid block index" }));
        }
    },
    postNotifyBlock: (req, res) => {
        let blockIndex = req.body.index;

        if(blockIndex > node.blocks.length){
            // TODO request full blockchain and check if its valid
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"message": "Thank you"}));
    }
}