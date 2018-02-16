module.exports = {
    getTransaction: (req, res) => {
    const tranHash = req.params['transactionHash'];
    const transactions = node.transactions;
    let tranExists = false;
    let transaction;

    for (var i = 0; i < transactions; i++) {
        if (transactions[i].transactionHash === tranHash) {
            tranExists = true;
            transaction = transactions[i];
            break;
        }
    }

    if (tranExists) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(transaction));
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ "Error": "Invalid transaction hash" }));
    }
    },
    postTransaction: (req, res) => {
        res.send("POST Transactions");
        // TODO
    }
}