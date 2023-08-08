import React, { useEffect, useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { getAllCoinChannelMessages, selectChannel } from '../../../../features/channels/channelsSlice';
import { Content } from 'antd/es/layout/layout';
import { Row } from 'antd';

const SliderBarChart = () => {

  let { coin, channelId } = useParams();
  const { coinTrades } = useAppSelector(selectChannel);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(coin && channelId)
      dispatch(getAllCoinChannelMessages({channelId, coin}));
  }, [coin, channelId, dispatch]);

  //const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';
  //const cryptographyGreen = '#009637'

  const config = useMemo(() => ({
    data: coinTrades,
    xField: 'month',
    yField: 'amount',
    color: brandColor,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
  }), [coinTrades]);

  return <Content>
    <Row>
      <h3>{coin}</h3>
    </Row>
      <Column {...config} />
  </Content>;
};

export default SliderBarChart;