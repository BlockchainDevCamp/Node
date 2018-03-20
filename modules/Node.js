class Node {
    constructor(about, name, peers, blocks, balances, address, pendingTransactions, difficulty, miningJobs){
        this.about = about; // string
        this.name  = name; // string
        this.peers = peers; // []
        this.blocks = blocks; // []
        this.balnances = balances; // map(address => number)
        this.address    = address; // URL of the node itself
        this.pendingTransactions = pendingTransactions; // []
        this.pow = difficulty;
        this.difficulty = difficulty; // number
        this.miningJobs = miningJobs; // map(address => block)
    }
}

module.exports = Node;