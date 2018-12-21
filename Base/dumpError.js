
const logger = require('../Base/logger');
async function dumpError(err, stack) {
 // logger.log('In Dump Log, whole Error --> ' +err);
 //logger.error('\n******************************');
    if (typeof err === 'object') {
      if (err.message) {
        await logger.error('\nMessage: ' + err.message)
      }
      if (err.stack && stack == 'stack') {
        await logger.error('\nStacktrace:')
        await logger.error('====================')
        await logger.error(err.stack);
      }
    } else {
      await logger.error('\n dumpError :: argument is not an object');
    }
  //logger.error('******************************');
  }

  
module.exports = dumpError;