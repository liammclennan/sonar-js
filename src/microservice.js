'use strict';

const { tracer } = require('./tracer.js').getTracer('Example microservice tracing');
const http = require('http');

const servers = {
  randomNumbers: {
    host: 'localhost',
    port: 3333,
  },
  circle: {
    host: 'localhost',
    port: 3334,
  },
  percentage: {
    host: 'localhost',
    port: 3335,
  }
};

setTimeout(run, 1000);

//                                           ┌───────────────────────┐
//                                           │                       │
//                     ┌────────────────────►│   circle              │
//                     │                     │                       │
//                     │                     │                       │
//                     │                     │                       │
// ┌───────────────────┴───┐                 └───────────────────────┘
// │                       │                   ▲
// │  microservice         ├───────────────────┘
// │                       │
// │                       │                    ┌─────────────────────┐
// └─────────────┬───┬─────┤                    │                     │
//               │   │     │                    │                     │
//               │   │     └───────────────────►│   percentage        │
//               │   │                          │                     │
//               │   │                          │                     │
//               │   │                          └─────────────────────┘
//               │   │
//         ┌─────▼───▼──────────────┐
//         │                        │
//         │   random numbers       │
//         │                        │
//         │                        │
//         │                        │
//         │                        │
//         └────────────────────────┘
async function run() {
  tracer.startActiveSpan('Radomizing points to calculate PI as {estimate}', async (s) => {
    let {min,max,count,radius} = { min: 0, max: 10000, count: 1000000, radius: 400};
  
    const [xs,ys] = [await getNumbers(min, max, count), await getNumbers(min, max, count)];
    const pointsInCircle = await countPointsInCircle(xs, ys, [max / 2, max / 2], radius);
    const percentage = await calculatePercentage(pointsInCircle, count);
    const area = (max * max) * (percentage/100);
    const PIestimate = await calculatePI(area, radius);
    s.setAttribute('estimate', PIestimate);
    s.end();
  });
}

function calculatePI(area, radius) {
  return new Promise((resolve,reject) => {
    http.get({
      ...servers.circle,
      path: `/pi/${area}/${radius}`,
    }, (response) => {
      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        const {PI} = JSON.parse(rawData);
        resolve(PI);
      });
    });
  });
}

function calculatePercentage(pointsInCircle, totalPoints) {
  return new Promise((resolve,reject) => {
    http.get({
      ...servers.percentage,
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
    const postData = JSON.stringify({xs,ys});
    const circleReq = http.request({
      ...servers.circle,
      method: 'POST',
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
        resolve(count.numberOfPointsWithinCircle);
      });
    });
    circleReq.write(postData);
    circleReq.end();
  });
}

function getNumbers(min,max,count) {
  return new Promise((resolve,reject) => {
    http.get({
      ...servers.randomNumbers,
      path: `/numbers/${min}/${max}/${count}`,
    }, (response) => {
      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        const numbers = JSON.parse(rawData);
        resolve(numbers);
      });
    });
  });
}




