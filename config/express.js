const express = require('express');
const bodyParser = require('body-parser');

module.exports = app => {
    app.use(bodyParser.urlencoded({extended: true}));
};