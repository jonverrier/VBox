/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/loglevel/lib/loglevel.js":
/*!***********************************************!*\
  !*** ./node_modules/loglevel/lib/loglevel.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (true) {
        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;

      var storageKey = "loglevel";
      if (typeof name === "string") {
        storageKey += ":" + name;
      } else if (typeof name === "symbol") {
        storageKey = undefined;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType || !storageKey) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType || !storageKey) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if ((typeof name !== "symbol" && typeof name !== "string") || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    // ES6 default export, for compatibility
    defaultLogger['default'] = defaultLogger;

    return defaultLogger;
}));


/***/ }),

/***/ "./dev/Call.tsx":
/*!**********************!*\
  !*** ./dev/Call.tsx ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallKeepAlive = exports.CallLeaderResolve = exports.CallIceCandidate = exports.CallAnswer = exports.CallOffer = exports.CallParticipation = void 0;
//==============================//
// CallParticipation class
//==============================//
class CallParticipation {
    /**
     * Create a CallParticipation object
     * @param _id - Mongo-DB assigned ID
     * @param facilityId - ID for the facility hosting the call
     * @param personId - iD for the call participant
     * @param isCandidateLeader - true of the person is a possible call leader
     * @param sessionId - iD for the call session (in case same person joins > once)
     * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
     * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this
     *    - same CallParticipation should keep the same glareResolve throughout its lifetime
     */
    constructor(_id = null, facilityId, personId, isCandidateLeader, sessionId, sessionSubId, glareResolve = Math.random()) {
        this._id = _id;
        this._facilityId = facilityId;
        this._personId = personId;
        this._isCandidateLeader = isCandidateLeader;
        this._sessionId = sessionId;
        this._sessionSubId = sessionSubId;
        if (glareResolve)
            this._glareResolve = glareResolve;
        else
            this._glareResolve = Math.random();
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get facilityId() {
        return this._facilityId;
    }
    get personId() {
        return this._personId;
    }
    get isCandidateLeader() {
        return this._isCandidateLeader;
    }
    get sessionId() {
        return this._sessionId;
    }
    get sessionSubId() {
        return this._sessionSubId;
    }
    get glareResolve() {
        return this._glareResolve;
    }
    get type() {
        return CallParticipation.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._facilityId === rhs._facilityId) &&
            (this._personId === rhs._personId) &&
            (this._isCandidateLeader === rhs._isCandidateLeader) &&
            (this._sessionId === rhs._sessionId) &&
            (this._sessionSubId === rhs._sessionSubId) &&
            (this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10)));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallParticipation.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _facilityId: this._facilityId,
                _personId: this._personId,
                _isCandidateLeader: this._isCandidateLeader,
                _sessionId: this._sessionId,
                _sessionSubId: this._sessionSubId,
                _glareResolve: this._glareResolve
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallParticipation.reviveDb(data.attributes);
        return CallParticipation.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallParticipation(data._id, data._facilityId, data._personId, data._isCandidateLeader, data._sessionId, data._sessionSubId, data._glareResolve);
    }
    ;
}
exports.CallParticipation = CallParticipation;
CallParticipation.__type = "CallParticipation";
//==============================//
// CallOffer class
//==============================//
class CallOffer {
    /**
     * Create a CallOffer object
     * @param _id - Mongo-DB assigned ID
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param offer - the WebRTC Offer
     */
    constructor(_id = null, from, to, offer) {
        this._id = _id;
        this._from = from;
        this._to = to;
        this._offer = offer;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get offer() {
        return this._offer;
    }
    get type() {
        return CallOffer.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._offer === rhs._offer));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallOffer.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _from: this._from,
                _to: this._to,
                _offer: this._offer
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallOffer.reviveDb(data.attributes);
        return CallOffer.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallOffer(data._id, CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._offer);
    }
    ;
}
exports.CallOffer = CallOffer;
CallOffer.__type = "CallOffer";
//==============================//
// CallAnswer class
//==============================//
class CallAnswer {
    /**
     * Create a CallOffer object
     * @param _id - Mongo-DB assigned ID
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param answer - the WebRTC Offer
     */
    constructor(_id = null, from, to, answer) {
        this._id = _id;
        this._from = from;
        this._to = to;
        this._answer = answer;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get answer() {
        return this._answer;
    }
    get type() {
        return CallAnswer.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._answer === rhs._answer));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallAnswer.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _from: this._from,
                _to: this._to,
                _answer: this._answer
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallAnswer.reviveDb(data.attributes);
        return CallAnswer.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallAnswer(data._id, CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._answer);
    }
    ;
}
exports.CallAnswer = CallAnswer;
CallAnswer.__type = "CallAnswer";
//==============================//
// CallIceCandidate class
//==============================//
class CallIceCandidate {
    /**
     * Create a CallIceCandidate object
     * @param _id - Mongo-DB assigned ID
     * @param from - CallParticipation
     * @param to - CallParticipation
     * @param ice - the WebRTC ice, may be null
     * @param outbound - TRUE if this is from an outbound (Offer) connection
     */
    constructor(_id = null, from, to, ice, outbound) {
        this._id = _id;
        this._from = from;
        this._to = to;
        this._ice = ice;
        this._outbound = outbound;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get from() {
        return this._from;
    }
    get to() {
        return this._to;
    }
    get ice() {
        return this._ice;
    }
    get outbound() {
        return this._outbound;
    }
    get type() {
        return CallIceCandidate.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._from.equals(rhs._from)) &&
            (this._to.equals(rhs._to)) &&
            (this._ice === rhs._ice) &&
            (this._outbound === rhs._outbound));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallIceCandidate.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _from: this._from,
                _to: this._to,
                _ice: this._ice,
                _outbound: this._outbound
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallIceCandidate.reviveDb(data.attributes);
        return CallIceCandidate.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallIceCandidate(data._id, CallParticipation.revive(data._from), CallParticipation.revive(data._to), data._ice, data._outbound);
    }
    ;
}
exports.CallIceCandidate = CallIceCandidate;
CallIceCandidate.__type = "CallIceCandidate";
//==============================//
// CallLeaderResolve class - used to resolve who is the call leader. 
// Send random numbers to each other, highest wins. 
//==============================//
class CallLeaderResolve {
    /**
     * Create a CallLeaderResolve object
     * @param glareDate - if provided, date the call leader logged in. By design, don't reset this
     *    - same CallParticipation should keep the same glareDate throughout its lifetime
     * @param glareResolve - if provided, a number to use for the glareResolution test. By design, don't reset this
     *    - same CallParticipation should keep the same glareResolve throughout its lifetime
     */
    constructor(_id = null, glareDate = new Date(), glareResolve = Math.random()) {
        this._id = _id;
        this._glareDate = glareDate;
        this._glareResolve = glareResolve;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get type() {
        return CallLeaderResolve.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            this._glareDate.getTime() === rhs._glareDate.getTime() &&
            this._glareResolve.toPrecision(10) === rhs._glareResolve.toPrecision(10));
    }
    ;
    /**
     * test to see if this object wins the resolution
     * @param rhs - the object to compare this one to.
     */
    isWinnerVs(rhs) {
        // Use the date first - this means first person logged in is usually the winner
        // else use the random value to do a lottery, lowest wins so directionality is the same
        return ((this._glareDate.getTime() < rhs._glareDate.getTime()) ||
            ((this._glareDate.getTime() === rhs._glareDate.getTime()) && (this._glareResolve < rhs._glareResolve)));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallLeaderResolve.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _glareDate: this._glareDate,
                _glareResolve: this._glareResolve
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallLeaderResolve.reviveDb(data.attributes);
        return CallLeaderResolve.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallLeaderResolve(data._id, new Date(data._glareDate), Number(data._glareResolve));
    }
    ;
}
exports.CallLeaderResolve = CallLeaderResolve;
CallLeaderResolve.__type = "CallLeaderResolve";
//==============================//
// CallKeepAlive class
//==============================//
class CallKeepAlive {
    /**
     * Create a CallKeepAlive object
     */
    constructor(_id) {
        this._id = _id;
    }
    get type() {
        return CallKeepAlive.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: CallKeepAlive.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return CallKeepAlive.reviveDb(data.attributes);
        return CallKeepAlive.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new CallKeepAlive(data._id);
    }
    ;
}
exports.CallKeepAlive = CallKeepAlive;
CallKeepAlive.__type = "CallKeepAlive";


