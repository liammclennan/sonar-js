const {tracer,makeSpan,log} = require('./tracer').getTracer('random number service');
const api = require('@opentelemetry/api');
const express = require('express');
const app = express();
const port = 3333;

app.get('/numbers/:min/:max/:count', ({headers,params: {min,max,count}}, res) => {
    console.log(headers);
    min = parseInt(min);
    max = parseInt(max);
    count = parseInt(count);
    tracer.startActiveSpan('Generating {count} random numbers between {min} and {max}', {
        attributes: {min,max,count},
    }, (span) => {
        res.send(
            Array.from({length: count}, () => 
                Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)
            )
        );
        span.end();
    });
    
});

app.listen(port, () => {
    log('Random number generator started on {port}', { port });
})


