/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller/user/user_controller.ts":
/*!************************************************!*\
  !*** ./src/controller/user/user_controller.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _model_users_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../model/users/user_model */ \"./src/model/users/user_model.ts\");\n/* harmony import */ var _utils_parse_request_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/parse_request._data */ \"./src/utils/parse_request._data.ts\");\n/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../index */ \"./src/index.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\n\nconst userController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    _index__WEBPACK_IMPORTED_MODULE_2__.cc.notify('user branch activated');\n    //get users data\n    if (req.url === '/user' && req.method === 'GET') {\n        _index__WEBPACK_IMPORTED_MODULE_2__.cc.notify('users data requested');\n        const output = (0,_model_users_user_model__WEBPACK_IMPORTED_MODULE_0__.get_all_users)();\n        res.end(output);\n        return;\n    }\n    //register a user\n    if (req.url === '/user/new' && req.method == 'POST') {\n        _index__WEBPACK_IMPORTED_MODULE_2__.cc.notify('user register attempt');\n        const data = yield (0,_utils_parse_request_data__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(req);\n        _index__WEBPACK_IMPORTED_MODULE_2__.cc.log(data);\n    }\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (userController);\n\n\n//# sourceURL=webpack://photos-api/./src/controller/user/user_controller.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cc: () => (/* binding */ cc)\n/* harmony export */ });\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controller_user_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller/user/user_controller */ \"./src/controller/user/user_controller.ts\");\n/* harmony import */ var _utils_color_console__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/color_console */ \"./src/utils/color_console.ts\");\n\n\n\nconst PORT = 3000;\nconst cc = new _utils_color_console__WEBPACK_IMPORTED_MODULE_2__[\"default\"]();\nhttp__WEBPACK_IMPORTED_MODULE_0___default().createServer((req, res) => {\n    var _a;\n    //url undefined\n    if (req.url === undefined) {\n        res.end();\n        return;\n    }\n    //forward to user controller\n    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.startsWith('/user')) {\n        (0,_controller_user_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(req, res);\n    }\n})\n    .listen(PORT, () => { console.log('listening on port ' + PORT); });\n\n\n//# sourceURL=webpack://photos-api/./src/index.ts?");

/***/ }),

/***/ "./src/model/users/user_model.ts":
/*!***************************************!*\
  !*** ./src/model/users/user_model.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   create_user: () => (/* binding */ create_user),\n/* harmony export */   get_all_users: () => (/* binding */ get_all_users)\n/* harmony export */ });\n//get all users' data from the database\nfunction get_all_users() {\n    let output = [];\n    //TODO: database code here\n    return output;\n}\nfunction create_user() {\n    //TODO: register handling\n    return false;\n}\n\n\n\n//# sourceURL=webpack://photos-api/./src/model/users/user_model.ts?");

/***/ }),

/***/ "./src/utils/color_console.ts":
/*!************************************!*\
  !*** ./src/utils/color_console.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass ColorConsole {\n    constructor() {\n        this.colors = {\n            'WHITE': '\\x1b[37m',\n            'RED': '\\x1b[31m',\n            'GREEN': '\\x1b[32m',\n            'YELLOW': '\\x1b[33m',\n            'BLUE': '\\x1b[34m',\n            'CYAN': '\\x1b[36m',\n            'MAGENTA': '\\x1b[35m',\n            '_RESET': '\\x1b[0m'\n        };\n        this.omit = [];\n        this.display = true;\n        this.object_no_parse = false;\n    }\n    //custom stringify option\n    stringify(what) {\n        let output = [];\n        for (let el of what) {\n            if (el instanceof Array) {\n                output.push(('[ ' + el + ' ]').replace(/,/g, ', '));\n            }\n            else if (el instanceof Object && !this.object_no_parse) {\n                output.push(JSON.stringify(el));\n            }\n            else {\n                output.push(el + '');\n            }\n        }\n        return output;\n    }\n    //colorful logs\n    log(...message) {\n        if (this.display && !this.omit.includes(\"log\")) {\n            message = this.stringify(message);\n            console.log(this.colors.WHITE, ...message, this.colors._RESET);\n        }\n    }\n    warn(...message) {\n        if (this.display && !this.omit.includes(\"warn\")) {\n            message = this.stringify(message);\n            console.log(this.colors.YELLOW, ...message, this.colors._RESET);\n        }\n    }\n    error(...message) {\n        if (this.display && !this.omit.includes(\"error\")) {\n            message = this.stringify(message);\n            console.log(this.colors.RED, ...message, this.colors._RESET);\n        }\n    }\n    success(...message) {\n        if (this.display && !this.omit.includes(\"success\")) {\n            message = this.stringify(message);\n            console.log(this.colors.GREEN, ...message, this.colors._RESET);\n        }\n    }\n    notify(...message) {\n        if (this.display && !this.omit.includes(\"notify\")) {\n            message = this.stringify(message);\n            console.log(this.colors.BLUE, ...message, this.colors._RESET);\n        }\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ColorConsole);\n\n\n//# sourceURL=webpack://photos-api/./src/utils/color_console.ts?");

/***/ }),

/***/ "./src/utils/parse_request._data.ts":
/*!******************************************!*\
  !*** ./src/utils/parse_request._data.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst parseRequestData = (req) => {\n    return new Promise((resolve, reject) => {\n        let body = '';\n        req.on('data', (slice) => {\n            body += slice.toString();\n        });\n        req.on('end', () => {\n            try {\n                resolve(JSON.parse(JSON.stringify(body)));\n            }\n            catch (error) {\n                console.error(\"Error when parsing\" + error);\n                reject(error);\n            }\n        });\n    });\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseRequestData);\n\n\n//# sourceURL=webpack://photos-api/./src/utils/parse_request._data.ts?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;