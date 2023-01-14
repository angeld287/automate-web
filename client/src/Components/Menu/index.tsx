import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Menu as AntDMenu } from 'antd';
import { useAppDispatch } from '../../app/hooks';
import { logoutAsync } from '../../features/userSession/asyncThunks';
import './menu.css'
import { LogoutOutlined } from '@ant-design/icons';

const Menu: React.FC = () => {
  const [current, setCurrent] = useState('keywords');

  const dispatch = useAppDispatch()

  const logOut = () => {
      dispatch(logoutAsync())
  }

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

  const itemsRight: MenuProps['items'] = useMemo(() => [
    {
      label: 'Logout',
      key: 'lgout',
      icon: <LogoutOutlined />
    },
  ], []);

  const onClick: MenuProps['onClick'] = useCallback((e: any) => {
    setCurrent(e.key);
  }, [])

  return <>
    <AntDMenu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    <AntDMenu onClick={logOut} selectedKeys={[current]} mode="horizontal" items={itemsRight} style={{position: 'absolute', top: 0, right: 0}} />
  </>
};

export default React.memo(Menu);