/***/ }),

/***/ "./dev/Dates.tsx":
/*!***********************!*\
  !*** ./dev/Dates.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateWithDays = void 0;
class DateWithDays {
    constructor(...args) {
        if (args.length === 0) {
            this.date = new Date();
        }
        else if (args.length === 1) {
            this.date = new Date(args[0]);
        }
        else {
            this.date = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
    }
    /**
     * Function returns the day of the week in a text format.
     */
    getWeekDay() {
        //Create an array containing each day, starting with Sunday.
        var weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        //Use the getDay() method to get the day.
        var day = this.date.getDay();
        // Return the element that corresponds to that index.
        return weekdays[day];
    }
    ;
}
exports.DateWithDays = DateWithDays;


/***/ }),

/***/ "./dev/Equals.tsx":
/*!************************!*\
  !*** ./dev/Equals.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEqual = void 0;
function isEqual(value, other) {
    // Get the value type
    var type = Object.prototype.toString.call(value);
    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other))
        return false;
    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0)
        return false;
    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen)
        return false;
    // Compare two items
    var compare = function (item1, item2) {
        // Get the object type
        var itemType = Object.prototype.toString.call(item1);
        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2))
                return false;
        }
        // Otherwise, do a simple comparison
        else {
            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2))
                return false;
            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString())
                    return false;
            }
            else {
                if (item1 !== item2)
                    return false;
            }
        }
    };
    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false)
                return false;
        }
    }
    else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false)
                    return false;
            }
        }
    }
    // If nothing failed, return true
    return true;
}
exports.isEqual = isEqual;
;


/***/ }),

