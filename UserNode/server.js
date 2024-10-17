
"use strict";

const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const app = express();
const services = xsenv.getServices({ uaa: 'WorkBenchApplication_Xsua' });

passport.use(new JWTStrategy(services.uaa));

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));


app.get('/user', function (req, res, next) {
  res.json({
    user: req.user,
    token: req.authInfo.getAppToken()
  });
});
const port = process.env.PORT || 3000;

app.listen(port, function () {
  //console.log('app listening on port ' + port);
});