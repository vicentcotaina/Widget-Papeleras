'use strict';
// IMPORTS
import {
  URL_BASE_API,
} from './globalParams.js';

import {
  getDataFromAPI,
  updateGeneralViewData,
  getMarkerIcon,
} from './bussinesLogic.js';

// GLOBAL VARIABLES
const realtimeData = await getDataFromAPI(URL_BASE_API + 'getRealtime');
const allIds = realtimeData.map((paperbin) => paperbin._id);
const generalViewContainer = document.getElementById('generalView');
const stadisticsViewContainer = document.getElementById('stadisticsView');
const generalViewButton = document.getElementById('generalViewButton');
const stadisticsViewButton = document.getElementById('stadisticsViewButton');
const mesureDate = document.getElementById('mesureDate');
const title = document.getElementById('title');
const selectSensor = document.querySelector('select[name="sensors"]');
const myChart = echarts.init(document.getElementById('medidor'));
const myChart2 = echarts.init(document.getElementById('stadisticsChart'));

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
  if (mesureDate.style.display !== 'none') {
    title.style.display = 'block';
    mesureDate.style.display = 'none';
  }
  if (stadisticsViewContainer.style.display !== 'none') {
    generalViewContainer.style.display = 'grid';
    stadisticsViewContainer.style.display = 'none';
  }
  updateGeneralViewData(realtimeData, setFillValueGraph, initMap, createMarker);
});
stadisticsViewButton.addEventListener('click', (event) => {
  setTimeout(() => {
    myChart2.resize();
  }, 100);
  generalViewButton.parentElement.style.backgroundColor = 'transparent';
  event.target.parentElement.style.backgroundColor = 'white';
  if (generalViewContainer.style.display !== 'none') {
    generalViewContainer.style.display = 'none';
    stadisticsViewContainer.style.display = 'block';
    selectSensor.style.display = 'block';
  }
  updateStadisticsViewData(allIds);
});
selectSensor.addEventListener('change', async (event) => {
  if (event.target.value) {
    myChart2.showLoading('default', {
      color: 'rgb(255,236,159)', text: ' Carregant dades...',
    });
    const data = await getDataFromAPI(URL_BASE_API + `${event.target.value}`);
    setTimelineFillValueGraph(data);
    myChart2.hideLoading();
    localStorage.setItem('selectedSensor', event.target.value);
  }
});

// PROGRAMA PRNCIPAL
if (!navigator.geolocation) {
  throw new Error('Geolocation is not supported on your browser.');
}
updateGeneralViewData(realtimeData, setFillValueGraph, initMap, createMarker);

// FUNCIONES
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
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
        'pk.eyJ1IjoieGF2aTEycC1wcm9mZSIsImEiOiJja3kxbnhrZjAwZDdkMnhybTVheWpzOXVrIn0.6tgSdQGqA4w9VQ0kY4xrlA', // eslint-disable-line
      },
  ).addTo(map);
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
  ],
  {
    icon: getMarkerIcon(data.fillingLevel),
  }).addTo(map).bindPopup(`Seleccionat`, {
    closeOnClick: false,
    closeButton: false,
    closeOnEscapeKey: false,
  });
  newMarker.addEventListener('click', (event) => {
    if (title.style.display !== 'none') {
      title.style.display = 'none';
      mesureDate.style.display = 'block';
    }
    setFillValueGraph(data.fillingLevel);
    mesureDate.innerHTML = `
      MESURA PRESA EL 
      ${new Date(data.TimeInstant).toLocaleString('es-ES')}
    `;
  });
  return newMarker;
}

/**
 *
 * @param {Number} data
 */
function setFillValueGraph(data) {
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
 * @param {*} idArray
 */
async function updateStadisticsViewData(idArray) {
  let counter=0;
  if (selectSensor !== null) {
    selectSensor.innerHTML = '';
  }
  selectSensor.append(document.createElement('option'));
  for (const paperbin of idArray) {
    selectSensor.append(createSensorOption(paperbin, counter++));
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
 * @param {*} paperbin
 * @param {Number} sensorNumber
 * @return {HTMLOptionElement}
 */
function createSensorOption(paperbin, sensorNumber) {
  const option = document.createElement('option');
  option.value = paperbin;
  option.innerHTML = `Sensor ${sensorNumber}`;
  return option;
}
