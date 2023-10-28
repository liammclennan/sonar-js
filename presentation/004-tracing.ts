/**
 * 
 *  Tracing
 * 
 */

// log events with timing and hierarchy
// manual or automatic

type Log = {
    Timestamp,
    TraceId,
    Message,
    Attributes,
}

type Span = {
    Timestamp,
    TraceId,
    Message,
    Attributes,
    Start,
    SpanId,
    ParentId,
}

// Duration = Timestamp - Start

// Trace is entirely conceptual

// everything you need to know about Open Telemetry








// Example

tracer.startActiveSpan('The name of the star was {nameOfStar}', (span) => {
    
    // Your code goes here
    // ...

    // maybe write a log (which is attached to the span)
    // NOTE: not yet implemented in opentelemetry-js
    tracer.info(`And I saw the {numberOfAngels} angels who stand before God, 
        and seven {instrument}s were given to them`, {
        numberOfAngels: 7,
        instrument: 'trumpet'
    })

    // attach any structured data to the span
    span.setAttribute('nameOfStar', 'wormwood');

    span.end();
});

// see 004a-trace.png