/***/ "./dev/Facility.tsx":
/*!**************************!*\
  !*** ./dev/Facility.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Facility = void 0;
class Facility {
    /**
     * Create a Person object
     * @param _id - Mongo-DB assigned ID
     * @param externalId - ID assigned by external system (like facebook)
     * @param name - plain text user name
     * @param thumbnailUrl - URL to thumbnail image
     * @param lastAuthCode - provided by underlying identity system when user logs in
     */
    constructor(_id, externalId, name, thumbnailUrl, homepageUrl) {
        this._id = _id;
        this._externalId = externalId;
        this._name = name;
        this._thumbnailUrl = thumbnailUrl;
        this._homepageUrl = homepageUrl;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get externalId() {
        return this._externalId;
    }
    get name() {
        return this._name;
    }
    get thumbnailUrl() {
        return this._thumbnailUrl;
    }
    get homepageUrl() {
        return this._homepageUrl;
    }
    get type() {
        return Facility.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._externalId === rhs._externalId) &&
            (this._name === rhs._name) &&
            (this._thumbnailUrl === rhs._thumbnailUrl) &&
            (this._homepageUrl === rhs._homepageUrl));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: Facility.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _externalId: this._externalId,
                _name: this._name,
                _thumbnailUrl: this._thumbnailUrl,
                _homepageUrl: this._homepageUrl
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return Facility.reviveDb(data.attributes);
        else
            return Facility.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new Facility(data._id, data._externalId, data._name, data._thumbnailUrl, data._homepageUrl);
    }
    ;
}
exports.Facility = Facility;
Facility.__type = "Facility";
;


/***/ }),

