/**
 * 
 *  Console logging
 * 
 */

console.log('A message');

console.dir({ content: 'An object'});

console.time("Timer A");

console.assert(false, "Assertion message");

(function ThisIsANamedFunction() {
    console.trace();
    console.timeEnd("Timer A");
})();