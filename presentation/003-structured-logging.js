const winston = require('winston');
const { SeqTransport } = require('@datalust/winston-seq');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(  
    winston.format.json(),
  ),
  transports: [
    new SeqTransport({
      serverUrl: "http://localhost",
      onError: (e => { console.error(e) }),
      handleExceptions: true,
      handleRejections: true,
    })
  ]
});

logger.info("Customer {customer} order a {product}", {
    customer: "John",
    product: "Lactose free mocha",
});

logger.info("Customer {customer} order a {product}", {
    customer: "Paul",
    product: "Dopio",
});

logger.info("Customer {customer} order a {product}", {
    customer: "George",
    product: "Long black",
});

logger.info("Customer {customer} order a {product}", {
    customer: "Ringo",
    product: "Chai tea",
});