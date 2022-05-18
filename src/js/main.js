'use strict';
// IMPORTACIONES
import {
  URL_BASE_API,
  LATITUDE_VALENCIA,
  LONGITUDE_VALENCIA,
} from './globalParams.js';
// DEFINICIONES
const realtimeData = await getDataFromAPI(URL_BASE_API + 'getRealtime');
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
    const data = await getDataFromAPI(URL_BASE_API + `${event.target.value}`);
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
          map = initMap(LATITUDE_VALENCIA, LONGITUDE_VALENCIA);
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
