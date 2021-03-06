/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
var __webpack_exports__ = {};
/*!********************************!*\
  !*** ./src/js/globalParams.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GREEN_ICON": () => (/* binding */ GREEN_ICON),
/* harmony export */   "LATITUDE_VALENCIA": () => (/* binding */ LATITUDE_VALENCIA),
/* harmony export */   "LONGITUDE_VALENCIA": () => (/* binding */ LONGITUDE_VALENCIA),
/* harmony export */   "RED_ICON": () => (/* binding */ RED_ICON),
/* harmony export */   "URL_BASE_API": () => (/* binding */ URL_BASE_API),
/* harmony export */   "YELLOW_ICON": () => (/* binding */ YELLOW_ICON)
/* harmony export */ });
const URL_BASE_API = 'https://papereres-api.herokuapp.com/';
const LATITUDE_VALENCIA = 39.47171216563244;
const LONGITUDE_VALENCIA = -0.37626229309948717;
const GREEN_ICON = L.icon({
  iconUrl: './assets/img/marcador_verde.webp',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const RED_ICON = L.icon({
  iconUrl: './assets/img/marcador_rojo.webp',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const YELLOW_ICON = L.icon({
  iconUrl: './assets/img/marcador_amarillo.webp',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsUGFyYW1zLmpzIiwibWFwcGluZ3MiOiI7O1VBQUE7VUFDQTs7Ozs7V0NEQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOTztBQUNBO0FBQ0E7QUFDQTtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ007QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNNO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zyb250ZW5kLy4vc3JjL2pzL2dsb2JhbFBhcmFtcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImV4cG9ydCBjb25zdCBVUkxfQkFTRV9BUEkgPSAnaHR0cHM6Ly9wYXBlcmVyZXMtYXBpLmhlcm9rdWFwcC5jb20vJztcbmV4cG9ydCBjb25zdCBMQVRJVFVERV9WQUxFTkNJQSA9IDM5LjQ3MTcxMjE2NTYzMjQ0O1xuZXhwb3J0IGNvbnN0IExPTkdJVFVERV9WQUxFTkNJQSA9IC0wLjM3NjI2MjI5MzA5OTQ4NzE3O1xuZXhwb3J0IGNvbnN0IEdSRUVOX0lDT04gPSBMLmljb24oe1xuICBpY29uVXJsOiAnLi9hc3NldHMvaW1nL21hcmNhZG9yX3ZlcmRlLndlYnAnLFxuICBpY29uU2l6ZTogWzI1LCA0MV0sXG4gIGljb25BbmNob3I6IFsxMiwgNDFdLFxuICBwb3B1cEFuY2hvcjogWzEsIC0zNF0sXG4gIHNoYWRvd1NpemU6IFs0MSwgNDFdLFxufSk7XG5leHBvcnQgY29uc3QgUkVEX0lDT04gPSBMLmljb24oe1xuICBpY29uVXJsOiAnLi9hc3NldHMvaW1nL21hcmNhZG9yX3Jvam8ud2VicCcsXG4gIGljb25TaXplOiBbMjUsIDQxXSxcbiAgaWNvbkFuY2hvcjogWzEyLCA0MV0sXG4gIHBvcHVwQW5jaG9yOiBbMSwgLTM0XSxcbiAgc2hhZG93U2l6ZTogWzQxLCA0MV0sXG59KTtcbmV4cG9ydCBjb25zdCBZRUxMT1dfSUNPTiA9IEwuaWNvbih7XG4gIGljb25Vcmw6ICcuL2Fzc2V0cy9pbWcvbWFyY2Fkb3JfYW1hcmlsbG8ud2VicCcsXG4gIGljb25TaXplOiBbMjUsIDQxXSxcbiAgaWNvbkFuY2hvcjogWzEyLCA0MV0sXG4gIHBvcHVwQW5jaG9yOiBbMSwgLTM0XSxcbiAgc2hhZG93U2l6ZTogWzQxLCA0MV0sXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==