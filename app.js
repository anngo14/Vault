var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var bcrypt = require('bcrypt');
var fs = require('fs');
var cors = require('cors');
var jwt = require('jsonwebtoken');
const { exit } = require('process');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://anngo14:powermacg5@vault-cluster.qcnmp.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true });

var app = express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());
client.connect(err => {
    if(err) throw err;
    console.log("Connected to MongoDB");
    collection = client.db("Vault-DB").collection("Vault-Collection");
});

function verifyToken(req, res, next) {
    if(!req.headers.authorization){
        return res.status(401).send({status: "Unauthorized" });
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null'){
        return res.status(401).send({status: "Unauthorized" });
    }
    let payload = jwt.verify(token, 'secret');
    if(!payload){
        return res.status(401).send({status: "Unauthorized" });
    }
    req.userId = payload.subject;
    next();
}

app.post('/login', (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;

    collection.findOne({email: email}, (err, result) => {
        if(err) throw err;
        if(result === null){
            res.send({status: "Invalid Email"});
            return;
        }
        if(bcrypt.compareSync(pass, result.password)){
            let payload = { subject: result._id }
            let token = jwt.sign(payload, 'secret');
            res.status(200).send({token});
        } else{
            res.send({status: "Invalid Password"});
        }
    });
});
app.post('/register', async (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);
    let user = {
        email: email,
        password: hashedPassword
    }
    var existing = collection.findOne({email: email});
    if(existing !== null){
        res.status(400).send({status: "Existing Account"});
        return;
    }
    collection.insertOne(user, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send({status: 400});
            return;
        }
        let payload = { subject: user._id };
        let token = jwt.sign(payload, 'secret');
        res.status(200).send({token});
    });
});

client.close();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});