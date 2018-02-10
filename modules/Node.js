class Node {
    constructor(peers, blocks, balnances, pendingTransactions, difficulty, miningJobs){
        this.peers = peers; // []
        this.blocks = blocks; // []
        this.balnances = balnances; // map(address => number)
        this.pendingTransactions = pendingTransactions; // []
        this.difficulty = difficulty; // number
        this.miningJobs = miningJobs; // map(address => block)
    }
}

module.exports = Block;