const node = require("../index");
const request = require('request');


function notifyAllPeers(newBlockIndex) {

    console.log("START NOTIFIYING PEERS FOR BLOCK INDEX = " + newBlockIndex);

    for (const peer of node.peers) {

        let peerUrl = peer.peerUrl;

        const requestOptions = {
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            method: 'POST',
            url: peerUrl+"mine/submit",
            body: {
                nodeAddress: node.address,
                index: newBlockIndex
            },
            json: true
        };

        request.post(requestOptions, function(error, response, body){
            if (error) throw error;
            console.log("Peer " + peer.name +" Notified.  URL--> " + peerUrl);
        });
    }


}

module.exports = notifyAllPeers;