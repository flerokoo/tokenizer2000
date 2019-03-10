

let addToSequenceFactory = (sequences, output) => (name, char) => {
    if (!sequences[name]) sequences[name] = [];
    sequences[name].push(char)        
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


let tokenize = (input, rules) => {

    if (typeof input !== 'string') {
        throw new Error("tokenizer2000: string expected as first argument");
    }

    if (typeof rules !== 'object') {
        throw new Error("tokenizer2000: specify ruleset as an object");
    }

    input = input.replace(/[ ]+/gm, "");    

    let output = [];
    let sequences = {};

    let addToSequence = addToSequenceFactory(sequences, output);
    let flushSequenceAs = flushSequenceAsFactory(sequences, output);
    let insertToken = insertTokenFactory(output);

    for (let i = 0, n = input.length; i < n; i++) {

        let char = input[i];
        let rule = rules.chars.find(rule => rule.test(char));

        if (!rule) {
            throw new Error(`Wrong char: ` + char + " " + char.charCodeAt(0))
        }

        rule.execute({
            char,
            output,
            addToSequence,
            flushSequenceAs,
            insertToken
        })
        
    }

    if (rules.after) {
        rules.after({
            addToSequence,
            flushSequenceAs,
            insertToken,
            output
        });
    }    

    return output;
}

module.exports = tokenize;