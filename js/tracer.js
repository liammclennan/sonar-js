'use strict';

const opentelemetry = require('@opentelemetry/api');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const EXPORTER = process.env.EXPORTER || '';
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto');
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:5000/ingest/otlp/v1/traces',
});

module.exports.getTracer = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });
  
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  
  // Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
  provider.register();
  
  registerInstrumentations({
    // // when boostraping with lerna for testing purposes
    instrumentations: [
      new HttpInstrumentation(),
    ],
  });
  
  const tracer = opentelemetry.trace.getTracer('http-example'); 
  return { 
    tracer,
    log: function log(message, attributes = {}) {
      console.log(message);
      const span = tracer.startSpan(message, { attributes });
      span.end();
    }
  };
};
