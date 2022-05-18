/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/globalParams.js":
/*!********************************!*\
  !*** ./src/js/globalParams.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LATITUDE_VALENCIA": () => (/* binding */ LATITUDE_VALENCIA),
/* harmony export */   "LONGITUDE_VALENCIA": () => (/* binding */ LONGITUDE_VALENCIA),
/* harmony export */   "URL_BASE_API": () => (/* binding */ URL_BASE_API)
/* harmony export */ });
const URL_BASE_API = 'https://papereres-api.herokuapp.com/';
const LATITUDE_VALENCIA = 39.47171216563244;
const LONGITUDE_VALENCIA = -0.37626229309948717;


/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _globalParams_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./globalParams.js */ "./src/js/globalParams.js");

// IMPORTACIONES

// DEFINICIONES
const realtimeData = await getDataFromAPI(_globalParams_js__WEBPACK_IMPORTED_MODULE_0__.URL_BASE_API + 'getRealtime');
const allIds = realtimeData.map((paperbin) => paperbin._id);
const generalViewContainer = document.getElementById('generalView');
const stadisticsViewContainer = document.getElementById('stadisticsView');
const generalViewButton = document.getElementById('generalViewButton');
const stadisticsViewButton = document.getElementById('stadisticsViewButton');
const mesureDate = document.getElementById('mesureDate');
const temperature = document.getElementById('temperature');
const title = document.getElementById('title');
const selectSensor = document.querySelector('select[name="sensors"]');
const medidor = document.getElementById('medidor');
const stadisticsChart = document.getElementById('stadisticsChart');
const myChart = echarts.init(medidor);
const myChart2 = echarts.init(stadisticsChart);
// EVENT LISTENERS
window.addEventListener('resize', () => {
  myChart.resize();
  myChart2.resize();
});

generalViewButton.addEventListener('click', (event) => {
  setTimeout(() => {
    myChart.resize();
  }, 100);
  stadisticsViewButton.parentElement.style.backgroundColor = 'transparent';
  event.target.parentElement.style.backgroundColor = 'white';
  if (stadisticsViewContainer.hidden === false) {
    generalViewContainer.style.display = 'grid';
    stadisticsViewContainer.style.display = 'none';
  }
  updateGeneralViewData();
});
stadisticsViewButton.addEventListener('click', (event) => {
  setTimeout(() => {
    myChart2.resize();
  }, 100);
  generalViewButton.parentElement.style.backgroundColor = 'transparent';
  event.target.parentElement.style.backgroundColor = 'white';
  if (generalViewContainer.hidden === false) {
    generalViewContainer.style.display = 'none';
    stadisticsViewContainer.style.display = 'block';
    selectSensor.style.display = 'block';
  }
  updateStadisticsViewData();
});
selectSensor.addEventListener('change', async (event) => {
  if (event.target.value) {
    const data = await getDataFromAPI(_globalParams_js__WEBPACK_IMPORTED_MODULE_0__.URL_BASE_API + `${event.target.value}`);
    setTimelineFillValueGraph(data);
    localStorage.setItem('selectedSensor', event.target.value);
  }
});
// PROGRAMA PRNCIPAL
if (!navigator.geolocation) {
  throw new Error('Geolocation is not supported on your browser.');
}
updateGeneralViewData();
// FUNCIONES
/**
 *
 * @param {String} url
 * @return {Promise}
 */
async function getDataFromAPI(url) {
  const response = await fetch(url);
  let result;
  if (response.ok) {
    result = await response.json();
  } else {
    throw new Error('Error in the response of the result.');
  }
  return result;
}
/**
 *
 * @param {Array} data
 */
function geolocate(data) {
  let map;
  let firstTime = true;
  navigator.geolocation.watchPosition(
      (marker) => {
        if (firstTime) {
          map = initMap(_globalParams_js__WEBPACK_IMPORTED_MODULE_0__.LATITUDE_VALENCIA, _globalParams_js__WEBPACK_IMPORTED_MODULE_0__.LONGITUDE_VALENCIA);
          firstTime = false;
        }
        for (const paperbin of data) {
          marker = createMarker(map, paperbin);
        }
      },
      () => {
        throw new Error('Error initializing the map.');
      },
  );
}
/**
 * Creates the map
 * @param {Number} latitude
 * @param {Number} longitude
 * @return {Map}
 */
function initMap(latitude, longitude) {
  const map = L.map('map').setView([latitude, longitude], 13);
  L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 12,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
        'pk.eyJ1IjoieGF2aTEycC1wcm9mZSIsImEiOiJja3kxbnhrZjAwZDdkMnhybTVheWpzOXVrIn0.6tgSdQGqA4w9VQ0kY4xrlA', // eslint-disable-line
      }).addTo(map);
  return map;
}
/**
 *
 * @param {Map} map
 * @param {Object} data
 * @return {Marker}
 */
