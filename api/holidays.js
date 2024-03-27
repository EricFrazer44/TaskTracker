const { HolidayAPI } = require('holidayapi');

const holidayApi = new HolidayAPI({ key: process.env.HOLIDAY_API_KEY });

module.exports = async (req, res) => {
  const holidays = await holidayApi.holidays({
    country: 'US',
    year: new Date().getFullYear(),
  });

  res.status(200).json(holidays);
};