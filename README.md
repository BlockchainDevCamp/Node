# Node

# TODO: Description to be added

# Launching

In order to launch the `Node` server you would need to execute the following command in the command line:
```
npm start
```

Environment could be specified when launching the server as well:
```
NODE_ENV=<ENVIRONMENT_NAME> npm start 
```
where `<ENVIRONMENT_NAME>` should be the value of the corresponding environment on which the server would be ran, e.g. `development`.

# API

## Publish Transaction


### Example 

#### Request
```
{
    "from": "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
    "to": "f51362b7351ef62253a227a77751ad9b2302f911",
    "senderPubKey": "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1",
    "value": 25000,
    "fee": 10,
    "dateCreated": "2018-02-10T17:53:48.972Z",
    "senderSignature": [
        "1aaf55dcb11060749b391d547f37b4727222dcb90e793d9bdb945c64fe4968b0",
        "87250a2841f7a56910b0f7ebdd067589632ccf19d352c15f16cfdba9b7687960"
    ]
}
```

#### Response
On successful call the status would be either: 
* `201`, i.e. a new wallet was created on the server or 
* `200`, i.e. the resource does already exist.

The payload would be look in the following way:
```
{
    "transactionHash": "b2e0d16602bf0a8e5a78b1d0133e535afe85638112b45cc511bbafc2a8279f34"
}
```