/***/ "./dev/GymClock.tsx":
/*!**************************!*\
  !*** ./dev/GymClock.tsx ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
// GymClock spec is a 'templae' for a clock - how log, wether to play music, and which music. 
// GymClockAction is a way to send the start, pause, stop list via Rpc
// GymClockState is a class to represent the state of a running clock - is is started, stopped, paused etc, and if running, for how long. 
// GymClock is a running clock - created from a spec, then can start, stop, pause etc. 
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GymClockState = exports.GymClockAction = exports.GymClockSpec = exports.GymClockActionEnum = exports.GymClockStateEnum = exports.GymClockMusicEnum = exports.GymClockDurationEnum = void 0;
var GymClockDurationEnum;
(function (GymClockDurationEnum) {
    GymClockDurationEnum[GymClockDurationEnum["Five"] = 0] = "Five";
    GymClockDurationEnum[GymClockDurationEnum["Ten"] = 1] = "Ten";
    GymClockDurationEnum[GymClockDurationEnum["Fifteen"] = 2] = "Fifteen";
    GymClockDurationEnum[GymClockDurationEnum["Twenty"] = 3] = "Twenty";
})(GymClockDurationEnum = exports.GymClockDurationEnum || (exports.GymClockDurationEnum = {}));
;
var GymClockMusicEnum;
(function (GymClockMusicEnum) {
    GymClockMusicEnum[GymClockMusicEnum["Uptempo"] = 0] = "Uptempo";
    GymClockMusicEnum[GymClockMusicEnum["Midtempo"] = 1] = "Midtempo";
    GymClockMusicEnum[GymClockMusicEnum["None"] = 2] = "None";
})(GymClockMusicEnum = exports.GymClockMusicEnum || (exports.GymClockMusicEnum = {}));
;
var GymClockStateEnum;
(function (GymClockStateEnum) {
    GymClockStateEnum[GymClockStateEnum["Stopped"] = 0] = "Stopped";
    GymClockStateEnum[GymClockStateEnum["CountingDown"] = 1] = "CountingDown";
    GymClockStateEnum[GymClockStateEnum["Running"] = 2] = "Running";
    GymClockStateEnum[GymClockStateEnum["Paused"] = 3] = "Paused";
})(GymClockStateEnum = exports.GymClockStateEnum || (exports.GymClockStateEnum = {}));
;
var GymClockActionEnum;
(function (GymClockActionEnum) {
    GymClockActionEnum[GymClockActionEnum["Start"] = 0] = "Start";
    GymClockActionEnum[GymClockActionEnum["Stop"] = 1] = "Stop";
    GymClockActionEnum[GymClockActionEnum["Pause"] = 2] = "Pause";
})(GymClockActionEnum = exports.GymClockActionEnum || (exports.GymClockActionEnum = {}));
;
const countDownSeconds = 15;
// Keep this function  declation up here in case an extra Enum is added above & this needs to change
function calculateCountToSeconds(durationEnum) {
    switch (durationEnum) {
        case GymClockDurationEnum.Five:
            return (countDownSeconds + 5 * 60);
        default:
        case GymClockDurationEnum.Ten:
            return (countDownSeconds + 10 * 60);
        case GymClockDurationEnum.Fifteen:
            return (countDownSeconds + 15 * 60);
        case GymClockDurationEnum.Twenty:
            return (countDownSeconds + 20 * 60);
    }
}
;
//==============================//
// GymClockSpec class
//==============================//
class GymClockSpec {
    /**
     * Create a GymClockSpec object
     * @param durationEnum - one of the enumeration objects (10, 15, 20, ...)
     * @param musicEnum - one of the enumeration objects (Uptempo, Midtempo, none, ...)
     * @param musicUrl - string URL to the music file. Can be null.
     */
    constructor(durationEnum = GymClockDurationEnum.Ten, musicEnum = GymClockMusicEnum.None, musicUrl = '') {
        this._durationEnum = durationEnum;
        this._musicEnum = musicEnum;
        this._musicUrl = musicUrl;
    }
    /**
    * set of 'getters' for private variables
    */
    get durationEnum() {
        return this._durationEnum;
    }
    get musicEnum() {
        return this._musicEnum;
    }
    get musicUrl() {
        return this._musicUrl;
    }
    get type() {
        return GymClockSpec.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._durationEnum === rhs._durationEnum
            && this._musicEnum === rhs._musicEnum
            && this._musicUrl === rhs._musicUrl);
    }
    ;
    /**
  * Method that serializes to JSON
  */
    toJSON() {
        return {
            __type: GymClockSpec.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _durationEnum: this._durationEnum,
                _musicEnum: this._musicEnum,
                _musicUrl: this._musicUrl
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockSpec.reviveDb(data.attributes);
        return GymClockSpec.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockSpec(data._durationEnum, data._musicEnum, data._musicUrl);
    }
    ;
}
exports.GymClockSpec = GymClockSpec;
GymClockSpec.__type = "GymClockSpec";
//==============================//
// GymClockAction class 
// Exists just to transport en enum of RPC with a type
//==============================//
class GymClockAction {
    /**
     * Create a GymClockAction object
     */
    constructor(actionEnum) {
        this._actionEnum = actionEnum;
    }
    /**
    * set of 'getters' for private variables
    */
    get actionEnum() {
        return this._actionEnum;
    }
    get type() {
        return GymClockAction.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._actionEnum === rhs._actionEnum);
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: GymClockAction.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _actionEnum: this._actionEnum
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockAction.reviveDb(data.attributes);
        return GymClockAction.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockAction(data._actionEnum);
    }
    ;
}
exports.GymClockAction = GymClockAction;
GymClockAction.__type = "GymClockAction";
//==============================//
// GymClockState class 
//==============================//
class GymClockState {
    /**
     * Create a GymClockState object
     */
    constructor(stateEnum, secondsIn) {
        this._stateEnum = stateEnum;
        this._secondsIn = secondsIn;
    }
    /**
    * set of 'getters' for private variables
    */
    get stateEnum() {
        return this._stateEnum;
    }
    get secondsIn() {
        return this._secondsIn;
    }
    get type() {
        return GymClockState.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._stateEnum === rhs._stateEnum &&
            this._secondsIn === rhs._secondsIn);
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: GymClockState.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _stateEnum: this._stateEnum,
                _secondsIn: this._secondsIn
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revive from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return GymClockState.reviveDb(data.attributes);
        return GymClockState.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revive from
    */
    static reviveDb(data) {
        return new GymClockState(data._stateEnum, data._secondsIn);
    }
    ;
}
exports.GymClockState = GymClockState;
GymClockState.__type = "GymClockState";


/***/ }),

/***/ "./dev/Logger.tsx":
/*!************************!*\
  !*** ./dev/Logger.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerFactory = exports.LoggerType = void 0;
//import { ServerLoggerWrap } from './LoggerServerWrap';
const LoggerClientWrap_1 = __webpack_require__(/*! ./LoggerClientWrap */ "./dev/LoggerClientWrap.tsx");
var LoggerType;
(function (LoggerType) {
    LoggerType[LoggerType["Server"] = 0] = "Server";
    LoggerType[LoggerType["Client"] = 1] = "Client";
})(LoggerType = exports.LoggerType || (exports.LoggerType = {}));
class LoggerFactory {
    constructor() {
    }
    logger(loggerType) {
        switch (loggerType) {
            case LoggerType.Server:
                return new ClientLogger();
            case LoggerType.Client:
                return new ClientLogger();
                ;
        }
    }
}
exports.LoggerFactory = LoggerFactory;
/*
class ServerLogger implements ILogger {

   private logger: any;

   constructor() {

      // instantiate a new Winston Logger with the settings defined above
      this.logger = new ServerLoggerWrap();
   }

   logError(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logError (
         component,
         method,
         message,
         data ? JSON.stringify (data, null, 2) : ""
      );
   }

   logInfo(component: string,
      method: string,
      message: string,
      data: any
   ) : void {
      this.logger.logInfo (
         component,
         method,
         message,
         data ? JSON.stringify(data, null, 2) : ""
      );
   }
}
*/
class ClientLogger {
    constructor() {
        // instantiate a new Winston Logger with the settings defined above
        this.logger = new LoggerClientWrap_1.ClientLoggerWrap();
    }
    logError(component, method, message, data) {
        this.logger.logError(component, method, message, data ? JSON.stringify(data, null, 2) : "");
    }
    logInfo(component, method, message, data) {
        this.logger.logInfo(component, method, message, data ? JSON.stringify(data, null, 2) : "");
    }
}
var LoggerEntryPoints = {
    LoggerFactory: LoggerFactory,
    LoggerType: LoggerType
};


