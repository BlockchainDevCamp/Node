const env = process.env.NODE_ENV || 'development';
const BlockClass = require('./modules/Block');
const NodeClass = require('./modules/Node');

let BlockInstance = new BlockClass;

let Node = new NodeClass("SoftuinChain", "Alex", [], [BlockInstance.generageGenesisBlock()],new Map(), [], 6, new Map());

module.exports = Node;

const config = require('./config/config')[env];
const app = require('express')();
require('./config/express')(app);
require('./config/routes')(app);
app.listen(config.port);
console.log("Listening on port: " + config.port)