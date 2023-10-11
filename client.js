'use strict';

const api = require('@opentelemetry/api');
const tracer = require('./tracer')('example-http-client');
const http = require('http');

/** A function which makes requests and handles response. */
function makeRequest() {
  // span corresponds to outgoing requests. Here, we have manually created
  // the span, which is created to track work that happens outside of the
  // request lifecycle entirely.
  tracer.startActiveSpan('makeRequest', (span) => {
    http.get({
      host: 'localhost',
      port: 8080,
      path: '/helloworld',
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        console.log(body.toString());
        span.end();
      });
    });
  });

  // The process must live for at least the interval past any traces that
  // must be exported, or some risk being lost if they are recorded after the
  // last export.
  console.log('Sleeping 5 seconds before shutdown to ensure all records are flushed.');
  setTimeout(() => { console.log('Completed.'); }, 5000);
}

//makeRequest();

const myLocation = process.argv.slice(2,4).map((v) => parseInt(v));



const express = require('express')
const app = express()
const port = 3000

const [myX, myY] = process.argv.slice(2,4).map((v) => parseInt(v));
console.log(myX, myY);

app.get('/', (req, res) => {
  var start = process.hrtime();
  tracer.startActiveSpan('Send ping from [{x}, {y}]', {
    attributes: { 
    x: myLocation[0],
    y: myLocation[1],
  }}, (span) => {
    http.get({
      host: 'localhost',
      port: 3001,
      path: `/ping/${myLocation[0]}/${myLocation[1]}`,
    }, (response) => {
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => {
        const elapsedMs = process.hrtime(start)[1] / 1000000;
        console.log(body.toString());
        res.send(`<div style="background-color: green; height: ${elapsedMs}px; width: ${elapsedMs}px; border-radius: ${elapsedMs}px"></div>`);
        span.end();
      });
    });
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})