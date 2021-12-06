"use strict";

const mongoose = require('mongoose');

const link = mongoose.Schema({
    short:{type:String, required:true},
    url:{type:String, required:true}
});

module.exports = mongoose.model("Link",link); 