const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/15_1DB', {useNewUrlParser: true});

let messages = [];
let counter = 1;

const message = new Schema({
    name: String,
    text: String,
    id: Number
});

const Message = mongoose.model("Message", message);

setupdata();

function log(request, responce, next) {
    console.log(request.method + ': ' + request.url);
    next();
}



app.use('/static', express.static('public'));
//Alt det ligger i public kan adgaaes gennem at skrive static/filnavn


function setupdata() {
    addMessage("Besked1", "Bot");
    addMessage("Besked2", "Bot");
    addMessage("Besked3", "Bot");
    addMessage("Besked4", "Bot");
    addMessage("Besked5", "Bot");
    addMessage("Besked6", "Bot");
    addMessage("Besked7", "Bot");
    addMessage("Besked8", "Bot");
    addMessage("Besked9", "Bot");

}

function addMessage(text, name) {
    console.log("Name: " + name);
    if (text.length > 0) {
        const message = new Message({
            name: name,
            text: text,
            id: counter
        });
        counter ++;
        return message.save();
    }
    else {
        return false;
    }
}

function getMessages() {
    return Message.find().exec();
}

function getMessageByID(msgID) {
    return Message.findOne({
        id: msgID
    }).exec();
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/Opgave15_2_index.html'));
});


app.get('/messages', (req, res) => {
    //let jsonarray = JSON.stringify(messages);
    let jsonarray = getMessages().then((messages) => {
        res.send("jeg er i GET /message path :) \n" + messages);
    });

});

app.get('/message/:id', (req, res) => {
    //console.log(req);
    let message = messages.find(function (m) {
        //Kan laves global function
        if (m.id == req.params.id) {
            console.log("Found item");
            return true;
        }
    });
    try {
        res.send("jeg er i /message/:id path :)   " + JSON.stringify(message));
    }
    catch (e) {
        res.send("jeg er i /message/:id path :)  med Error: " + e.valueOf());
    }

});

app.post('/messages', (req, res) => {
    addMessage(req.body.message, req.body.name).then(function (obj) {
        console.log(obj);
        if (obj) {
            res.send(obj);
        }
        else {
            res.send("Failed");
        }
    }

    );


});

app.delete('/message/:id', (req, res) => {
    console.log("Delete area accessed");
    messages = messages.filter(function (m) {
        if (m.id != req.params.id) {
            console.log("Item found");
            return true;
            //Check if items acutally get deleted
        }
    })
});

app.put('/message/:id', (req, res) => {
    let message = messages.find(function (m) {
        //Kan laves global function
        if (m.id == req.params.id) {
            console.log("Found item");
            return true;
        }
    });

    if (req.body.message.length > 0) {
        message.message = req.body.message;
    }

});

app.listen(8080);

