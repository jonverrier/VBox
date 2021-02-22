'use strict';

import pkg from './dist/cmn-bundle.js';

var EntryPoints = pkg.default;

var loggerFactory = new EntryPoints.LoggerFactory();
var logger = loggerFactory.logger(EntryPoints.LoggerType.Server);

logger.logInfo ('main', 'main', 'Hello info', null);
logger.logError ('main', 'main', 'Hello error', null);

logger = loggerFactory.logger(EntryPoints.LoggerType.Client);
logger.logInfo ('main', 'main', 'Hello info', null);
logger.logError ('main', 'main', 'Hello error', null);

var person = new EntryPoints.Person ("1", "2", "3", "4", "5", "6");

logger.logInfo ('main', 'main', 'Hello info', person);