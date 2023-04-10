import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import finnHub from '../apis/finnHub';

// transform api data to chart data
const formatData = (data) => {
  return data.t.map((el, index) => ({
    x: el * 1000,
    y: data.c[index],
  }));
};

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const date = new Date();
      const currentTimte = Math.floor(date.getTime() / 1000); // we need seconds not milliseconds
      const dayInSeconds = 24 * 60 * 60;

      // if its saturday we need data from 2 days ago
      // if its sunday we need 3,
      // otherwise just the previous day
      let previousDays = 1;
      if (date.getDay() === 6) {
        previousDays = 2;
      }
      if (date.getDay() === 0) {
        previousDays = 3;
      }

      const oneDay = currentTimte - previousDays * dayInSeconds;
      const oneWeek = currentTimte - 7 * dayInSeconds;
      const oneYear = currentTimte - 365 * dayInSeconds;

      try {
        const [{ data: dayData }, { data: weekData }, { data: yearData }] =
          await Promise.all([
            finnHub.get('/stock/candle', {
              params: {
                symbol,
                from: oneDay,
                to: currentTimte,
                resolution: 30, // every 30 minutes
              },
            }),
            finnHub.get('/stock/candle', {
              params: {
                symbol,
                from: oneWeek,
                to: currentTimte,
                resolution: 60, // every 60 minutes
              },
            }),
            finnHub.get('/stock/candle', {
              params: {
                symbol,
                from: oneYear,
                to: currentTimte,
                resolution: 'W', // every week
              },
            }),
          ]);

        setChartData({
          day: formatData(dayData),
          week: formatData(weekData),
          year: formatData(yearData),
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [symbol]);

  return <div>StockDetailPage {symbol}</div>;
};

export default StockDetailPage;
