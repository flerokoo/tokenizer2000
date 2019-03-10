

let tokenTypes = {
    LITERAL: "literal",
    VARIABLE: "variable",
    OPERATOR: "operator",
    LEFT_PAREN: "left-parenthesis",
    RIGHT_PAREN: "right-parenthesis",
    ARG_SEPARATOR: "argument-separator",
    END_OF_EXPR: "end-of-expression",
    FUNCTION: "function"
}

let sequenceTypes = {
    NUMBERS: "numbers",
    LETTERS: "letters",
    OPERATORS: "operators"
}

let rules = {
    chars: [
        {
            test: char => /\d/.test(char) || char === '.',
            execute: ({ char, addToSequence, flushSequenceAs }) => {
                flushSequenceAs(sequenceTypes.OPERATORS, tokenTypes.OPERATOR)
                addToSequence(sequenceTypes.NUMBERS, char);
            }
        },
        {
            test: char => /[a-z]+/i.test(char),
            execute: ({ char, addToSequence, flushSequenceAs }) => {
                flushSequenceAs(sequenceTypes.OPERATORS, tokenTypes.OPERATOR)
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                addToSequence(sequenceTypes.LETTERS, char);
            }
        },
        {
            test: char => /[\/\*\-\+\=]+/.test(char),
            execute: ({ char, addToSequence, flushSequenceAs }) => {
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.VARIABLE)
                addToSequence(sequenceTypes.OPERATORS, char);
            }
        },
        {
            test: char => char === '(',
            execute: ({ char, addToSequence, flushSequenceAs, insertToken }) => {
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.FUNCTION)
                insertToken({
                    type: tokenTypes.LEFT_PAREN,
                    value: char
                })
            }
        },
        {
            test: char => char === ')',
            execute: ({ char, addToSequence, flushSequenceAs, insertToken }) => {
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.VARIABLE)
                insertToken({
                    type: tokenTypes.RIGHT_PAREN,
                    value: char
                })
            }
        },
        {
            test: char => char === ',',
            execute: ({ char, addToSequence, flushSequenceAs, insertToken }) => {
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.VARIABLE)
                insertToken({
                    type: tokenTypes.ARG_SEPARATOR,
                    value: char
                })
            }
        },
        {
            test: char => /[;\n]+/.test(char),
            execute: ({ char, addToSequence, flushSequenceAs, insertToken }) => {
                flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL)
                flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.VARIABLE)
                insertToken({
                    type: tokenTypes.END_OF_EXPR,
                    value: char
                })
            }
        },
    ],

    after: ({ flushSequenceAs, output }) => {
        flushSequenceAs(sequenceTypes.OPERATORS, tokenTypes.OPERATOR);
        flushSequenceAs(sequenceTypes.NUMBERS, tokenTypes.LITERAL);
        flushSequenceAs(sequenceTypes.LETTERS, tokenTypes.VARIABLE);

        while (output.length > 0 && output[0].type === tokenTypes.END_OF_EXPR) {
            output.shift();
        }
    }
}

module.exports = { rules, tokenTypes, sequenceTypes }