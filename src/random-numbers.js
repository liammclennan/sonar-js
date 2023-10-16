const api = require('@opentelemetry/api');
const {tracer,makeSpan,log} = require('./tracer').getTracer('pi estimator');
const express = require('express');
const app = express();
const port = 3333;

app.get('/numbers/:min/:max/:count', ({headers,params: {min,max,count}}, res) => {
    console.log(headers);
    makeSpan('Generating {count} random numbers between {min} and {max}', () => {
        res.send(
            Array.from({length: count}, () => 
                Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)
            )
        );
        return Promise.resolve();
    }, { count, min, max });
});

app.listen(port, () => {
    log('Random number generator started on {port}', { port });
})


