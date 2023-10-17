const {tracer} = require('./tracer').getTracer('Percentage');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3335;

app.get('/calculate/:numerator/:denominator', ({ params: {numerator, denominator}}, res) => {
    numerator = parseInt(numerator);
    denominator = parseInt(denominator);
    tracer.startActiveSpan('Calculating percentage of {numerator} out of {denominator} is {result}', {
        attributes: { numerator, denominator },
    }, (span) => {
        const percentage = numerator * 100 / denominator;
        span.setAttribute('result', percentage);
        res.send({ percentage });
        span.end();
    });
});

app.listen(port, () => {
})
