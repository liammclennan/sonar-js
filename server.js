'use strict';

const api = require('@opentelemetry/api');
const tracer = require('./tracer')('example-http-server');
const http = require('http');

/** Starts a HTTP server that receives requests on sample server port. */
function startServer(port) {
  // Creates a server
  const server = http.createServer(handleRequest);
  // Starts the server
  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Node HTTP listening on ${port}`);
  });
}

/** A function which handles requests and send response. */
function handleRequest(request, response) {
  const currentSpan = api.trace.getActiveSpan();
  // display traceid in the terminal
  const traceId = currentSpan.spanContext().traceId;
  console.log(`traceId: ${traceId}`);
  const span = tracer.startSpan('handleRequest', {
    kind: 1, // server
    attributes: { key: 'value' },
  });
  // Annotate our span to capture metadata about the operation
  span.addEvent('invoking handleRequest');

  const body = [];
  request.on('error', (err) => console.log(err));
  request.on('data', (chunk) => body.push(chunk));
  request.on('end', () => {
    // deliberately sleeping to mock some action.
    setTimeout(() => {
      span.end();
      response.end('Hello World!');
    }, 2000);
  });
}

//startServer(8080);

const express = require('express')
const app = express()
const port = 3001

const [myX, myY] = process.argv.slice(2,4).map((v) => parseInt(v));
console.log(myX, myY);

app.get('/ping/:x/:y', ({params: {x,y}}, res) => {
  const span = tracer.startSpan(`Received ping from [{x}, {y}]`, {
    kind: 1, // server
    attributes: { key: 'value', x, y },
  });
  const calculatedDistance = distance([myX,myY], [x,y]);
  span.setAttribute('CalculatedDistance', calculatedDistance);
  setTimeout(() => {
    res.send('pong');
    span.end();
  }, calculatedDistance);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function distance([x,y], [x2,y2]) {
  return Math.sqrt(Math.pow(Math.abs(x-x2),2) + Math.pow(Math.abs(y-y2),2));
}
