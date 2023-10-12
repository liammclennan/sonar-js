'use strict';

import { getTracer } from './tracer.js';
import http from 'http';

const { tracer,log } = getTracer('PI estimator');

tracer.startActiveSpan('Estimating PI', async (span) => {
  const xs = await getNumbers(0,1000, 500);
  const ys = await getNumbers(0, 1000, 500);
  const pointsInCircle = await countPointsInCircle(xs, ys, [500,500], 400);
  span.end();
});

function countPointsInCircle(xs, ys, centre, radius) {
  return new Promise((resolve,reject) => {
    tracer.startActiveSpan(
      `Requesting count of points in circle`,
      { attributes: { centre, radius } },
      (span) => {
        const postData = JSON.stringify({xs,ys});
        const circleReq = http.request({
          host: 'localhost',
          method: 'POST',
          port: 3334,
          path: `/count/${centre[0]}/${centre[1]}/${radius}`,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        }, (response) => {
          response.setEncoding('utf8');
          let rawData = '';
          response.on('data', (chunk) => { rawData += chunk; });
          response.on('end', () => {
            const count = JSON.parse(rawData);
            console.log(count);            
            span.end();
            resolve(count);
          });
        });
        circleReq.write(postData);
        circleReq.end();
      });
  });
}

function getNumbers(min,max,count) {
  return new Promise((resolve,reject) => {
    tracer.startActiveSpan(
      `Requesting random numbers`,
      { attributes: { min,max,count } },
      (span) => {
        http.get({
          host: 'localhost',
          port: 3333,
          path: `/numbers/${min}/${max}/${count}`,
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




