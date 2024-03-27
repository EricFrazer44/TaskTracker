/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const { HolidayAPI } = require('holidayapi');

const key = functions.config().holidayapi.key;
const holidayApi = new HolidayAPI({ key });

exports.holidays = functions.https.onRequest((request, response) => {
  cors(request, response, async function() {
    try {
      const holidays = await holidayApi.holidays({
        country: 'US',
        year: 2022,
      });
      response.send(holidays);
    } catch (error) {
      console.error('There was an error!', error);
      response.status(500).send(error);
    }
  });
});

/*
import { HolidayAPI } from 'holidayapi';

const key = 'Insert your API key here';
const holidayApi = new HolidayAPI({ key });
(async () => {
    const holidays = await holidayApi.holidays({
    country: 'US',
    year: 2019,
  });
})();

const key = functions.config().holidayapi.key;
*/