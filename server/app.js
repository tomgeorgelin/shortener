"use strict";

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Link = require('./models/Link');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shortener-api-user:GOF6zeofm3BKEBau@shortener.ixbis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('connexion réussie'))
    .catch(() => console.log('connexion foirée'));

app.use(express.json());

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.get('/shortener/:page',(req, res) => {
    Link.findOne({short:req.params.page})
    .then(link => {
        if(!link) {
            res.status(404);
            res.json({message:'le lien n\'a pas été trouvé'});
        }
        else {
            res.status(200);
            var preLink = '';
            if(!link.url.includes('http'))
                preLink = 'http://';
            res.redirect(preLink+link.url);
        }
    }).
    catch(error => {
        res.status(400);
        res.json({message:error});
        console.log(error);
    });
});

app.get('/shortener',(req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
    //res.json({datas:"home!"});
});

app.post('/api',(req,res) => {
    delete req.body._id;
    const link = new Link({
        url:req.body.url,
        short:makeId(5)
    })
    link.save()
        .then((e) => {
            res.status(201);
            res.json({code:req.protocol + '://' + req.get('host') + '/shortener/' + e.short});
        })
        .catch(error => res.status(400).json({ error }));
});

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

module.exports = app;