/***/ }),

/***/ "./dev/LoggerClientWrap.tsx":
/*!**********************************!*\
  !*** ./dev/LoggerClientWrap.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global exports*/
/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientLoggerWrap = void 0;
var logging = __webpack_require__(/*! loglevel */ "./node_modules/loglevel/lib/loglevel.js");
logging.setLevel("info");
class ClientLoggerWrap {
    constructor() {
        // instantiate a new Winston Logger with the settings defined above
        this.logger = logging;
    }
    logError(fromClass, fromMethod, info, objAsJSON) {
        const msg = ' ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : "");
        this.logger.error('Error:' + msg);
        //axios.post('/api/error', { params: { message: encodeURIComponent(msg) } })
        //   .then((response) => {
        //   });
    }
    logInfo(fromClass, fromMethod, info, objAsJSON) {
        this.logger.info('Info: ' + fromClass + "." + fromMethod + ": " + info + (objAsJSON ? objAsJSON : ""));
    }
}
exports.ClientLoggerWrap = ClientLoggerWrap;


/***/ }),

/***/ "./dev/Person.tsx":
/*!************************!*\
  !*** ./dev/Person.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Person = void 0;
class Person {
    /**
     * Create a Person object
     * @param _id - Mongo-DB assigned ID
     * @param externalId - ID assigned by external system (like facebook)
     * @param name - plain text user name
     * @param email - user email
     * @param thumbnailUrl - URL to thumbnail image
     * @param lastAuthCode - provided by underlying identity system when user logs in
     */
    constructor(_id, externalId, name, email, thumbnailUrl, lastAuthCode) {
        this._id = _id;
        this._externalId = externalId;
        this._name = name;
        this._email = email;
        this._thumbnailUrl = thumbnailUrl;
        this._lastAuthCode = lastAuthCode;
    }
    /**
    * set of 'getters' for private variables
    */
    get id() {
        return this._id;
    }
    get externalId() {
        return this._externalId;
    }
    get name() {
        return this._name;
    }
    get email() {
        return this._email;
    }
    get thumbnailUrl() {
        return this._thumbnailUrl;
    }
    get lastAuthCode() {
        return this._lastAuthCode;
    }
    get type() {
        return Person.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._id === rhs._id) &&
            (this._externalId === rhs._externalId) &&
            (this._name === rhs._name) &&
            (this._email === rhs._email) &&
            (this._thumbnailUrl === rhs._thumbnailUrl) &&
            (this._lastAuthCode === rhs._lastAuthCode));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: Person.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _externalId: this._externalId,
                _name: this._name,
                _email: this._email,
                _thumbnailUrl: this._thumbnailUrl,
                _lastAuthCode: this._lastAuthCode
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return Person.reviveDb(data.attributes);
        else
            return Person.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new Person(data._id, data._externalId, data._name, data._email, data._thumbnailUrl, data._lastAuthCode);
    }
    ;
}
exports.Person = Person;
Person.__type = "Person";
;


/***/ }),

/***/ "./dev/Queue.tsx":
/*!***********************!*\
  !*** ./dev/Queue.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueueAny = exports.QueueNumber = exports.QueueString = exports.Queue = void 0;
//==============================//
// Queue class
//==============================//
class Queue {
    /**
     * Creates a Queue
     */
    constructor() {
        this.offset = 0;
        this.queue = new Array();
    }
    // Returns the length of the queue.
    getLength() {
        return (this.queue.length - this.offset);
    }
    // Returns true if the queue is empty, and false otherwise.
    isEmpty() {
        return (this.queue.length == 0);
    }
    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    enqueue(item) {
        this.queue.push(item);
    }
    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    dequeue() {
        // if the queue is empty, return immediately
        if (this.queue.length == 0)
            return undefined;
        // store the item at the front of the queue
        let item = this.queue[this.offset];
        // increment the offset and remove the free space if necessary
        if (++(this.offset) * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        // return the dequeued item
        return item;
    }
    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    peek() {
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    }
}
exports.Queue = Queue;
// Convencience classes for calls from plain javascript
class QueueString extends Queue {
    constructor() {
        super();
    }
}
exports.QueueString = QueueString;
class QueueNumber extends Queue {
    constructor() {
        super();
    }
}
exports.QueueNumber = QueueNumber;
class QueueAny extends Queue {
    constructor() {
        super();
    }
}
exports.QueueAny = QueueAny;


