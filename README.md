# TOKENIZER 2000

Tiny simple lexical analyser with a customizable set of rules.

## Why?

Just trying to put all the pieces of knowledge on how programming languages work together.

## Usage:

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