function createMarker(map, data) {
  const newMarker = L.marker([
    data.coordinates.positionX,
    data.coordinates.positionY,
  ]).addTo(map);
  newMarker.addEventListener('click', (event) => {
    if (title.style.display !== 'none') {
      title.style.display = 'none';
    }
    setAverageFillValueGraph(data.fillingLevel);
    mesureDate.innerHTML = 'MESURA PRESA EL ';
    mesureDate.innerHTML += `
      ${new Date(data.TimeInstant).toLocaleString('es-ES')}
    `;
  });
  return newMarker;
}
/**
 *
 */
async function updateGeneralViewData() {
  geolocate(realtimeData);
  const fillAverageValue =
    realtimeData.reduce((sum, current) => sum + current.fillingLevel, 0) /
    realtimeData.length;
  setAverageFillValueGraph(fillAverageValue);
}
/**
 *
 * @param {Number} data
 */
function setAverageFillValueGraph(data) {
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#7CFFB2'],
              [0.7, '#FDDD60'],
              [1, '#FF6E76'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5,
          },
        },
        axisLabel: {
          color: '#464646',
          fontSize: 20,
          distance: -80,
          formatter: function(value) {
            if (value === 0.875) {
              return 'Ple';
            } else if (value === 0.625) {
              return 'Mig ple';
            } else if (value === 0.375) {
              return 'Poc ple';
            } else if (value === 0.125) {
              return 'Buit';
            }
            return '';
          },
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 30,
        },
        detail: {
          fontSize: 50,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function(value) {
            return Math.round(value * 100) + '%';
          },
          color: 'auto',
        },
        data: [
          {
            value: data,
            name: '',
          },
        ],
      },
    ],
  };

  if (option && typeof option === 'object') {
    myChart.setOption(option);
  }
}
/**
 *
 * @param {*} data
 */
function setTimelineFillValueGraph(data = []) {
  const date = [];
  const dataFillingLevel = [];
  for (const paperbin of data) {
    date.push(new Date(paperbin.TimeInstant).toLocaleDateString('es-ES'));
    dataFillingLevel.push(Math.round(paperbin.fillingLevel * 100));
  }
  date.sort((a, b) => new Date(a) - new Date(b));
  const option = {
    tooltip: {
      trigger: 'axis',
      position: function(pt) {
        return [pt[0], '10%'];
      },
    },
    title: {
      left: 'center',
      text: 'Cronologia',
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 10,
      },
    ],
    series: [
      {
        name: 'Percentatge ompliment',
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: 'rgb(204,164,0)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255,236,159)',
            },
            {
              offset: 1,
              color: 'rgb(255,205,0)',
            },
          ]),
        },
        data: dataFillingLevel,
      },
    ],
  };
  if (option && typeof option === 'object') {
    myChart2.setOption(option);
  }
}
/**
 *
 */
async function updateStadisticsViewData() {
  if (selectSensor !== null) {
    selectSensor.innerHTML = '';
  }
  selectSensor.append(document.createElement('option'));
  for (const paperbin of allIds) {
    selectSensor.append(createSensorOption(paperbin));
  }
  if (localStorage.getItem('selectedSensor')) {
    selectSensor.value = localStorage.getItem('selectedSensor');
    selectSensor.dispatchEvent(new Event('change'));
  } else {
    setTimelineFillValueGraph();
  }
}
/**
 *
 * @param {String} paperbin
 * @return {HTMLOptionElement}
 */
