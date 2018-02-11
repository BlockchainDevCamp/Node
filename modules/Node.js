class Node {
    constructor(about, name, peers, blocks, balnances, pendingTransactions, difficulty, miningJobs){
        this.about = about; // string
        this.name  = name; // string
        this.peers = peers; // []
        this.blocks = blocks; // []
        this.balnances = balnances; // map(address => number)
        this.pendingTransactions = pendingTransactions; // []
        this.difficulty = difficulty; // number
        this.miningJobs = miningJobs; // map(address => block)
    }
}

module.exports = Node;