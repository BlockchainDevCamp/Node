const env = process.env.NODE_ENV || 'development';
const Block = require('./modules/Block');
const Node = require('./modules/Node');

let block = new Block;
//TODO add fake pending transaction for testing
let difficulty = 2;

let node = new Node("SoftuniChain", "Alex", [], [block.generageGenesisBlock()],new Map(), [], difficulty, new Map());

if(node.peers.length != 0){
    //TODO Make POST to  nodeURL/peers

}

module.exports = node;

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port)