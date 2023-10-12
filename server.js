'use strict';

const port = process.argv[4];

const api = require('@opentelemetry/api');
const tracer = require('./tracer')(`sonar-js ${port}`);
const http = require('http');
const express = require('express')
const app = express()

const [myX, myY] = process.argv.slice(2,4).map((v) => parseInt(v));
const otherPort = port === 3000 ? 3001 : 3000;

app.get('/', (req, res) => {
  sendPing(otherPort, myX, myY, 10000, (response, span, start) => {
    response.on('end', () => {
      const elapsedMs = process.hrtime(start)[1] / 1000000;
      res.send(`<div style="background-color: green; height: ${elapsedMs}px; width: ${elapsedMs}px; border-radius: ${elapsedMs}px"></div>`);
      span.end();
    });
  });
})

app.get('/ping/:x/:y/:amplitude', ({params: {x,y,amplitude}}, res) => {
  const span = tracer.startSpan(`Received ping from [{x}, {y}]`, {
    kind: 1, // server
    attributes: { x, y },
  });
  const calculatedDistance = distance([myX,myY], [x,y]);
  const newAmplitude = amplitude - calculatedDistance;
  span.setAttribute('CalculatedDistance', calculatedDistance);
  span.setAttribute('NewAmplitude', newAmplitude);

  setTimeout(() => {
    // if (newAmplitude > 0) {
    //   sendPing(otherPort, myX, myY, newAmplitude, (response, span, start) => {
    //     response.on('end', () => {
    //       const elapsedMs = process.hrtime(start)[1] / 1000000;
    //       res.sendStatus(200);
    //       span.end();
    //     });
    //   });
    // }
    res.sendStatus(200);
    span.end();
  }, calculatedDistance);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function distance([x,y], [x2,y2]) {
  return Math.sqrt(Math.pow(Math.abs(x-x2),2) + Math.pow(Math.abs(y-y2),2));
}

function sendPing(port, x,y,amplitude, callback) {
  var start = process.hrtime();
  tracer.startActiveSpan('Send ping from [{x}, {y}] with amplitude {amplitude}', {
    attributes: { 
    x,
    y,
    amplitude
  }}, (span) => {
    http.get({
      host: 'localhost',
      port,
      path: `/ping/${x}/${y}/${amplitude}`,
    }, (response) => {
      callback(response, span, start);
    });
  });
}