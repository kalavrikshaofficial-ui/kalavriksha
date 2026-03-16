"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "lib_data_js";
exports.ids = ["lib_data_js"];
exports.modules = {

/***/ "./lib/data.js":
/*!*********************!*\
  !*** ./lib/data.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   readData: () => (/* binding */ readData),\n/* harmony export */   writeData: () => (/* binding */ writeData)\n/* harmony export */ });\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ \"fs\");\n/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst dataDir = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), \"data\");\nfunction getFilePath(name) {\n    return path__WEBPACK_IMPORTED_MODULE_1___default().join(dataDir, `${name}.json`);\n}\nfunction readData(name) {\n    try {\n        const filePath = getFilePath(name);\n        if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(filePath)) {\n            return [];\n        }\n        const raw = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(filePath, \"utf-8\");\n        const parsed = JSON.parse(raw);\n        return Array.isArray(parsed) ? parsed : [];\n    } catch  {\n        return [];\n    }\n}\nfunction writeData(name, data) {\n    const filePath = getFilePath(name);\n    fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(filePath, JSON.stringify(data, null, 2), \"utf-8\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvZGF0YS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBb0I7QUFDSTtBQUV4QixNQUFNRSxVQUFVRCxnREFBUyxDQUFDRyxRQUFRQyxHQUFHLElBQUk7QUFFekMsU0FBU0MsWUFBWUMsSUFBSTtJQUN2QixPQUFPTixnREFBUyxDQUFDQyxTQUFTLENBQUMsRUFBRUssS0FBSyxLQUFLLENBQUM7QUFDMUM7QUFFTyxTQUFTQyxTQUFTRCxJQUFJO0lBQzNCLElBQUk7UUFDRixNQUFNRSxXQUFXSCxZQUFZQztRQUM3QixJQUFJLENBQUNQLG9EQUFhLENBQUNTLFdBQVc7WUFDNUIsT0FBTyxFQUFFO1FBQ1g7UUFDQSxNQUFNRSxNQUFNWCxzREFBZSxDQUFDUyxVQUFVO1FBQ3RDLE1BQU1JLFNBQVNDLEtBQUtDLEtBQUssQ0FBQ0o7UUFDMUIsT0FBT0ssTUFBTUMsT0FBTyxDQUFDSixVQUFVQSxTQUFTLEVBQUU7SUFDNUMsRUFBRSxPQUFNO1FBQ04sT0FBTyxFQUFFO0lBQ1g7QUFDRjtBQUVPLFNBQVNLLFVBQVVYLElBQUksRUFBRVksSUFBSTtJQUNsQyxNQUFNVixXQUFXSCxZQUFZQztJQUM3QlAsdURBQWdCLENBQUNTLFVBQVVLLEtBQUtPLFNBQVMsQ0FBQ0YsTUFBTSxNQUFNLElBQUk7QUFDNUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9rYWxhLXZyaWtzaGEvLi9saWIvZGF0YS5qcz9iMTFlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuY29uc3QgZGF0YURpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnZGF0YScpO1xuXG5mdW5jdGlvbiBnZXRGaWxlUGF0aChuYW1lKSB7XG4gIHJldHVybiBwYXRoLmpvaW4oZGF0YURpciwgYCR7bmFtZX0uanNvbmApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVhZERhdGEobmFtZSkge1xuICB0cnkge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZ2V0RmlsZVBhdGgobmFtZSk7XG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCByYXcgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsICd1dGYtOCcpO1xuICAgIGNvbnN0IHBhcnNlZCA9IEpTT04ucGFyc2UocmF3KTtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShwYXJzZWQpID8gcGFyc2VkIDogW107XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVEYXRhKG5hbWUsIGRhdGEpIHtcbiAgY29uc3QgZmlsZVBhdGggPSBnZXRGaWxlUGF0aChuYW1lKTtcbiAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksICd1dGYtOCcpO1xufVxuIl0sIm5hbWVzIjpbImZzIiwicGF0aCIsImRhdGFEaXIiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImdldEZpbGVQYXRoIiwibmFtZSIsInJlYWREYXRhIiwiZmlsZVBhdGgiLCJleGlzdHNTeW5jIiwicmF3IiwicmVhZEZpbGVTeW5jIiwicGFyc2VkIiwiSlNPTiIsInBhcnNlIiwiQXJyYXkiLCJpc0FycmF5Iiwid3JpdGVEYXRhIiwiZGF0YSIsIndyaXRlRmlsZVN5bmMiLCJzdHJpbmdpZnkiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./lib/data.js\n");

/***/ })

};
;