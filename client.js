'use strict';

const api = require('@opentelemetry/api');
const {tracer,makeSpan,log} = require('./tracer').getTracer('pi estimator');
const http = require('http');

makeSpan("Estimating pi", () => {
  return new Promise((resolve,reject) => {
    http.get({
      host: 'localhost',
      port: 3333,
      path: `/numbers/0/1000/1000`,
    }, (response) => {
      resolve();
    });
  });
});

