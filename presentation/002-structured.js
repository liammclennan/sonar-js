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
    priceCents: 570, 
});

logger.info("Customer order a product", {
    customer: "Paul",
    product: "Dopio",
    priceCents: 360,
});

logger.info("Customer order a product", {
    customer: "George",
    product: "Long black",
    priceCents: 510,
});

logger.info("Customer order a product", {
    customer: "Ringo",
    product: "Chai tea",
    priceCents: 550,
});

// node 002-structured.js | lib/jq 'select(.priceCents > 520)' 

