

let addToSequenceFactory = (sequences, output) => (name, char) => {
    if (!sequences[name]) sequences[name] = [];
    sequences[name].push(char)        
}

let flushSequenceFactory = sequences => name => {
    let seq = sequences[name];    
    if (seq && seq.length > 0) {
        sequences[name] = [];
        return seq.join("");
    } else {
        return null;
    }    
}

let flushSequenceAsFactory = (sequences, output) => (name, type) => {        
    let seq = sequences[name];
    if (seq && seq.length > 0) {
        output.push({
            type: type,
            value: seq.join('')
        })
        sequences[name] = [];
    }
}

let insertTokenFactory = target => token => {
    if (!token || typeof token.type !== 'string' || token.type.length === 0) {
        throw new Error("Wrong token given:", token)
    }
    target.push(token)
}

let getSequenceLengthFactory = sequences => name => sequences[name] ? sequences[name].length : 0;


let tokenize = (input, rules) => {

    if (typeof input !== 'string') {
        throw new Error("tokenizer2000: string expected as first argument");
    }

    if (typeof rules !== 'object') {
        throw new Error("tokenizer2000: specify ruleset as an object");
    }

    if (rules.preprocess) {
        input = rules.preprocess(input);
    }

    let output = [];
    let sequences = {};

    let addToSequence = addToSequenceFactory(sequences, output);
    let flushSequence = flushSequenceFactory(sequences);
    let flushSequenceAs = flushSequenceAsFactory(sequences, output);
    let insertToken = insertTokenFactory(output);
    let getSequenceLength = getSequenceLengthFactory(sequences);
    

    for (let i = 0, n = input.length; i < n; i++) {

        let char = input[i];
        let rule = rules.chars.find(rule => rule.test(char));

        if (!rule) {
            throw new Error(`Wrong char: ` + char + " " + char.charCodeAt(0))
        }

        rule.execute({
            char,
            output,
            sequences,
            addToSequence,
            flushSequenceAs,
            flushSequence,
            insertToken,
            getSequenceLength
        })
        
    }

    if (rules.postprocess) {
        rules.postprocess({
            addToSequence,
            flushSequenceAs,
            flushSequence,
            insertToken,
            getSequenceLength,
            output,
            sequences
        });
    }    

    return output;
}


// USAGE EXAMPLE

// let rules = require("./ruleset").rules;
// console.log(tokenize(`sin(x) + 3 * func(3,5)`, rules));

module.exports = tokenize;