import React, { useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import { ICoinReport } from '../../../interfaces/models/Crypto/Message';

const CoinsPieReport: FC<ICoinReport> = ({openSignalQuantity, takeProfitQuantity, closePositionQuantity, canceledQuantity}) => {
  const data = [
    {
      type: 'OPEN',
      value: openSignalQuantity,
    },
    {
      type: 'TAKE',
      value: takeProfitQuantity,
    },
    {
      type: 'CLOSE',
      value: closePositionQuantity,
    },
    {
      type: 'CANCEL',
      value: canceledQuantity,
    }
  ];
  const config = {
    appendPadding: 0,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      //content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 20,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default CoinsPieReport;