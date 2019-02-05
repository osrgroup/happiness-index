/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/service-worker/sw.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/service-worker/sw.js":
/*!****************************************!*\
  !*** ./assets/js/service-worker/sw.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

var VERSION = 1;
var CACHE_PREFIX = "happiness-index";
var CACHE_SUFFIX = "v1";
var CACHE_RUNTIME = "runtime";
var CACHE_PRECACHE = "precache";
var CACHE_RUNTIME_NAME = exports.CACHE_RUNTIME_NAME = CACHE_PREFIX + "-" + CACHE_RUNTIME + "-" + CACHE_SUFFIX;
var CACHE_PRECACHE_NAME = exports.CACHE_PRECACHE_NAME = CACHE_PREFIX + "-" + CACHE_PRECACHE + "-" + CACHE_SUFFIX;

console.log("[SW] Hello. Using SW Version ", VERSION);

/*workbox.setConfig({
	debug: false
});*/
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.silent); //workbox.core.LOG_LEVELS.debug


/**
 * Cache naming scheme.
 * results in runtime cache name: qdacity-app-runtime-v1
 */
workbox.core.setCacheNameDetails({
	prefix: CACHE_PREFIX,
	suffix: CACHE_SUFFIX,
	precache: CACHE_PRECACHE,
	runtime: CACHE_RUNTIME
});

workbox.skipWaiting();
workbox.clientsClaim();

//TODO precache instead of runtime

console.log("[SW] registering static routes");
workbox.routing.registerRoute(/.*\.css/, workbox.strategies.networkFirst());
workbox.routing.registerRoute(/.*\.js/, workbox.strategies.networkFirst());
workbox.routing.registerRoute(/.*\.cache\..*/, workbox.strategies.cacheFirst());
workbox.routing.registerRoute('/', workbox.strategies.networkFirst());
workbox.routing.registerRoute('/PersonalDashboard', workbox.strategies.networkFirst());
workbox.routing.registerRoute(/ProjectDashboard.*/, workbox.strategies.networkFirst());
workbox.routing.registerRoute(/CodingEditor.*/, workbox.strategies.networkFirst());

workbox.routing.registerRoute(/_ah\/api\/static\/.*/, workbox.strategies.networkFirst());

/***/ })

/******/ });