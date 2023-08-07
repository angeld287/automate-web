import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Line } from '@ant-design/plots';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { getAllCoinChannelMessages, selectChannel } from '../../../../features/channels/channelsSlice';

const LineChart = () => {
  let { coin, channelId } = useParams();
  const { coinTrades } = useAppSelector(selectChannel);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(coin && channelId)
      dispatch(getAllCoinChannelMessages({channelId, coin}));
  }, [coin, channelId]);

  const config = {
    data: coinTrades,
    //padding: 'auto',
    xField: 'month',
    yField: 'amount',
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    slider: {
      start: 0.1,
      end: 0.5,
    },
  };

  return <Line {...config} />;
};

export default LineChart;