/***/ }),

/***/ "./dev/Signal.tsx":
/*!************************!*\
  !*** ./dev/Signal.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalMessage = void 0;
const Types_1 = __webpack_require__(/*! ./Types */ "./dev/Types.tsx");
//==============================//
// SignalMessage class
//==============================//
class SignalMessage {
    /**
     * Create a SignalMessage object
     * @param _id - Mongo-DB assigned ID
     * @param facilityId - ID for the facility hosting the call*
     * @param sessionId - iD for the call session (in case same person joins > once)
     * @param sessionSubId - iD for the call session (in case same person joins > once from same browser)
     * @param sequenceNo - message sequence number, climbs nomintonicaly up from 0
     * @param data - data as an object. This is transformed to and from JSON for transport, must be registered with Type infrastructure
     */
    constructor(_id, facilityId, sessionId, sessionSubId, sequenceNo, data) {
        this._id = _id;
        this._facilityId = facilityId;
        this._sessionId = sessionId;
        this._sessionSubId = sessionSubId;
        this._sequenceNo = sequenceNo;
        this._data = data;
    }
    /**
 * set of 'getters' for private variables
 */
    get id() {
        return this._id;
    }
    get facilityId() {
        return this._facilityId;
    }
    get sessionId() {
        return this._sessionId;
    }
    get sessionSubId() {
        return this._sessionSubId;
    }
    get sequenceNo() {
        return this._sequenceNo;
    }
    get data() {
        return this._data;
    }
    get type() {
        return SignalMessage.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._id === rhs._id &&
            (this._facilityId === rhs._facilityId) &&
            (this._sessionId === rhs._sessionId) &&
            (this._sessionSubId === rhs._sessionSubId) &&
            (this._sequenceNo === rhs._sequenceNo) &&
            this._data.equals(rhs._data));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: SignalMessage.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _id: this._id,
                _facilityId: this._facilityId,
                _sessionId: this._sessionId,
                _sessionSubId: this._sessionSubId,
                _sequenceNo: this._sequenceNo,
                _data: JSON.stringify(this._data)
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return SignalMessage.reviveDb(data.attributes);
        else
            return SignalMessage.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        var types = new Types_1.TypeRegistry();
        return new SignalMessage(data._id, data._facilityId, data._sessionId, data._sessionSubId, data._sequenceNo, types.reviveFromJSON(data._data));
    }
    ;
    /**
     * Used to change the payload to JSON before storage
     * @param signalMessageIn - the object to transform
     */
    static toStored(signalMessageIn) {
        return new SignalMessage(signalMessageIn._id, signalMessageIn._facilityId, signalMessageIn._sessionId, signalMessageIn._sessionSubId, signalMessageIn._sequenceNo, JSON.stringify(signalMessageIn._data));
    }
    /**
     * Used to change the payload to JSON after storage
     * @param signalMessageIn - the object to transform
     */
    static fromStored(signalMessageIn) {
        var types = new Types_1.TypeRegistry();
        return new SignalMessage(signalMessageIn._id, signalMessageIn._facilityId, signalMessageIn._sessionId, signalMessageIn._sessionSubId, signalMessageIn._sequenceNo, types.reviveFromJSON(signalMessageIn._data));
    }
}
exports.SignalMessage = SignalMessage;
SignalMessage.__type = "SignalMessage";


/***/ }),

