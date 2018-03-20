const env = process.env.NODE_ENV || 'development';
const Block = require('./modules/Block');
const Node = require('./modules/Node');
const Peer = require('./modules/Peer');
const LoadInitPeers = require("./util/loadInitialPeers");

let block = new Block;
//TODO add fake pending transaction for testing

let peer = new Peer("Node1","http://127.0.0.1:5555/") ;
let difficulty = 2;

let node = new Node("SoftuniChain", "Alex", [peer], [block.generageGenesisBlock()],new Map(), [], difficulty, new Map());

new LoadInitPeers().load();

module.exports = node;

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port)