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

/***/ "./static/js-components/equis.js":
/*!***************************************!*\
  !*** ./static/js-components/equis.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar Equis = function Equis(_ref) {\n  var onAction = _ref.onAction,\n    setFalse = _ref.setFalse;\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"change\",\n    onClick: function onClick() {\n      return setFalse ? onAction(false) : onAction();\n    }\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"bar1\"\n  }), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"bar2\"\n  }), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"bar3\"\n  }));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Equis);\n\n//# sourceURL=webpack:///./static/js-components/equis.js?");

/***/ }),

/***/ "./static/js-functions/cookie.js":
/*!***************************************!*\
  !*** ./static/js-functions/cookie.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction getCookie(name) {\n  var cookieValue = null;\n  if (document.cookie && document.cookie !== '') {\n    var cookies = document.cookie.split(';');\n    for (var i = 0; i < cookies.length; i++) {\n      var cookie = cookies[i].trim();\n      // Does this cookie string begin with the name we want?\n      if (cookie.substring(0, name.length + 1) === name + '=') {\n        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));\n        break;\n      }\n    }\n  }\n  return cookieValue;\n}\n;\nvar csrftoken = getCookie('csrftoken');\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (csrftoken);\n\n//# sourceURL=webpack:///./static/js-functions/cookie.js?");

/***/ }),

/***/ "./static/js/deleteAccount.js":
/*!************************************!*\
  !*** ./static/js/deleteAccount.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_components_equis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js-components/equis */ \"./static/js-components/equis.js\");\n/* harmony import */ var _js_functions_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js-functions/cookie */ \"./static/js-functions/cookie.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\nvar _React = React,\n  useEffect = _React.useEffect;\nfunction App() {\n  var _React$useState = React.useState(false),\n    _React$useState2 = _slicedToArray(_React$useState, 2),\n    openDelete = _React$useState2[0],\n    setOpenDelete = _React$useState2[1];\n  useEffect(function () {\n    var handler = function handler() {\n      setOpenDelete(true);\n    };\n    document.getElementById('delete_button').addEventListener('click', handler);\n  }, []);\n  return /*#__PURE__*/React.createElement(React.Fragment, null, openDelete && /*#__PURE__*/React.createElement(\"div\", {\n    className: \"manage_body\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"manage_container\"\n  }, /*#__PURE__*/React.createElement(_js_components_equis__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n    onAction: setOpenDelete\n  }), /*#__PURE__*/React.createElement(\"div\", {\n    className: \"manage_content\"\n  }, /*#__PURE__*/React.createElement(\"h2\", null, \"Delete account?\"), /*#__PURE__*/React.createElement(\"form\", {\n    action: \"delete_account\",\n    method: \"post\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    type: \"hidden\",\n    name: \"csrfmiddlewaretoken\",\n    value: _js_functions_cookie__WEBPACK_IMPORTED_MODULE_1__[\"default\"]\n  }), /*#__PURE__*/React.createElement(\"button\", {\n    type: \"submit\",\n    className: \"cancel\"\n  }, \"Delete account\"))))));\n}\nvar deleteRoot = ReactDOM.createRoot(document.getElementById('delete_content'));\ndeleteRoot.render(/*#__PURE__*/React.createElement(App, null));\n\n// const del_btn = document.getElementById('delete_button')\n// del_btn.addEventListener('click', () => {\n//     const container = document.createElement('div');\n\n//     container.innerHTML = `\n//     <div class=\"manage_body\">\n//         <div class=\"manage_container\">\n//             <h1>Delete account?</h1>\n//             <a href=\"myaccount/delete_account\" target=\"_blank\">Delete account</a>\n//         </div>\n//     </div>\n//     `;\n\n//     // const script = document.createElement('script');\n//     // script.textContent = `\n//     // // This is the script code you want to run.\n//     // console.log(\"Script inside dynamically created div is running!\");\n//     // `;\n\n//     // // Append the container and then the script\n//     document.body.appendChild(container);\n//     // document.body.appendChild(script);\n//     console.log('delete')\n// })\n\n//# sourceURL=webpack:///./static/js/deleteAccount.js?");

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
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./static/js/deleteAccount.js");
/******/ 	
/******/ })()
;