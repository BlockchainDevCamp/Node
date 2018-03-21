const env = process.env.NODE_ENV || 'development';
const Block = require('./modules/Block');
const Node = require('./modules/Node');
const Peer = require('./modules/Peer');
const LoadInitPeers = require("./util/loadInitialPeers");

let block = new Block;
//TODO add fake pending transaction for testing

let about = "SoftuniChain";
let name =  "Alex";
let peers = [];
let blocks = [];
let balances = new Map();
let address = "";
let pendingTransactions = [];
let difficulty = 3;
let miningJobs = new Map();

let node = new Node(
    about, name, peers, blocks, balances, address, pendingTransactions, difficulty, miningJobs
);

new LoadInitPeers().load(node);

module.exports = node;

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port);

module.exports=node;