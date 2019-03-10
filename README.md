# TOKENIZER 2000

Tiny simple lexical analyzer with a customizable set of rules.

## Why?

Just trying to put all the pieces of knowledge on how programming languages work together.

## Usage

```js

let tokenize = require("tokenizer2000");

// load example set of rules for tokenizing math expressions
let rules = require("tokenizer2000/src/ruleset").rules;

let expr = `12 + 5*x*sin(x) + power(2, 5)`;

let result = tokenize(expr, rules);


result.forEach(token => console.log(token.type, token.value))

```

Meanwhile in console: 

```
literal 12
operator +
literal 5
operator *
variable x
operator *
function sin
left-parenthesis (
variable x
right-parenthesis )
operator +
function power
left-parenthesis (
literal 2
argument-separator ,
literal 5
right-parenthesis )
```


## Custom rules

Custom rules definition is easy: just take a look at `src/ruleset.js`.

Basically, each rule is object with two properties:

* `test` — receives current character in expression and return `true` if this rule applies to it.
* `execute` — receives an object and does everything, that needs to be done (again, example's at `src/ruleset.js`)
```js
{
    // current char
    char, 
    // array of already parsed tokens
    // in the form of { type, value }
    output, 
    // function that adds characters to named buffers
    // example: addToSequence("numbers", char)
    addToSequence, 
    // function that joins and adds named buffer to an output array as specified token type
    // example: flushSequence("numbers", "literal")
    flushSequenceAs,
    // function that inserts token
    // example: insertToken({ type: "token_type", value: char })
    insertToken 
}
```

And ruleset, that should be provided as a second argument to tokenizer is object of form: 

```js
{
    // array of rules, that are used in character parsing   
    chars,     
    // function that is called when done parsing characters
    // can be used to flush non-empty sequences and other output postprocessing
    // receives {addToSequence, flushSequenceAs, insertToken, output}
    after 
}
```
