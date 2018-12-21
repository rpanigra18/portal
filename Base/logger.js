const {createLogger, format, transports} = require('winston');
// const { combine, timestamp, label, colorize, printf, splat } = format;
const LEVEL = Symbol.for('level');
const colorizeFormat = format.colorize({ colors: { info: 'blue' }});
const level = process.env.NODE_LOGGING_LEVEL || "info"; 

module.exports = createLogger({
    format: format.combine(
            format.simple(), 
        //    format.combine(format.colorize({colors: { silly: 'green' }}),
            format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.printf(info=>`[${info.timestamp}] ${info.level} : ${info.message}`)),
    transports: [
        new transports.File({
           // level: process.env.LOG_LEVEL,
            level,
            maxsize: 512000,
            maxFiles: 5,
            colors: 'red',
            filename: `${__dirname}/logs/portal.log`
        }),
        new transports.Console({
            level: 'error',

         //   level,
           
        })
    ]
})