/***/ "./dev/Types.tsx":
/*!***********************!*\
  !*** ./dev/Types.tsx ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeRegistry = void 0;
/*! Copyright TXPCo, 2020 */
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const Signal_1 = __webpack_require__(/*! ./Signal */ "./dev/Signal.tsx");
const UserFacilities_1 = __webpack_require__(/*! ./UserFacilities */ "./dev/UserFacilities.tsx");
const Whiteboard_1 = __webpack_require__(/*! ./Whiteboard */ "./dev/Whiteboard.tsx");
const GymClock_1 = __webpack_require__(/*! ./GymClock */ "./dev/GymClock.tsx");
//==============================//
// TypeRegistry class
//==============================//
class TypeRegistry {
    /**
     * Creates a TypeRegistry for use in streaming objects to and from JSON
     */
    constructor() {
        // Registry of types
        this._types = {};
        this._types.Person = Person_1.Person;
        this._types.Facility = Facility_1.Facility;
        this._types.CallParticipation = Call_1.CallParticipation;
        this._types.CallOffer = Call_1.CallOffer,
            this._types.CallAnswer = Call_1.CallAnswer;
        this._types.CallIceCandidate = Call_1.CallIceCandidate;
        this._types.CallLeaderResolve = Call_1.CallLeaderResolve;
        this._types.CallKeepAlive = Call_1.CallKeepAlive;
        this._types.SignalMessage = Signal_1.SignalMessage;
        this._types.UserFacilities = UserFacilities_1.UserFacilities;
        this._types.Whiteboard = Whiteboard_1.Whiteboard;
        this._types.WhiteboardElement = Whiteboard_1.WhiteboardElement;
        this._types.GymClockSpec = GymClock_1.GymClockSpec;
        this._types.GymClockAction = GymClock_1.GymClockAction;
        this._types.GymClockState = GymClock_1.GymClockState;
    }
    isObjectKey(key) {
        let keyNum = Number(key);
        return key === '' || (!isNaN(keyNum - 0));
    }
    ;
    /**
      * Looks up a type name in JSON and returns a constructed object if there is a match
      * @param jsonString - the test to parse for a class
      */
    reviveFromJSON(jsonString) {
        var registry = this;
        return JSON.parse(jsonString, function (key, value) {
            if (registry.isObjectKey(key) && value.hasOwnProperty('__type'))
                return registry._types[value.__type].revive(value);
            else
                return this[key];
        });
    }
    ;
}
exports.TypeRegistry = TypeRegistry;


/***/ }),

/***/ "./dev/UserFacilities.tsx":
/*!********************************!*\
  !*** ./dev/UserFacilities.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserFacilities = void 0;
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const Equals_1 = __webpack_require__(/*! ./Equals */ "./dev/Equals.tsx");
//==============================//
// UserFacilities class
//==============================//
class UserFacilities {
    /**
     * Create a HomePageData object
     * @param sessionId - session ID - is sent back to the client, allows client to restart interrupted comms as long as within TTL
     * @param person - object for current user
     * @param currentFacility - the current facility where the user is logged in
     * @param facilities - array of all facilities where the user has a role
     *
     */
    constructor(sessionId, person, currentFacility, facilities = new Array()) {
        this._sessionId = sessionId;
        this._person = person;
        this._currentFacility = currentFacility;
        this._facilities = facilities;
    }
    /**
    * set of 'getters' for private variables
    */
    get sessionId() {
        return this._sessionId;
    }
    get person() {
        return this._person;
    }
    get currentFacility() {
        return this._currentFacility;
    }
    get facilities() {
        return this._facilities;
    }
    get type() {
        return UserFacilities.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return (this._sessionId === rhs._sessionId &&
            this._person.equals(rhs._person) &&
            this._currentFacility.equals(rhs._currentFacility) &&
            Equals_1.isEqual(this._facilities, rhs._facilities));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: UserFacilities.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _sessionId: this._sessionId,
                _person: this._person,
                _currentFacility: this._currentFacility,
                _facilities: this._facilities
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revive data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return UserFacilities.reviveDb(data.attributes);
        else
            return UserFacilities.reviveDb(data);
    }
    ;
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        let facilities = new Array();
        if (data._facilities) {
            facilities.length = data._facilities.length;
            for (var i = 0; i < data._facilities.length; i++) {
                facilities[i] = Facility_1.Facility.revive(data._facilities[i]);
            }
        }
        return new UserFacilities(data._sessionId, Person_1.Person.revive(data._person), data._currentFacility ? Facility_1.Facility.revive(data._currentFacility)
            : new Facility_1.Facility(null, "", 'Unknown', 'building-black128x128.png', "(No homepage)"), facilities);
    }
}
exports.UserFacilities = UserFacilities;
UserFacilities.__type = "UserFacilities";


/***/ }),

/***/ "./dev/Whiteboard.tsx":
/*!****************************!*\
  !*** ./dev/Whiteboard.tsx ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*jslint white: false, indent: 3, maxerr: 1000 */
