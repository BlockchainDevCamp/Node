const controllers = require('../controllers');

module.exports = app => {
    app.get('/info', controllers.mainController.info);
    app.get('/peers', controllers.peersController.getPeers);
    app.post('/peers', controllers.peersController.postPeers);
    app.get('/transactions/confirmed', controllers.transactionController.getConfirmedTransactions);
    app.get('/transactions/pending', controllers.transactionController.getPendingTransactions);
    app.get('/transactions/:transactionHash', controllers.transactionController.getTransaction);
    app.post('/transactions', controllers.transactionController.createTransaction);
    app.get('/addresses/:address/balance', controllers.addressController.getBalance);
    app.get('/addresses/:address/transactions', controllers.addressController.getTransactionsPerAddress);
    app.get('/blocks', controllers.blockController.getAllBlocks);
    app.get('/blocks/:index', controllers.blockController.getBlockByIndex);
    app.post('/blocks/notify', controllers.blockController.postNotifyBlock);
    app.get('/mine/:address', controllers.mineContoller.startMine);
    app.post('/mine/submit', controllers.mineContoller.submitBlock);
    
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};