const node = require("../index");
const request = require('request');


function notifyAllPeers(newBlockIndex) {

    console.log("START NOTIFIYING PEERS FOR BLOCK INDEX = " + newBlockIndex);

    for (const peer of node.peers) {

        let peerUrl = peer.peerUrl;
        console.log("PEER URL: "+ peerUrl);
        const requestOptions = {
            method: 'POST',
            url: peerUrl+"/mine/submit",
            body: {
                nodeAddress: node.address,
                index: newBlockIndex
            },
            json: true
        };

        request.post(requestOptions, function(error, response, body){
            if (error) console.error(error);
            console.log("Peer " + peer.name +" Notified.  URL--> " + peerUrl);
        });
    }


}

module.exports = notifyAllPeers;