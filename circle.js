const {tracer,makeSpan,log} = require('./tracer').getTracer('Circle');
const api = require('@opentelemetry/api');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3334;

app.post('/count/:centreX/:centreY/:radius', ({body, params: {centreX, centreY, radius}}, res) => {
    const points = body;
    centreX = parseInt(centreX);
    centreY = parseInt(centreY);
    radius = parseInt(radius);
    tracer.startActiveSpan('Counting {count} points within cirle of radius {radius}', {
        kind: 2, // server
        attributes: {centre: [centreX, centreY], radius, count: points.xs.length },
    }, (span) => {
        res.send({numberOfPointsWithinCircle: countPointsWithinCircle([centreX, centreY], radius, points)});
        span.end();
    });
});

app.listen(port, () => {
    log('Circle started on {port}', { port });
})

function countPointsWithinCircle(centre, radius, points) {
    let c = 0;
    for (let i = 0; i < points.xs.length; i++) {
        const point  = [points.xs[i], points.ys[i]];
        if (isWithinCircle(centre, radius, point)) {
            c += 1;
        }
    }
    return c;
}

function isWithinCircle(centre, radius, point) {
    return distance(centre,point) < radius;
}

function distance([x1,y1], [x2,y2]) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}