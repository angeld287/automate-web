import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu as AntDMenu } from 'antd';

const Menu: React.FC = () => {
  const [current, setCurrent] = useState('keywords');

  const items: MenuProps['items'] = useMemo(() => [
    {
      label: (<Link to="/">Home</Link>),
      key: 'home',
    },
    {
      label: (<Link to="/posts">Posts</Link>),
      key: 'posts',
    },
  ], []);

  const onClick: MenuProps['onClick'] = useCallback((e: any) => {
    setCurrent(e.key);
  }, [])

  return <AntDMenu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default React.memo(Menu);