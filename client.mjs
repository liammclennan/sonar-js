'use strict';

import { getTracer } from './tracer.js';
import http from 'http';

const { tracer,log } = getTracer('PI estimator');

tracer.startActiveSpan('Estimating PI', async (span) => {
  const xs = await getNumbers(500);
  const ys = await getNumbers(500);
  span.end();
});

function getNumbers(count) {
  return new Promise((resolve,reject) => {
    tracer.startActiveSpan(`Requesting random numbers`,(span) => {
      http.get({
        host: 'localhost',
        port: 3333,
        path: `/numbers/0/1000/1000`,
      }, (response) => {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
          const numbers = JSON.parse(rawData);
          log("Received {Count} random numbers", {Count: numbers.length});
          span.end();
          resolve(numbers);
        });
      });
    });
  });
}




