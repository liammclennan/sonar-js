/**
 * 
 *  Structured data
 * 
 */

const winston = require('winston');
const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

logger.info("Customer order a product", {
    customer: "John",
    product: "Lactose free mocha",
});

logger.info("Customer order a product", {
    customer: "Paul",
    product: "Dopio",
});

logger.info("Customer order a product", {
    customer: "George",
    product: "Long black",
});

logger.info("Customer order a product", {
    customer: "Ringo",
    product: "Chai tea",
});

// node 002-structured.js | lib/jq 'select(.customer | contains("J"))'

