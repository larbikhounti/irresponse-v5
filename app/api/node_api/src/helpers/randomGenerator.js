const crypto = require('crypto');
// Function to generate a random string of specified length
const generateRandomString = (length, options) => {
    const chars = options.charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Function to generate unique random tags
const generateUniqueRandomTag = (length, options) => {
    const generatedTags = new Set(); // unique 
    let tag;
    do {
        tag = generateRandomString(length, options);
    } while (generatedTags.has(tag));
    generatedTags.add(tag);
    return tag;
};

// Function to generate random tags
const generateRandomTag = (length, options) => {
    return generateRandomString(length, options);
};

// Define functions for unique random tags
const uniqueRandomTagFunctions = {
    ua: (length) => generateUniqueRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' }),
    ual: (length) => generateUniqueRandomTag(length, { charset: 'abcdefghijklmnopqrstuvwxyz' }),
    uau: (length) => generateUniqueRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }),
    uan: (length) => generateUniqueRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' }),
    uanl: (length) => generateUniqueRandomTag(length, { charset: 'abcdefghijklmnopqrstuvwxyz0123456789' }),
    uanu: (length) => generateUniqueRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }),
    un: (length) => generateUniqueRandomTag(length, { charset: '0123456789' }),
    uhu: (length) => generateUniqueRandomTag(length, { charset: '0123456789ABCDEF' }),
    uhl: (length) => generateUniqueRandomTag(length, { charset: '0123456789abcdef' })
};

// Define functions for random tags
const randomTagFunctions = {
    a: (length) => generateRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' }),
    al: (length) => generateRandomTag(length, { charset: 'abcdefghijklmnopqrstuvwxyz' }),
    au: (length) => generateRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }),
    an: (length) => generateRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' }),
    anl: (length) => generateRandomTag(length, { charset: 'abcdefghijklmnopqrstuvwxyz0123456789' }),
    anu: (length) => generateRandomTag(length, { charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' }),
    n: (length) => generateRandomTag(length, { charset: '0123456789' }),
    hu: (length) => generateRandomTag(length, { charset: '0123456789ABCDEF' }),
    hl: (length) => generateRandomTag(length, { charset: '0123456789abcdef' })
};

module.exports = {
    uniqueRandomTagFunctions,
    randomTagFunctions
}





