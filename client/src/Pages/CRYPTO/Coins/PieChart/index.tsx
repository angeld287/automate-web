import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { getNumberOfTargets, selectChannel } from '../../../../features/channels/channelsSlice';

interface IData {type: string, value: number};
type ITargetNumber = 't1' | 't2' | 't3' | 't4' | 't5';

const PieChart = () => {
    let { coin, channelId } = useParams();
    const { targetsReport } = useAppSelector(selectChannel);
    const dispatch = useAppDispatch()
    const [ data, setData ] = useState<Array<IData>>([
        {
          type: '分类一',
          value: 27,
        },
        {
          type: '分类二',
          value: 25,
        },
        {
          type: '分类三',
          value: 18,
        },
        {
          type: '分类四',
          value: 15,
        },
        {
          type: '分类五',
          value: 10,
        },
        {
          type: '其他',
          value: 5,
        },
      ]);

    useEffect(() => {
        if(coin && channelId)
          dispatch(getNumberOfTargets({channelId, coin}));
    }, [coin, channelId, dispatch]);
    
    useEffect(() => {
        if(targetsReport){
            var keys = Object.keys(targetsReport);
            const _data: Array<IData> = [];
            //keys.forEach((target: ITargetNumber)  => {
            //    console.log(targetsReport[target])
            //    //_data.push({
            //    //    type: target,
            //    //    value: targetsReport[target]
            //    //})
            //});
        }
    }, [targetsReport]);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    startAngle: Math.PI,
    endAngle: Math.PI * 1.5,
    label: {
      type: 'inner',
      offset: '-8%',
      content: '{name}',
      style: {
        fontSize: 18,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    pieStyle: {
      lineWidth: 0,
    },
  };
  return <Pie {...config} />;
};

export default PieChart;