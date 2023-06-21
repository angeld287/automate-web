import React from 'react';
import { Card, List } from 'antd';
import IImageGallery from './IImageGallery';
import Meta from 'antd/es/card/Meta';

const data = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
];

const ImageGallery: React.FC<IImageGallery> = ({list}) => (
  <List
    grid={{ gutter: 0, column: 4 }}
    dataSource={list}
    renderItem={(item) => (
      <List.Item>
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src={item.source_url} />}
        >
            <Meta title="" description={item.alt_text} />
        </Card>
      </List.Item>
    )}
  />
);

export default ImageGallery;