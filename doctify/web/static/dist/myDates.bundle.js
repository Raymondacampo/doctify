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

/***/ "./static/js-components/cancelDate.js":
/*!********************************************!*\
  !*** ./static/js-components/cancelDate.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _js_functions_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js-functions/cookie */ \"./static/js-functions/cookie.js\");\n/* harmony import */ var _equis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./equis */ \"./static/js-components/equis.js\");\n\n\nvar CancelDate = function CancelDate(_ref) {\n  var id = _ref.id,\n    str = _ref.str,\n    onAction = _ref.onAction,\n    setAlert = _ref.setAlert;\n  function cancel(id) {\n    fetch(\"canceldate/\".concat(id), {\n      method: 'POST',\n      headers: {\n        'X-CSRFToken': _js_functions_cookie__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n      }\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      setAlert(data[0], data[1]);\n    });\n  }\n  var closeCancel = function closeCancel() {\n    onAction();\n  };\n  return /*#__PURE__*/React.createElement(React.Fragment, null, id && str && /*#__PURE__*/React.createElement(\"div\", {\n    className: \"absolutly\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    className: \"cont\",\n    style: {\n      gap: '1rem'\n    }\n  }, /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"h3\", null, str)), /*#__PURE__*/React.createElement(\"div\", {\n    style: {\n      display: 'flex',\n      width: '90%',\n      margin: 'auto',\n      justifyContent: 'space-between'\n    }\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    className: \"cancel\",\n    onClick: function onClick() {\n      return closeCancel();\n    }\n  }, \"Cancel\"), /*#__PURE__*/React.createElement(\"button\", {\n    className: \"accept\",\n    onClick: function onClick() {\n      return cancel(id);\n    }\n  }, \"Confirm\")))));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CancelDate);\n\n//# sourceURL=webpack:///./static/js-components/cancelDate.js?");

/***/ }),

/***/ "./static/js-components/customAlert.js":
/*!*********************************************!*\
  !*** ./static/js-components/customAlert.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar CustomAlert = function CustomAlert(_ref) {\n  var valid = _ref.valid,\n    message = _ref.message;\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"alertContent\"\n  }, /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"img\", {\n    src: valid ? '/static/images/check.png' : '/static/images/error.png'\n  }), /*#__PURE__*/React.createElement(\"h3\", {\n    style: {\n      fontWeight: '100',\n      letterSpacing: '1px'\n    }\n  }, message)));\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CustomAlert);\n\n//# sourceURL=webpack:///./static/js-components/customAlert.js?");

/***/ }),

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

