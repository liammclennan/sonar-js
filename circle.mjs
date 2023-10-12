import { getTracer } from './tracer.js';
import express from 'express';
import http from 'http';

const { tracer,log } = getTracer('Circle');

const app = express();
app.use(express.json());
const port = 3334;

app.post('/count/:centreX/:centreY/:radius', ({body, params: {centreX, centreY, radius}}, res) => {
    const points = body;
    tracer.startActiveSpan('Counting {count} points within cirle of radius {radius}', {
        kind: 2, // server
        attributes: {centre: [centreX, centreY], radius, count: points.length },
    }, (span) => {
        res.send({numberOfPointsWithinCircle: 58});
        span.end();
    });
});

app.listen(port, () => {
    log('Circle started on {port}', { port });
})

export function countPointsWithinCircle(centre, radius, points) {

}