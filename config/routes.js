const controllers = require('../controllers');

module.exports = app => {
    app.get('/info', controllers.mainController.info);
    app.get('/peers', controllers.peersController.getPeers);
    app.post('/peers', controllers.peersController.postPeers);
    app.get('/transactions/:transactionHash', controllers.transactionController.getTransaction);
    app.post('/transactions', controllers.transactionController.createTransaction);
    app.get('/balance/:address/confirmations/:confirmationNum', controllers.mainController.getBalance)
    app.get('/blocks', controllers.blockController.getAllBlocks);
    app.get('/blocks/:index', controllers.blockController.getBlockByIndex);
    app.post('/blocks/notify', controllers.blockController.postNotifyBlock);
    app.post('/mine', controllers.mineContoller.startMine);
    app.post('/mine/submit/:blockNum', controllers.mineContoller.submitBlock);
    
    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};