function createSensorOption(paperbin) {
  const option = document.createElement('option');
  option.value = paperbin;
  option.innerHTML = paperbin;
  return option;
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var completeQueue = (queue) => {
/******/ 			if(queue) {
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var completeFunction = (fn) => (!--fn.r && fn());
/******/ 		var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackThen]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						completeQueue(queue);
/******/ 						queue = 0;
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						completeQueue(queue);
/******/ 						queue = 0;
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep['catch'](reject));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue = hasAwait && [];
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var isEvaluating = true;
/******/ 			var nested = false;
/******/ 			var whenAll = (deps, onResolve, onReject) => {
/******/ 				if (nested) return;
/******/ 				nested = true;
/******/ 				onResolve.r += deps.length;
/******/ 				deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 				nested = false;
/******/ 			};
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackThen] = (fn, rejectFn) => {
/******/ 				if (isEvaluating) { return completeFunction(fn); }
/******/ 				if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 				queueFunction(queue, fn);
/******/ 				promise['catch'](rejectFn);
/******/ 			};
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve, reject) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					whenAll(currentDeps, fn, reject);
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => (err && reject(promise[webpackError] = err), outerResolve()));
/******/ 			isEvaluating = false;
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
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/main.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjtXQUNBO1dBQ0Esc0JBQXNCO1dBQ3RCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQSxFQUFFO1dBQ0Y7V0FDQTs7Ozs7V0M3RUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcm9udGVuZC8uL3NyYy9qcy9nbG9iYWxQYXJhbXMuanMiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvLi9zcmMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvYXN5bmMgbW9kdWxlIiwid2VicGFjazovL2Zyb250ZW5kL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Zyb250ZW5kL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mcm9udGVuZC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnJvbnRlbmQvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBVUkxfQkFTRV9BUEkgPSAnaHR0cHM6Ly9wYXBlcmVyZXMtYXBpLmhlcm9rdWFwcC5jb20vJztcbmV4cG9ydCBjb25zdCBMQVRJVFVERV9WQUxFTkNJQSA9IDM5LjQ3MTcxMjE2NTYzMjQ0O1xuZXhwb3J0IGNvbnN0IExPTkdJVFVERV9WQUxFTkNJQSA9IC0wLjM3NjI2MjI5MzA5OTQ4NzE3O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gSU1QT1JUQUNJT05FU1xuaW1wb3J0IHtcbiAgVVJMX0JBU0VfQVBJLFxuICBMQVRJVFVERV9WQUxFTkNJQSxcbiAgTE9OR0lUVURFX1ZBTEVOQ0lBLFxufSBmcm9tICcuL2dsb2JhbFBhcmFtcy5qcyc7XG4vLyBERUZJTklDSU9ORVNcbmNvbnN0IHJlYWx0aW1lRGF0YSA9IGF3YWl0IGdldERhdGFGcm9tQVBJKFVSTF9CQVNFX0FQSSArICdnZXRSZWFsdGltZScpO1xuY29uc3QgYWxsSWRzID0gcmVhbHRpbWVEYXRhLm1hcCgocGFwZXJiaW4pID0+IHBhcGVyYmluLl9pZCk7XG5jb25zdCBnZW5lcmFsVmlld0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnZW5lcmFsVmlldycpO1xuY29uc3Qgc3RhZGlzdGljc1ZpZXdDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhZGlzdGljc1ZpZXcnKTtcbmNvbnN0IGdlbmVyYWxWaWV3QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYWxWaWV3QnV0dG9uJyk7XG5jb25zdCBzdGFkaXN0aWNzVmlld0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFkaXN0aWNzVmlld0J1dHRvbicpO1xuY29uc3QgbWVzdXJlRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXN1cmVEYXRlJyk7XG5jb25zdCB0ZW1wZXJhdHVyZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZW1wZXJhdHVyZScpO1xuY29uc3QgdGl0bGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGl0bGUnKTtcbmNvbnN0IHNlbGVjdFNlbnNvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdFtuYW1lPVwic2Vuc29yc1wiXScpO1xuY29uc3QgbWVkaWRvciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWRpZG9yJyk7XG5jb25zdCBzdGFkaXN0aWNzQ2hhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhZGlzdGljc0NoYXJ0Jyk7XG5jb25zdCBteUNoYXJ0ID0gZWNoYXJ0cy5pbml0KG1lZGlkb3IpO1xuY29uc3QgbXlDaGFydDIgPSBlY2hhcnRzLmluaXQoc3RhZGlzdGljc0NoYXJ0KTtcbi8vIEVWRU5UIExJU1RFTkVSU1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgbXlDaGFydC5yZXNpemUoKTtcbiAgbXlDaGFydDIucmVzaXplKCk7XG59KTtcblxuZ2VuZXJhbFZpZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbXlDaGFydC5yZXNpemUoKTtcbiAgfSwgMTAwKTtcbiAgc3RhZGlzdGljc1ZpZXdCdXR0b24ucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICBpZiAoc3RhZGlzdGljc1ZpZXdDb250YWluZXIuaGlkZGVuID09PSBmYWxzZSkge1xuICAgIGdlbmVyYWxWaWV3Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZ3JpZCc7XG4gICAgc3RhZGlzdGljc1ZpZXdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfVxuICB1cGRhdGVHZW5lcmFsVmlld0RhdGEoKTtcbn0pO1xuc3RhZGlzdGljc1ZpZXdCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgbXlDaGFydDIucmVzaXplKCk7XG4gIH0sIDEwMCk7XG4gIGdlbmVyYWxWaWV3QnV0dG9uLnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgaWYgKGdlbmVyYWxWaWV3Q29udGFpbmVyLmhpZGRlbiA9PT0gZmFsc2UpIHtcbiAgICBnZW5lcmFsVmlld0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHN0YWRpc3RpY3NWaWV3Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHNlbGVjdFNlbnNvci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfVxuICB1cGRhdGVTdGFkaXN0aWNzVmlld0RhdGEoKTtcbn0pO1xuc2VsZWN0U2Vuc29yLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGFzeW5jIChldmVudCkgPT4ge1xuICBpZiAoZXZlbnQudGFyZ2V0LnZhbHVlKSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGdldERhdGFGcm9tQVBJKFVSTF9CQVNFX0FQSSArIGAke2V2ZW50LnRhcmdldC52YWx1ZX1gKTtcbiAgICBzZXRUaW1lbGluZUZpbGxWYWx1ZUdyYXBoKGRhdGEpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzZWxlY3RlZFNlbnNvcicsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cbn0pO1xuLy8gUFJPR1JBTUEgUFJOQ0lQQUxcbmlmICghbmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XG4gIHRocm93IG5ldyBFcnJvcignR2VvbG9jYXRpb24gaXMgbm90IHN1cHBvcnRlZCBvbiB5b3VyIGJyb3dzZXIuJyk7XG59XG51cGRhdGVHZW5lcmFsVmlld0RhdGEoKTtcbi8vIEZVTkNJT05FU1xuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YUZyb21BUEkodXJsKSB7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgbGV0IHJlc3VsdDtcbiAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgaW4gdGhlIHJlc3BvbnNlIG9mIHRoZSByZXN1bHQuJyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGFcbiAqL1xuZnVuY3Rpb24gZ2VvbG9jYXRlKGRhdGEpIHtcbiAgbGV0IG1hcDtcbiAgbGV0IGZpcnN0VGltZSA9IHRydWU7XG4gIG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKFxuICAgICAgKG1hcmtlcikgPT4ge1xuICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgbWFwID0gaW5pdE1hcChMQVRJVFVERV9WQUxFTkNJQSwgTE9OR0lUVURFX1ZBTEVOQ0lBKTtcbiAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IHBhcGVyYmluIG9mIGRhdGEpIHtcbiAgICAgICAgICBtYXJrZXIgPSBjcmVhdGVNYXJrZXIobWFwLCBwYXBlcmJpbik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgaW5pdGlhbGl6aW5nIHRoZSBtYXAuJyk7XG4gICAgICB9LFxuICApO1xufVxuLyoqXG4gKiBDcmVhdGVzIHRoZSBtYXBcbiAqIEBwYXJhbSB7TnVtYmVyfSBsYXRpdHVkZVxuICogQHBhcmFtIHtOdW1iZXJ9IGxvbmdpdHVkZVxuICogQHJldHVybiB7TWFwfVxuICovXG5mdW5jdGlvbiBpbml0TWFwKGxhdGl0dWRlLCBsb25naXR1ZGUpIHtcbiAgY29uc3QgbWFwID0gTC5tYXAoJ21hcCcpLnNldFZpZXcoW2xhdGl0dWRlLCBsb25naXR1ZGVdLCAxMyk7XG4gIEwudGlsZUxheWVyKFxuICAgICAgJ2h0dHBzOi8vYXBpLm1hcGJveC5jb20vc3R5bGVzL3YxL3tpZH0vdGlsZXMve3p9L3t4fS97eX0/YWNjZXNzX3Rva2VuPXthY2Nlc3NUb2tlbn0nLFxuICAgICAge1xuICAgICAgICBhdHRyaWJ1dGlvbjpcbiAgICAgICAgJ01hcCBkYXRhICZjb3B5OyA8YSBocmVmPVwiaHR0cHM6Ly93d3cub3BlbnN0cmVldG1hcC5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzLCBJbWFnZXJ5IMKpIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXBib3guY29tL1wiPk1hcGJveDwvYT4nLFxuICAgICAgICBtYXhab29tOiAxMixcbiAgICAgICAgaWQ6ICdtYXBib3gvc3RyZWV0cy12MTEnLFxuICAgICAgICB0aWxlU2l6ZTogNTEyLFxuICAgICAgICB6b29tT2Zmc2V0OiAtMSxcbiAgICAgICAgYWNjZXNzVG9rZW46XG4gICAgICAgICdway5leUoxSWpvaWVHRjJhVEV5Y0Mxd2NtOW1aU0lzSW1FaU9pSmphM2t4Ym5oclpqQXdaRGRrTW5oeWJUVmhlV3B6T1hWckluMC42dGdTZFFHcUE0dzlWUTBrWTR4cmxBJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgfSkuYWRkVG8obWFwKTtcbiAgcmV0dXJuIG1hcDtcbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7TWFwfSBtYXBcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtNYXJrZXJ9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU1hcmtlcihtYXAsIGRhdGEpIHtcbiAgY29uc3QgbmV3TWFya2VyID0gTC5tYXJrZXIoW1xuICAgIGRhdGEuY29vcmRpbmF0ZXMucG9zaXRpb25YLFxuICAgIGRhdGEuY29vcmRpbmF0ZXMucG9zaXRpb25ZLFxuICBdKS5hZGRUbyhtYXApO1xuICBuZXdNYXJrZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAodGl0bGUuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICB0aXRsZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cbiAgICBzZXRBdmVyYWdlRmlsbFZhbHVlR3JhcGgoZGF0YS5maWxsaW5nTGV2ZWwpO1xuICAgIG1lc3VyZURhdGUuaW5uZXJIVE1MID0gJ01FU1VSQSBQUkVTQSBFTCAnO1xuICAgIG1lc3VyZURhdGUuaW5uZXJIVE1MICs9IGBcbiAgICAgICR7bmV3IERhdGUoZGF0YS5UaW1lSW5zdGFudCkudG9Mb2NhbGVTdHJpbmcoJ2VzLUVTJyl9XG4gICAgYDtcbiAgfSk7XG4gIHJldHVybiBuZXdNYXJrZXI7XG59XG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUdlbmVyYWxWaWV3RGF0YSgpIHtcbiAgZ2VvbG9jYXRlKHJlYWx0aW1lRGF0YSk7XG4gIGNvbnN0IGZpbGxBdmVyYWdlVmFsdWUgPVxuICAgIHJlYWx0aW1lRGF0YS5yZWR1Y2UoKHN1bSwgY3VycmVudCkgPT4gc3VtICsgY3VycmVudC5maWxsaW5nTGV2ZWwsIDApIC9cbiAgICByZWFsdGltZURhdGEubGVuZ3RoO1xuICBzZXRBdmVyYWdlRmlsbFZhbHVlR3JhcGgoZmlsbEF2ZXJhZ2VWYWx1ZSk7XG59XG4vKipcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gZGF0YVxuICovXG5mdW5jdGlvbiBzZXRBdmVyYWdlRmlsbFZhbHVlR3JhcGgoZGF0YSkge1xuICBjb25zdCBvcHRpb24gPSB7XG4gICAgc2VyaWVzOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdnYXVnZScsXG4gICAgICAgIHN0YXJ0QW5nbGU6IDE4MCxcbiAgICAgICAgZW5kQW5nbGU6IDAsXG4gICAgICAgIG1pbjogMCxcbiAgICAgICAgbWF4OiAxLFxuICAgICAgICBzcGxpdE51bWJlcjogOCxcbiAgICAgICAgYXhpc0xpbmU6IHtcbiAgICAgICAgICBsaW5lU3R5bGU6IHtcbiAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgY29sb3I6IFtcbiAgICAgICAgICAgICAgWzAuMywgJyM3Q0ZGQjInXSxcbiAgICAgICAgICAgICAgWzAuNywgJyNGRERENjAnXSxcbiAgICAgICAgICAgICAgWzEsICcjRkY2RTc2J10sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBvaW50ZXI6IHtcbiAgICAgICAgICBpY29uOiAncGF0aDovL00xMi44LDAuN2wxMiw0MC4xSDAuN0wxMi44LDAuN3onLFxuICAgICAgICAgIGxlbmd0aDogJzEyJScsXG4gICAgICAgICAgd2lkdGg6IDIwLFxuICAgICAgICAgIG9mZnNldENlbnRlcjogWzAsICctNjAlJ10sXG4gICAgICAgICAgaXRlbVN0eWxlOiB7XG4gICAgICAgICAgICBjb2xvcjogJ2F1dG8nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGF4aXNUaWNrOiB7XG4gICAgICAgICAgbGVuZ3RoOiAxMixcbiAgICAgICAgICBsaW5lU3R5bGU6IHtcbiAgICAgICAgICAgIGNvbG9yOiAnYXV0bycsXG4gICAgICAgICAgICB3aWR0aDogMixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBzcGxpdExpbmU6IHtcbiAgICAgICAgICBsZW5ndGg6IDIwLFxuICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgY29sb3I6ICdhdXRvJyxcbiAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGF4aXNMYWJlbDoge1xuICAgICAgICAgIGNvbG9yOiAnIzQ2NDY0NicsXG4gICAgICAgICAgZm9udFNpemU6IDIwLFxuICAgICAgICAgIGRpc3RhbmNlOiAtODAsXG4gICAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSAwLjg3NSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ1BsZSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAwLjYyNSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ01pZyBwbGUnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gMC4zNzUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdQb2MgcGxlJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IDAuMTI1KSB7XG4gICAgICAgICAgICAgIHJldHVybiAnQnVpdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICBvZmZzZXRDZW50ZXI6IFswLCAnLTIwJSddLFxuICAgICAgICAgIGZvbnRTaXplOiAzMCxcbiAgICAgICAgfSxcbiAgICAgICAgZGV0YWlsOiB7XG4gICAgICAgICAgZm9udFNpemU6IDUwLFxuICAgICAgICAgIG9mZnNldENlbnRlcjogWzAsICcwJSddLFxuICAgICAgICAgIHZhbHVlQW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogMTAwKSArICclJztcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvbG9yOiAnYXV0bycsXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2YWx1ZTogZGF0YSxcbiAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH07XG5cbiAgaWYgKG9wdGlvbiAmJiB0eXBlb2Ygb3B0aW9uID09PSAnb2JqZWN0Jykge1xuICAgIG15Q2hhcnQuc2V0T3B0aW9uKG9wdGlvbik7XG4gIH1cbn1cbi8qKlxuICpcbiAqIEBwYXJhbSB7Kn0gZGF0YVxuICovXG5mdW5jdGlvbiBzZXRUaW1lbGluZUZpbGxWYWx1ZUdyYXBoKGRhdGEgPSBbXSkge1xuICBjb25zdCBkYXRlID0gW107XG4gIGNvbnN0IGRhdGFGaWxsaW5nTGV2ZWwgPSBbXTtcbiAgZm9yIChjb25zdCBwYXBlcmJpbiBvZiBkYXRhKSB7XG4gICAgZGF0ZS5wdXNoKG5ldyBEYXRlKHBhcGVyYmluLlRpbWVJbnN0YW50KS50b0xvY2FsZURhdGVTdHJpbmcoJ2VzLUVTJykpO1xuICAgIGRhdGFGaWxsaW5nTGV2ZWwucHVzaChNYXRoLnJvdW5kKHBhcGVyYmluLmZpbGxpbmdMZXZlbCAqIDEwMCkpO1xuICB9XG4gIGRhdGUuc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYSkgLSBuZXcgRGF0ZShiKSk7XG4gIGNvbnN0IG9wdGlvbiA9IHtcbiAgICB0b29sdGlwOiB7XG4gICAgICB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICBwb3NpdGlvbjogZnVuY3Rpb24ocHQpIHtcbiAgICAgICAgcmV0dXJuIFtwdFswXSwgJzEwJSddO1xuICAgICAgfSxcbiAgICB9LFxuICAgIHRpdGxlOiB7XG4gICAgICBsZWZ0OiAnY2VudGVyJyxcbiAgICAgIHRleHQ6ICdDcm9ub2xvZ2lhJyxcbiAgICB9LFxuICAgIHRvb2xib3g6IHtcbiAgICAgIGZlYXR1cmU6IHtcbiAgICAgICAgZGF0YVpvb206IHtcbiAgICAgICAgICB5QXhpc0luZGV4OiAnbm9uZScsXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3RvcmU6IHt9LFxuICAgICAgICBzYXZlQXNJbWFnZToge30sXG4gICAgICB9LFxuICAgIH0sXG4gICAgeEF4aXM6IHtcbiAgICAgIHR5cGU6ICdjYXRlZ29yeScsXG4gICAgICBib3VuZGFyeUdhcDogZmFsc2UsXG4gICAgICBkYXRhOiBkYXRlLFxuICAgIH0sXG4gICAgeUF4aXM6IHtcbiAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICBib3VuZGFyeUdhcDogWzAsICcxMDAlJ10sXG4gICAgfSxcbiAgICBkYXRhWm9vbTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnaW5zaWRlJyxcbiAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgIGVuZDogMTAwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RhcnQ6IDAsXG4gICAgICAgIGVuZDogMTAsXG4gICAgICB9LFxuICAgIF0sXG4gICAgc2VyaWVzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdQZXJjZW50YXRnZSBvbXBsaW1lbnQnLFxuICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgIHN5bWJvbDogJ25vbmUnLFxuICAgICAgICBzYW1wbGluZzogJ2x0dGInLFxuICAgICAgICBpdGVtU3R5bGU6IHtcbiAgICAgICAgICBjb2xvcjogJ3JnYigyMDQsMTY0LDApJyxcbiAgICAgICAgfSxcbiAgICAgICAgYXJlYVN0eWxlOiB7XG4gICAgICAgICAgY29sb3I6IG5ldyBlY2hhcnRzLmdyYXBoaWMuTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgMSwgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvZmZzZXQ6IDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAncmdiKDI1NSwyMzYsMTU5KScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvZmZzZXQ6IDEsXG4gICAgICAgICAgICAgIGNvbG9yOiAncmdiKDI1NSwyMDUsMCknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YTogZGF0YUZpbGxpbmdMZXZlbCxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcbiAgaWYgKG9wdGlvbiAmJiB0eXBlb2Ygb3B0aW9uID09PSAnb2JqZWN0Jykge1xuICAgIG15Q2hhcnQyLnNldE9wdGlvbihvcHRpb24pO1xuICB9XG59XG4vKipcbiAqXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVN0YWRpc3RpY3NWaWV3RGF0YSgpIHtcbiAgaWYgKHNlbGVjdFNlbnNvciAhPT0gbnVsbCkge1xuICAgIHNlbGVjdFNlbnNvci5pbm5lckhUTUwgPSAnJztcbiAgfVxuICBzZWxlY3RTZW5zb3IuYXBwZW5kKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpKTtcbiAgZm9yIChjb25zdCBwYXBlcmJpbiBvZiBhbGxJZHMpIHtcbiAgICBzZWxlY3RTZW5zb3IuYXBwZW5kKGNyZWF0ZVNlbnNvck9wdGlvbihwYXBlcmJpbikpO1xuICB9XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2VsZWN0ZWRTZW5zb3InKSkge1xuICAgIHNlbGVjdFNlbnNvci52YWx1ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzZWxlY3RlZFNlbnNvcicpO1xuICAgIHNlbGVjdFNlbnNvci5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnY2hhbmdlJykpO1xuICB9IGVsc2Uge1xuICAgIHNldFRpbWVsaW5lRmlsbFZhbHVlR3JhcGgoKTtcbiAgfVxufVxuLyoqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhcGVyYmluXG4gKiBAcmV0dXJuIHtIVE1MT3B0aW9uRWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU2Vuc29yT3B0aW9uKHBhcGVyYmluKSB7XG4gIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICBvcHRpb24udmFsdWUgPSBwYXBlcmJpbjtcbiAgb3B0aW9uLmlubmVySFRNTCA9IHBhcGVyYmluO1xuICByZXR1cm4gb3B0aW9uO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsInZhciB3ZWJwYWNrVGhlbiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbChcIndlYnBhY2sgdGhlblwiKSA6IFwiX193ZWJwYWNrX3RoZW5fX1wiO1xudmFyIHdlYnBhY2tFeHBvcnRzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBleHBvcnRzXCIpIDogXCJfX3dlYnBhY2tfZXhwb3J0c19fXCI7XG52YXIgd2VicGFja0Vycm9yID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sKFwid2VicGFjayBlcnJvclwiKSA6IFwiX193ZWJwYWNrX2Vycm9yX19cIjtcbnZhciBjb21wbGV0ZVF1ZXVlID0gKHF1ZXVlKSA9PiB7XG5cdGlmKHF1ZXVlKSB7XG5cdFx0cXVldWUuZm9yRWFjaCgoZm4pID0+IChmbi5yLS0pKTtcblx0XHRxdWV1ZS5mb3JFYWNoKChmbikgPT4gKGZuLnItLSA/IGZuLnIrKyA6IGZuKCkpKTtcblx0fVxufVxudmFyIGNvbXBsZXRlRnVuY3Rpb24gPSAoZm4pID0+ICghLS1mbi5yICYmIGZuKCkpO1xudmFyIHF1ZXVlRnVuY3Rpb24gPSAocXVldWUsIGZuKSA9PiAocXVldWUgPyBxdWV1ZS5wdXNoKGZuKSA6IGNvbXBsZXRlRnVuY3Rpb24oZm4pKTtcbnZhciB3cmFwRGVwcyA9IChkZXBzKSA9PiAoZGVwcy5tYXAoKGRlcCkgPT4ge1xuXHRpZihkZXAgIT09IG51bGwgJiYgdHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIikge1xuXHRcdGlmKGRlcFt3ZWJwYWNrVGhlbl0pIHJldHVybiBkZXA7XG5cdFx0aWYoZGVwLnRoZW4pIHtcblx0XHRcdHZhciBxdWV1ZSA9IFtdO1xuXHRcdFx0ZGVwLnRoZW4oKHIpID0+IHtcblx0XHRcdFx0b2JqW3dlYnBhY2tFeHBvcnRzXSA9IHI7XG5cdFx0XHRcdGNvbXBsZXRlUXVldWUocXVldWUpO1xuXHRcdFx0XHRxdWV1ZSA9IDA7XG5cdFx0XHR9LCAoZSkgPT4ge1xuXHRcdFx0XHRvYmpbd2VicGFja0Vycm9yXSA9IGU7XG5cdFx0XHRcdGNvbXBsZXRlUXVldWUocXVldWUpO1xuXHRcdFx0XHRxdWV1ZSA9IDA7XG5cdFx0XHR9KTtcblx0XHRcdHZhciBvYmogPSB7fTtcblx0XHRcdG9ialt3ZWJwYWNrVGhlbl0gPSAoZm4sIHJlamVjdCkgPT4gKHF1ZXVlRnVuY3Rpb24ocXVldWUsIGZuKSwgZGVwWydjYXRjaCddKHJlamVjdCkpO1xuXHRcdFx0cmV0dXJuIG9iajtcblx0XHR9XG5cdH1cblx0dmFyIHJldCA9IHt9O1xuXHRyZXRbd2VicGFja1RoZW5dID0gKGZuKSA9PiAoY29tcGxldGVGdW5jdGlvbihmbikpO1xuXHRyZXRbd2VicGFja0V4cG9ydHNdID0gZGVwO1xuXHRyZXR1cm4gcmV0O1xufSkpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5hID0gKG1vZHVsZSwgYm9keSwgaGFzQXdhaXQpID0+IHtcblx0dmFyIHF1ZXVlID0gaGFzQXdhaXQgJiYgW107XG5cdHZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHM7XG5cdHZhciBjdXJyZW50RGVwcztcblx0dmFyIG91dGVyUmVzb2x2ZTtcblx0dmFyIHJlamVjdDtcblx0dmFyIGlzRXZhbHVhdGluZyA9IHRydWU7XG5cdHZhciBuZXN0ZWQgPSBmYWxzZTtcblx0dmFyIHdoZW5BbGwgPSAoZGVwcywgb25SZXNvbHZlLCBvblJlamVjdCkgPT4ge1xuXHRcdGlmIChuZXN0ZWQpIHJldHVybjtcblx0XHRuZXN0ZWQgPSB0cnVlO1xuXHRcdG9uUmVzb2x2ZS5yICs9IGRlcHMubGVuZ3RoO1xuXHRcdGRlcHMubWFwKChkZXAsIGkpID0+IChkZXBbd2VicGFja1RoZW5dKG9uUmVzb2x2ZSwgb25SZWplY3QpKSk7XG5cdFx0bmVzdGVkID0gZmFsc2U7XG5cdH07XG5cdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlaikgPT4ge1xuXHRcdHJlamVjdCA9IHJlajtcblx0XHRvdXRlclJlc29sdmUgPSAoKSA9PiAocmVzb2x2ZShleHBvcnRzKSwgY29tcGxldGVRdWV1ZShxdWV1ZSksIHF1ZXVlID0gMCk7XG5cdH0pO1xuXHRwcm9taXNlW3dlYnBhY2tFeHBvcnRzXSA9IGV4cG9ydHM7XG5cdHByb21pc2Vbd2VicGFja1RoZW5dID0gKGZuLCByZWplY3RGbikgPT4ge1xuXHRcdGlmIChpc0V2YWx1YXRpbmcpIHsgcmV0dXJuIGNvbXBsZXRlRnVuY3Rpb24oZm4pOyB9XG5cdFx0aWYgKGN1cnJlbnREZXBzKSB3aGVuQWxsKGN1cnJlbnREZXBzLCBmbiwgcmVqZWN0Rm4pO1xuXHRcdHF1ZXVlRnVuY3Rpb24ocXVldWUsIGZuKTtcblx0XHRwcm9taXNlWydjYXRjaCddKHJlamVjdEZuKTtcblx0fTtcblx0bW9kdWxlLmV4cG9ydHMgPSBwcm9taXNlO1xuXHRib2R5KChkZXBzKSA9PiB7XG5cdFx0Y3VycmVudERlcHMgPSB3cmFwRGVwcyhkZXBzKTtcblx0XHR2YXIgZm47XG5cdFx0dmFyIGdldFJlc3VsdCA9ICgpID0+IChjdXJyZW50RGVwcy5tYXAoKGQpID0+IHtcblx0XHRcdGlmKGRbd2VicGFja0Vycm9yXSkgdGhyb3cgZFt3ZWJwYWNrRXJyb3JdO1xuXHRcdFx0cmV0dXJuIGRbd2VicGFja0V4cG9ydHNdO1xuXHRcdH0pKVxuXHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0Zm4gPSAoKSA9PiAocmVzb2x2ZShnZXRSZXN1bHQpKTtcblx0XHRcdGZuLnIgPSAwO1xuXHRcdFx0d2hlbkFsbChjdXJyZW50RGVwcywgZm4sIHJlamVjdCk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIGZuLnIgPyBwcm9taXNlIDogZ2V0UmVzdWx0KCk7XG5cdH0sIChlcnIpID0+IChlcnIgJiYgcmVqZWN0KHByb21pc2Vbd2VicGFja0Vycm9yXSA9IGVyciksIG91dGVyUmVzb2x2ZSgpKSk7XG5cdGlzRXZhbHVhdGluZyA9IGZhbHNlO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2pzL21haW4uanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=