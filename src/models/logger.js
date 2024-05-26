const winston = require('winston');

// Define log configuration
const logConfiguration = {
    transports: [
        new winston.transports.Console({
            level: 'debug', // Log level for console transport
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            )
        }),
        new winston.transports.File({
            level: 'info', // Log level for file transport
            filename: 'logs/app.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

module.exports = logger;