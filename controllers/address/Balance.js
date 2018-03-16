'use strict';

class Balance {

    constructor(address) {
        this.address = address;
        this.balance = 0;
    }

    includeTransaction(transaction) {
        if (this.address === transaction.from) {
            this.balance -= transaction.value;
        } else if (this.address === transaction.to) {
            this.balance += transaction.value;
        }
    }
}

module.exports = Balance;
