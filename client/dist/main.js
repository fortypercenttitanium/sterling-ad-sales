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

/***/ "./client/src/index.js":
/*!*****************************!*\
  !*** ./client/src/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _adDetails_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../adDetails.json */ \"./adDetails.json\");\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\n\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\n\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\n\nvar adSizeSelect = document.querySelector('.ad-size-select');\nvar adFile = document.querySelector('.ad-content-file-container');\nvar adText = document.querySelector('.ad-content-text-container');\ndocument.addEventListener('DOMContentLoaded', function () {\n  var elems = document.querySelectorAll('select');\n  adFile.style.display = 'none'; // populate select options\n\n  var select = document.querySelector('.ad-size-select');\n  var adOptions = Object.keys(_adDetails_json__WEBPACK_IMPORTED_MODULE_0__).filter(function (option) {\n    return !_adDetails_json__WEBPACK_IMPORTED_MODULE_0__[option].limited;\n  });\n  M.FormSelect.init(elems); // get ad cover availability\n\n  fetch('./adAvailability').then(function (res) {\n    return res.json();\n  }).then(function (results) {\n    var allOptions = [].concat(_toConsumableArray(adOptions), _toConsumableArray(results));\n    allOptions.forEach(function (option) {\n      var details = _adDetails_json__WEBPACK_IMPORTED_MODULE_0__[option];\n      var el = document.createElement('option');\n      el.value = option;\n      el.textContent = \"\".concat(details.name, \" - $\").concat(details.price.toString());\n      select.appendChild(el);\n    });\n  })[\"catch\"](function (err) {\n    return console.error(err);\n  })[\"finally\"](function () {\n    M.updateTextFields();\n    M.FormSelect.init(elems);\n  });\n  M.updateTextFields();\n  updateSelectOptions();\n});\nadFile.addEventListener('change', function (e) {\n  var limitInMb = 10;\n\n  if (e.target.files[0].size > 1048576 * limitInMb) {\n    alert(\"File must be less than \".concat(limitInMB, \"MB\"));\n    e.target.value = '';\n  }\n});\nadSizeSelect.addEventListener('change', updateSelectOptions);\n\nfunction updateSelectOptions(e) {\n  var adTextInput = document.querySelector('#ad-content-text');\n  var adFileInput = document.querySelector('#ad-content-file');\n\n  if (e.target.value === 'eighth') {\n    // remove file input\n    adFile.style.display = 'none';\n    adFileInput.setAttribute('required', 'false');\n    adFileInput.setAttribute('disabled', 'true');\n    adFileInput.value = ''; // add text input\n\n    adText.style.display = 'block';\n    adTextInput.setAttribute('required', 'true');\n    adTextInput.removeAttribute('disabled');\n  } else {\n    // remove text input\n    adText.value = '';\n    adText.style.display = 'none';\n    adTextInput.setAttribute('required', 'false');\n    adTextInput.setAttribute('disabled', 'true'); // add file input\n\n    adFile.style.display = 'flex';\n    adFileInput.setAttribute('required', 'true');\n    adFileInput.removeAttribute('disabled');\n  }\n\n  M.updateTextFields();\n}\n\n//# sourceURL=webpack://sterling-ad-sales/./client/src/index.js?");

/***/ }),

/***/ "./adDetails.json":
/*!************************!*\
  !*** ./adDetails.json ***!
  \************************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"eighth\":{\"name\":\"Eighth page ad\",\"price\":25,\"description\":\"Eighth page text-only advertisement in Sterling HS Spring Musical ad book\",\"limited\":false},\"quarter\":{\"name\":\"Quarter page ad\",\"price\":40,\"description\":\"Quarter page advertisement in Sterling HS Spring Musical ad book\",\"limited\":false},\"half\":{\"name\":\"Half page ad\",\"price\":75,\"description\":\"Half page advertisement in Sterling HS Spring Musical ad book\",\"limited\":false},\"full_bw\":{\"name\":\"Full page b/w ad\",\"price\":100,\"description\":\"Full page black and white advertisement in Sterling HS Spring Musical ad book. This ad will be displayed somewhere on the inside part of the ad book (not cover).\",\"limited\":false},\"full_color\":{\"name\":\"Full page color ad\",\"price\":150,\"description\":\"Full page color advertisement in Sterling HS Spring Musical ad book. This ad will be displayed somewhere on the inside part of the ad book (not cover).\",\"limited\":false},\"front_inside_cover\":{\"name\":\"Front Inside Cover ad\",\"price\":200,\"description\":\"Full page color advertisement in Sterling HS Spring Musical ad book. This ad will be displayed on the front inside cover of the book.\",\"limited\":true},\"back_inside_cover\":{\"name\":\"Back Inside Cover ad\",\"price\":200,\"description\":\"Full page color advertisement in Sterling HS Spring Musical ad book. This ad will be displayed on the back inside cover of the book.\",\"limited\":true},\"back_outside_cover\":{\"name\":\"Back Outside Cover ad\",\"price\":200,\"description\":\"Full page color advertisement in Sterling HS Spring Musical ad book. This ad will be displayed on the back outside cover of the book.\",\"limited\":true}}');\n\n//# sourceURL=webpack://sterling-ad-sales/./adDetails.json?");

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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/src/index.js");
/******/ 	
/******/ })()
;