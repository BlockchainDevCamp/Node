const mainController = require('./main-controller');
const blockController = require('./blocks-controller');
const mineContoller = require('./mine-controller');
const peersController = require('./peers-controller');
const transactionController = require('./transaction/transaction-controller');

module.exports = {
    mainController,
    blockController,
    mineContoller,
    peersController,
    transactionController
};