"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const initLogger = () => {
  const logDir = 'logs';
  const tsFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
  const myFormat = winston.format.printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  });
  const console = new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.prettyPrint(), winston.format.timestamp({
      format: tsFormat,
    }), myFormat),
  });
  const files = new DailyRotateFile({
    filename: `${logDir}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: false,
    maxSize: 5242880,
    format: winston.format.combine(winston.format.prettyPrint(), winston.format.timestamp({
      format: tsFormat,
    }), myFormat),
  });
  winston.configure({
    transports: [files, console],
    exceptionHandlers: [console],
  });
  return winston;
};
exports.initLogger = initLogger;
exports.default = winston;
