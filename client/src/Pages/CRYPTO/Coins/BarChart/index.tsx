import React from 'react';
import { Column } from '@ant-design/plots';
import { Datum, MappingDatum } from '../ICharts';

const BarChart = () => {
  const data = [
    {
      type: '1-3秒',
      value: 0.16,
    },
    {
      type: '4-10秒',
      value: 0.125,
    },
    {
      type: '11-30秒',
      value: 0.24,
    },
    {
      type: '31-60秒',
      value: 0.19,
    },
    {
      type: '1-3分',
      value: 0.22,
    },
    {
      type: '3-10分',
      value: 0.05,
    },
    {
      type: '10-30分',
      value: 0.01,
    },
    {
      type: '30+分',
      value: 0.015,
    },
  ];
  
  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: (datum: Datum, defaultColor?: string) => {
      if (datum.type === '10-30分' || datum.type === '30+分') {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    label: {
      content: (data: Datum, mappingData: MappingDatum, index: number) => {
        const val = parseFloat(data.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }else{
            return ""
        }
      },
      offset: 10,
    },
    //legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
};

export default BarChart;