import React, { useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { generateCoinTradesResults, selectChannel } from '../../../../features/channels/channelsSlice';

const SliderBarChart = () => {

  let { coin } = useParams();
  const { coinTrades } = useAppSelector(selectChannel);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(coin)
      dispatch(generateCoinTradesResults(coin));
  }, [coin]);

  //const paletteSemanticRed = '#F4664A';
  //const brandColor = '#5B8FF9';
  const cryptographyGreen = '#009637'

  const config = {
    data: coinTrades,
    xField: 'month',
    yField: 'amount',
    color: cryptographyGreen,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: 0.1,
      end: 0.2,
    },
  };

  return <Column {...config} />;
};

export default SliderBarChart;