const axios = require('axios');
export {getMarkerIcon, updateGeneralViewData, getDataFromAPI};
import {
  GREEN_ICON,
  YELLOW_ICON,
  RED_ICON,
  LATITUDE_VALENCIA,
  LONGITUDE_VALENCIA,
} from './globalParams';
let firstTime = true;
/**
 *
 * @param {String} url
 * @return {Promise}
 */
async function getDataFromAPI(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Error in the response of the result.');
  }
}
/**
 *
 * @param {*} data
 * @param {*} initMapFunction
 * @param {*} createMarkerFunction
 */
function geolocate(data, initMapFunction, createMarkerFunction) {
  let map;
  navigator.geolocation.watchPosition(
      (marker) => {
        if (firstTime) {
          map = initMapFunction(LATITUDE_VALENCIA, LONGITUDE_VALENCIA);
          firstTime = false;
        }
        for (const paperbin of data) {
          marker = createMarkerFunction(map, paperbin);
        }
      },
      () => {
        throw new Error('Error initializing the map.');
      },
  );
}
/**
 *
 * @param {*} data
 * @param {*} setFillValueGraphFunction
 * @param {*} initMapFunction
 * @param {*} createMarkerFunction
 */
async function updateGeneralViewData(data, setFillValueGraphFunction,
    initMapFunction, createMarkerFunction) {
  geolocate(data, initMapFunction, createMarkerFunction);
  const fillAverageValue =
    data.reduce((sum, current) => sum + current.fillingLevel, 0) / data.length;
  setFillValueGraphFunction(fillAverageValue);
}
/**
 *
 * @param {*} fillValue
 * @return {Icon}
 */
function getMarkerIcon(fillValue) {
  if (fillValue > 0.70) {
    return RED_ICON;
  } else if (fillValue > 0.30) {
    return YELLOW_ICON;
  } else {
    return GREEN_ICON;
  }
}
