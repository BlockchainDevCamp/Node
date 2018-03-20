class Node {
    constructor(about, name, peers, blocks, balnances, address, pendingTransactions, difficulty, miningJobs){
        this.about = about; // string
        this.name  = name; // string
        this.peers = peers; // []
        this.blocks = blocks; // []
        this.address    = address; // URL of the node itself
        this.pow = difficulty; 

        this.balnances = balnances; // map(address => number)
        this.pendingTransactions = pendingTransactions; // []
        this.difficulty = difficulty; // number
        this.miningJobs = miningJobs; // map(address => block)
    }
}

module.exports = Node;