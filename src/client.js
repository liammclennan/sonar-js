'use strict';

const { tracer } = require('./tracer.js').getTracer('PI');
const http = require('http');

run().then(()=>{});

async function run() {
  tracer.startActiveSpan('Estimating PI', async (s) => {
    let {min,max,count} = { min: 0, max: 1000, count: 500};
  
    const xs = await getNumbers(min, max, count);
    const ys = await getNumbers(min, max, count);
    const pointsInCircle = await countPointsInCircle(xs, ys, [max / 2, max / 2], 400);
    const percentage = await calculatePercentage(pointsInCircle, count);
    s.end();
  });
}

function calculatePercentage(pointsInCircle, totalPoints) {
  return new Promise((resolve,reject) => {
    http.get({
      host: 'localhost',
      port: 3335,
      path: `/calculate/${pointsInCircle}/${totalPoints}`,
    }, (response) => {
      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        const {percentage} = JSON.parse(rawData);
        resolve(percentage);
      });
    });
  });
}

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
            resolve(count.numberOfPointsWithinCircle);
          });
        });
        circleReq.write(postData);
        circleReq.end();
      });
  });
}

function getNumbers(min,max,count) {
  return new Promise((resolve,reject) => {
    // tracer.startActiveSpan(
    //   `Requesting random numbers`,
    //   { attributes: { min,max,count } },
    //   (span) => {
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
            //log("Received {Count} random numbers", {Count: numbers.length});
            //span.end();
            resolve(numbers);
          });
        });
      });
  // });
}




