var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var bcrypt = require('bcrypt');
var fs = require('fs');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var cryptr = require('cryptr');
const { APP_ID } = require('@angular/core');
const Cryptr = require('cryptr');
const PORT = process.env.PORT || 5000;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const mongo_user = process.env.MONGO_USER;
const mongo_key = process.env.MONGO_KEY;
const token_secret = process.env.TOKEN;
const crypt_secret = process.env.CRYPT;

const uri = `mongodb+srv://${mongo_user}:${mongo_key}@vault-cluster.qcnmp.mongodb.net/Vault-DB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });

var app = express();
app.use(express.static(path.join(__dirname, 'dist/Vault')));
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());
const angularEntry = path.join(__dirname, 'dist/Vault/index.html');

client.connect(err => {
    if(err){
        console.log(err);
    }
    console.log("Connected to MongoDB");
    collection = client.db("Vault-DB").collection("Vault-Collection");
});

function verifyToken(req, res, next) {
    console.log("verify");
    if(!req.headers.authorization){
        return res.status(401).send({status: "Unauthorized" });
    }
    let token = req.headers.authorization.split(' ')[1];
    console.log(token);
    if(token === 'null'){
        return res.status(401).send({status: "Unauthorized" });
    }
    let payload = jwt.verify(token, `${token_secret}`);
    if(!payload){
        return res.status(401).send({status: "Unauthorized" });
    }
    req.userId = payload.subject;
    next();
}
function encrypt(s){
    cryptr = new Cryptr(`${crypt_secret}`);
    return cryptr.encrypt(s);
}
function decrypt(s){
    return cryptr.decrypt(s);
}
app.post('/api/personal', verifyToken, (req, res) => {
    let email = req.body.email;
    collection.findOne({email: email}, { projection: { _id: 0, personalArray: 1}}, (err, result) => {
        if(err) throw err;
        res.send({result});
    });
});
app.post('/api/secret', verifyToken, (req, res) => {
    let email = req.body.email;
    collection.findOne({email: email}, { projection: { _id: 0, secretArray: 1}}, (err, result) => {
        if(err) throw err;
        res.send({result});
    });
});
app.post('/api/other', verifyToken, (req, res) => {
    let email = req.body.email;
    collection.findOne({email: email}, { projection: { _id: 0, otherArray: 1}}, (err, result) => {
        if(err) throw err;
        res.send({result});
    });
});
app.post('/api/login', (req, res) => {
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
            let token = jwt.sign(payload, `${token_secret}`);
            res.status(200).send({token});
        } else{
            res.send({status: "Invalid Password"});
        }
    });
});
app.post('/api/register', async (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);
    let user = {
        email: email,
        password: hashedPassword
    }
    collection.insertOne(user, (err, result) => {
        if(err){
            console.log(err);
            res.send({status: 400});
            return;
        }
        let payload = { subject: user._id };
        let token = jwt.sign(payload, `${token_secret}`);
        res.status(200).send({token});
    });
});
app.post('/api/checkExistingUser', (req, res) => {
    let email = req.body.email;
    collection.findOne({email: email}, (err, result) => {
        if(err){
            console.log(err);
            res.send({status: 400});
            return;
        }
        if(result === null){
            res.send({status: 404});
        } else{
            res.send({status: 200});
        }
    });
})
app.post('/api/wipeData', verifyToken, (req, res) => {
    let email = req.body.email;
    collection.updateOne({email: email}, {
        $unset: {
            personalArray: "",
            secretArray: "",
            otherArray: ""
        }
    }, (err, result) => {
        if(err){
            console.log(err);
            res.send({status: 400});
            return;
        }
        res.send({status: 200});
    })
});
app.post('/api/check', verifyToken, (req, res) => {
    let email = req.body.email;
    let label = req.body.label;
    let c = req.body.category;
    var doc;
    if(c == 0){
        collection.findOne({email: email, "personalArray.label": label}, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            console.log(result);
            if(result === null){
                res.send({status: 404});
                return;
            }
            res.send({status: 200});
            console.log("existing password");
        });
    } else if (c == 1){
        collection.findOne({email: email, "secretArray.label": label}, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            console.log(result);
            if(result === null){
                res.send({status: 404});
                return;
            }
            res.send({status: 200});
            console.log("existing password");
        });
    } else{
        collection.findOne({email: email, "otherArray.label": label}, (err, result) => {
            if(err){
                console.log(err);
                return;
            }
            console.log(result);
            if(result === null){
                res.send({status: 404});
                return;
            }
            res.send({status: 200});
            console.log("existing password");
        });
    }    
});
app.post('/api/changeMasterPassword', verifyToken, async (req, res) => {
    let email = req.body.email;
    let pass = req.body.pass;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);
    collection.updateOne({email: email}, {
        $set: { password: hashedPassword }
    }, (err, result) => {
        if(err){
            console.log(err);
            res.send({status: 400});
            return;
        }
        let payload = { subject: result._id };
        let token = jwt.sign(payload, `${token_secret}`);
        res.status(200).send({token});
    });
});
app.post('/api/deleteUser', verifyToken, (req, res) => {
    let email = req.body.email;
    collection.deleteOne({email: email}, (err, result) => {
        if(err){
            console.log(err);
            res.send({status: 400});
            return;
        }
        res.send({status: 200});
    });
});
app.post('/api/insert', verifyToken, (req, res) => {
    let email = req.body.email;
    let c = req.body.category;
    let password = req.body.password;
    var pass; 
    console.log(password.accounts);
    if(c == 0){
        pass = collection.updateOne({email: email}, 
            {
                $push: {
                    personalArray: {
                        label: password.label,
                        website: password.website,
                        category: c,
                        accounts: password.accounts
                    }
                }
        }).catch((err) => {
            if(err) console.log(err);
        });
        res.status(200).send({status: 200});
    } else if(c == 1){
        pass = collection.updateOne({email: email}, 
            {
                $push: {
                    secretArray: {
                        label: password.label,
                        website: password.website,
                        category: c,
                        accounts: password.accounts
                    }
                }
        }).catch((err) => {
            if(err) console.log(err);
        });
        res.status(200).send({status: 200});
    } else{
        pass = collection.updateOne({email: email}, 
            {
                $push: {
                    otherArray: {
                        label: password.label,
                        website: password.website,
                        category: c,
                        accounts: password.accounts
                    }
                }
        }).catch((err) => {
            if(err) console.log(err);
        });
        res.status(200).send({status: 200});
    }
});
app.post('/api/delete', verifyToken, (req, res) => {
    let email = req.body.email;
    let c = req.body.category;
    let label = req.body.label;
    if(c == 0){
        collection.updateOne({email: email}, {
            $pull: {
                personalArray: { label: label } 
            }
        });
        res.send({status: 200});
    } else if(c == 1){
        collection.updateOne({email: email}, {
            $pull: {
                secretArray: { label: label } 
            }
        });
        res.send({status: 200});
    } else{
        collection.updateOne({email: email}, {
            $pull: {
                otherArray: { label: label } 
            }
        });
        res.send({status: 200});
    }
});
app.post('/api/addAccount', verifyToken, (req, res) => {
    let email = req.body.email;
    let c = req.body.category;
    let label = req.body.label;
    let newAccount = req.body.account;

    if(c == 0){
        collection.updateOne({email: email, "personalArray.label": label}, {
            $push:
            {
                "personalArray.$.accounts": newAccount
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    } else if (c == 1){
        collection.updateOne({email: email, "secretArray.label": label}, {
            $push:
            {
                "secretArray.$.accounts": newAccount
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    } else{
        collection.updateOne({email: email, "otherArray.label": label}, {
            $push:
            {
                "otherArray.$.accounts": newAccount
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    }
});
app.post('/api/removeAccount', verifyToken, (req, res) => {
    let email = req.body.email;
    let label = req.body.label;
    let c = req.body.category;
    let user = req.body.user;

    if(c == 0){
        collection.updateOne({email: email, "personalArray.label": label}, {
            $pull:
            {
                "personalArray.$.accounts": { user: user }
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    } else if(c == 1){
        collection.updateOne({email: email, "secretArray.label": label}, {
            $pull:
            {
                "secretArray.$.accounts": { user: user }
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    } else{
        collection.updateOne({email: email, "otherArray.label": label}, {
            $pull:
            {
                "otherArray.$.accounts": { user: user }
            }
        }, (err, result) => {
            if(err) throw err;
        });
        res.send({status: 200});
    }
});
app.post('/api/updateAccount', verifyToken, (req, res) => {
    let email = req.body.email;
    let label = req.body.label;
    let accounts = req.body.accounts;
    let c = req.body.category;
    if(c == 0){
        collection.updateOne({email: email, "personalArray.label": label}, {
            $set: {
                "personalArray.$.accounts": accounts
            }
        });
        res.send({status: 200});
    } else if(c == 1){
        collection.updateOne({email: email, "secretArray.label": label}, {
            $set: {
                "secretArray.$.accounts": accounts
            }
        });
        res.send({status: 200});
    } else{
        collection.updateOne({email: email, "otherArray.label": label}, {
            $set: {
                "otherArray.$.accounts": accounts
            }
        });
        res.send({status: 200});
    }
});
app.get('/login', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
app.get('/register', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
app.get('/home', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
app.get('/generator', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
app.get('/settings', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
app.get('*', (req, res) => {
    let urlPath = req.url;
    res.sendFile(angularEntry);
});
client.close();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});