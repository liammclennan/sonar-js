/**
 * 
 *  Structured logging
 * 
 */

const winston = require('winston');
const { SeqTransport } = require('@datalust/winston-seq');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(  
    winston.format.json(),
  ),
  transports: [
    new SeqTransport({
      serverUrl: "http://localhost:5000",
      onError: (e => { console.error(e) }),
      handleExceptions: true,
      handleRejections: true,
    })
  ]
});

logger.info("Customer {customer} order a {product}", {
    customer: "John",
    product: "Lactose free mocha",
    priceCents: 570, 
});

logger.info("Customer {customer} order a {product}", {
    customer: "Paul",
    product: "Dopio",
    priceCents: 360,
});

logger.info("Customer {customer} order a {product}", {
    customer: "George",
    product: "Long black",
    priceCents: 510,
});

logger.info("Customer {customer} order a {product}", {
    customer: "Ringo",
    product: "Chai tea",
    priceCents: 550,
});

// message interpolation
// searching
// aggregating / analysis

