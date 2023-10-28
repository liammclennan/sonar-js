const {tracer} = require('./tracer').getTracer('Circle');
const express = require('express');
const app = express();
app.use(express.json({limit: '50mb'}));
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

app.get('/pi/:area/:radius', ({params: {area,radius}}, res) => {
    tracer.startActiveSpan('Estimated PI {PI} from a circle with area {area} and radius {radius}', {}, (span) => {
        area = parseFloat(area);
        radius = parseInt(radius);
        span.setAttribute('area', area);
        span.setAttribute('radius', radius);

        const PI = area / (radius * radius);
        span.setAttribute('PI', PI);
        res.send({PI});
        span.end();
    });
});

app.listen(port, () => {
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