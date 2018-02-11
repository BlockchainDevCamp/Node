const ipRegex = require('ip-port-regex');
const Node = require('../index');
const Peer = require('../modules/Peer');


module.exports = {
    getPeers: (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(Node.peers));
    },
    // post request with 2 parameters (name,url)
    postPeers: (req, res) => {

    var peerUrl  = req.query.url;

        if(urlValidator(peerUrl)) {

            // TODO: could add funcitonality to check if 'peerName' and  'peerUrl' are unique per Node
            var peerName = req.query.name;

            peer = new Peer(peerName,peerUrl);

            Node.peers.push(peer);
            res.setHeader('Content-Type', 'application/json');
            res.status(201).json({ message: 'Peer has been added',
                                    peers: Node.peers} );

        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ error: 'Wrong IP format' });
        }

    },
};

// method for validating URL format
function urlValidator (ip) {
    return ipRegex({exact: true}).test(ip)
}