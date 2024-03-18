
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const {processHandler} = require('./src/dropshandler')
const {mailHandler} = require('./src/mailHandler')
const {decodeData} = require('./src/helpers/utils')
const argv = yargs(hideBin(process.argv)).parse()

//decode the data
let data = decodeData(argv.data)


switch (data.action) {
    case 'executeProcessAction':
        // Since handleProcess returns a promise, you should handle it using async/await or .then()
        processHandler(data)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        break;
    case 'proceedTest':
       mailHandler(data)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        break;
    default:
        break;
}