/***/ "./static/js/mydates.js":
/*!******************************!*\
  !*** ./static/js/mydates.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _js_components_cancelDate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../js-components/cancelDate */ \"./static/js-components/cancelDate.js\");\n/* harmony import */ var _js_components_customAlert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../js-components/customAlert */ \"./static/js-components/customAlert.js\");\nfunction _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\nfunction _iterableToArrayLimit(r, l) { var t = null == r ? null : \"undefined\" != typeof Symbol && r[Symbol.iterator] || r[\"@@iterator\"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t[\"return\"] && (u = t[\"return\"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }\nfunction _arrayWithHoles(r) { if (Array.isArray(r)) return r; }\n\n\nvar _React = React,\n  useEffect = _React.useEffect;\nfunction App() {\n  var _React$useState = React.useState({\n      id: null,\n      str: null\n    }),\n    _React$useState2 = _slicedToArray(_React$useState, 2),\n    cancelDate = _React$useState2[0],\n    setCancel = _React$useState2[1];\n  var _React$useState3 = React.useState({\n      valid: null,\n      msg: null\n    }),\n    _React$useState4 = _slicedToArray(_React$useState3, 2),\n    alert = _React$useState4[0],\n    setAlert = _React$useState4[1];\n  var buttons = document.querySelectorAll(\"button[data-target]\");\n  useEffect(function () {\n    if (localStorage.getItem(\"userData\")) {\n      var userData = JSON.parse(localStorage.getItem(\"userData\"));\n      setAlert({\n        valid: userData.valid,\n        msg: userData.msg\n      }); // Render the alert component\n      localStorage.removeItem(\"userData\"); // Clear the flag\n    }\n    var handleClick = function handleClick(event) {\n      var dataTarget = event.currentTarget.getAttribute(\"data-target\");\n      var _dataTarget$split = dataTarget.split(\",\"),\n        _dataTarget$split2 = _slicedToArray(_dataTarget$split, 2),\n        value1 = _dataTarget$split2[0],\n        value2 = _dataTarget$split2[1];\n      setCancel({\n        id: value1,\n        str: value2\n      });\n    };\n    buttons.forEach(function (button) {\n      button.addEventListener(\"click\", handleClick);\n    });\n\n    // // // Cleanup event listeners on unmount\n    return function () {\n      buttons.forEach(function (button) {\n        button.removeEventListener(\"click\", handleClick);\n      });\n    };\n  }, []);\n  var closeCancel = function closeCancel() {\n    setCancel(null);\n  };\n  useEffect(function () {\n    if (alert.msg) {\n      setCancel(null);\n      setTimeout(function () {\n        setAlert(null);\n      }, 1500);\n    }\n  }, [alert]);\n  var alertManagement = function alertManagement(valid, msg) {\n    var data = {\n      valid: valid,\n      msg: msg\n    };\n    localStorage.setItem(\"userData\", JSON.stringify(data));\n    location.reload();\n  };\n  return /*#__PURE__*/React.createElement(React.Fragment, null, cancelDate && /*#__PURE__*/React.createElement(_js_components_cancelDate__WEBPACK_IMPORTED_MODULE_0__[\"default\"], {\n    id: cancelDate.id,\n    str: cancelDate.str,\n    onAction: closeCancel,\n    setAlert: alertManagement\n  }), alert.msg && /*#__PURE__*/React.createElement(_js_components_customAlert__WEBPACK_IMPORTED_MODULE_1__[\"default\"], {\n    valid: alert.valid,\n    message: alert.msg\n  }));\n}\n;\n\n// Render the component into the desired container\nvar container = document.getElementById(\"your-react-root-id\");\nif (container) {\n  var root = ReactDOM.createRoot(container);\n  root.render(/*#__PURE__*/React.createElement(App, null));\n}\n\n// function App(){\n//     let [counter, setCounter] = React.useState(0)\n//     const [cancelDate, setCancel] = React.useState({\n//         id: null,\n//         str: null\n//     })\n\n//     const updateCancel = (date_id, date_str) => {\n//         console.log(date_id, date_str)\n//         setCancel({\n//             id: date_id,\n//             str: date_str\n//         })\n//     }\n//     const closeCancel =() => {\n//         setCancel(null)\n\n//     }\n\n//     useEffect(() => {\n//         try{\n//             if (alert.msg){\n//                 setCancel(null)\n//                 setCounter((c) => c + 1)\n//                 setTimeout(() => {autoClose()}, 5000);\n//             }            \n//         }finally{\n//             console.log(counter)\n//         }\n\n//         function autoClose(){\n//             setAlert({valid:null, msg: null})\n\n//         }\n//     },[alert])\n\n//     return(\n//         <> \n//             {cancelDate && <CancelDate id={cancelDate.id} str={cancelDate.str} onAction={closeCancel} setAlert={setAlert}/>}\n//             {alert.msg && <CustomAlert valid={alert.valid} message={alert.msg}/>}\n//         </>\n//     )\n// }\n\n// const myDatesRoot = ReactDOM.createRoot(document.getElementById('mydates')); // Use createRoot\n// myDatesRoot.render(<App />);\n\n//# sourceURL=webpack:///./static/js/mydates.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./static/js/mydates.js");
/******/ 	
/******/ })()
;