/*global Enum*/
/*global exports*/
/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhiteboardElement = exports.Whiteboard = void 0;
//==============================//
// Whiteboard class
//==============================//
class Whiteboard {
    /**
     * Create a Whiteboard object
     * @param workout - text description to display for the workout
     * @param results - text description to display for the results
     */
    constructor(workout, results) {
        this._workout = workout;
        this._results = results;
    }
    /**
    * set of 'getters' for private variables
    */
    get workout() {
        return this._workout;
    }
    get results() {
        return this._results;
    }
    get type() {
        return Whiteboard.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._workout.equals(rhs._workout)) &&
            (this._results.equals(rhs._results)));
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: Whiteboard.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _workout: this._workout,
                _results: this._results
            }
        };
    }
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return Whiteboard.reviveDb(data.attributes);
        else
            return Whiteboard.reviveDb(data);
    }
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new Whiteboard(WhiteboardElement.revive(data._workout), WhiteboardElement.revive(data._results));
    }
}
exports.Whiteboard = Whiteboard;
Whiteboard.__type = "Whiteboard";
//==============================//
// WhiteboardElement class
//==============================//
class WhiteboardElement {
    /**
     * Create a WhiteboardWorkout object
      * @param rows - the number of rows (to set visible field size).
      * @param text - the text to display.
     */
    constructor(rows, text) {
        this._rows = rows;
        this._text = text;
    }
    /**
    * set of 'getters' for private variables
    */
    get rows() {
        return this._rows;
    }
    get text() {
        return this._text;
    }
    get type() {
        return WhiteboardElement.__type;
    }
    /**
     * test for equality - checks all fields are the same.
     * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
     * @param rhs - the object to compare this one to.
     */
    equals(rhs) {
        return ((this._rows === rhs._rows) &&
            (this._text === rhs._text));
    }
    ;
    /**
  * test for equality - checks all fields are the same.
  * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different.
  * @param rhs - the object to compare this one to.
  */
    assign(rhs) {
        this._rows = rhs._rows;
        this._text = rhs._text;
    }
    ;
    /**
     * Method that serializes to JSON
     */
    toJSON() {
        return {
            __type: WhiteboardElement.__type,
            // write out as id and attributes per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
            attributes: {
                _rows: this._rows,
                _text: this._text
            }
        };
    }
    ;
    /**
     * Method that can deserialize JSON into an instance
     * @param data - the JSON data to revove from
     */
    static revive(data) {
        // revice data from 'attributes' per JSON API spec http://jsonapi.org/format/#document-resource-object-attributes
        if (data.attributes)
            return WhiteboardElement.reviveDb(data.attributes);
        else
            return WhiteboardElement.reviveDb(data);
    }
    /**
    * Method that can deserialize JSON into an instance
    * @param data - the JSON data to revove from
    */
    static reviveDb(data) {
        return new WhiteboardElement(data._rows, data._text);
    }
}
exports.WhiteboardElement = WhiteboardElement;
WhiteboardElement.__type = "WhiteboardElement";


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*****************************!*\
  !*** ./dev/EntryPoints.tsx ***!
  \*****************************/

/*! Copyright TXPCo, 2020 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Logger_1 = __webpack_require__(/*! ./Logger */ "./dev/Logger.tsx");
const Person_1 = __webpack_require__(/*! ./Person */ "./dev/Person.tsx");
const Facility_1 = __webpack_require__(/*! ./Facility */ "./dev/Facility.tsx");
const Types_1 = __webpack_require__(/*! ./Types */ "./dev/Types.tsx");
const Dates_1 = __webpack_require__(/*! ./Dates */ "./dev/Dates.tsx");
const Queue_1 = __webpack_require__(/*! ./Queue */ "./dev/Queue.tsx");
const Call_1 = __webpack_require__(/*! ./Call */ "./dev/Call.tsx");
const Signal_1 = __webpack_require__(/*! ./Signal */ "./dev/Signal.tsx");
const UserFacilities_1 = __webpack_require__(/*! ./UserFacilities */ "./dev/UserFacilities.tsx");
const Whiteboard_1 = __webpack_require__(/*! ./Whiteboard */ "./dev/Whiteboard.tsx");
const GymClock_1 = __webpack_require__(/*! ./GymClock */ "./dev/GymClock.tsx");
var EntryPoints = {
    LoggerFactory: Logger_1.LoggerFactory,
    LoggerType: Logger_1.LoggerType,
    TypeRegistry: Types_1.TypeRegistry,
    Person: Person_1.Person,
    Facility: Facility_1.Facility,
    DateWithDays: Dates_1.DateWithDays,
    Queue: Queue_1.Queue,
    QueueString: Queue_1.QueueString,
    QueueNumber: Queue_1.QueueNumber,
    QueueAny: Queue_1.QueueAny,
    CallParticipation: Call_1.CallParticipation,
    CallOffer: Call_1.CallOffer,
    CallAnswer: Call_1.CallAnswer,
    CallIceCandidate: Call_1.CallIceCandidate,
    CallLeaderResolve: Call_1.CallLeaderResolve,
    CallKeepAlive: Call_1.CallKeepAlive,
    SignalMessage: Signal_1.SignalMessage,
    UserFacilities: UserFacilities_1.UserFacilities,
    Whiteboard: Whiteboard_1.Whiteboard,
    WhiteboardElement: Whiteboard_1.WhiteboardElement,
    GymClockDurationEnum: GymClock_1.GymClockDurationEnum,
    GymClockMusicEnum: GymClock_1.GymClockMusicEnum,
    GymClockStateEnum: GymClock_1.GymClockStateEnum,
    GymClockActionEnum: GymClock_1.GymClockActionEnum,
    GymClockSpec: GymClock_1.GymClockSpec,
    GymClockAction: GymClock_1.GymClockAction,
    GymClockState: GymClock_1.GymClockState
};
exports.default = EntryPoints;

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=core-bundle.js.map