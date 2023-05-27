import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, MenuProps } from 'antd';
import { Menu as AntDMenu } from 'antd';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logoutAsync } from '../../features/userSession/asyncThunks';
import './menu.css'
import { LogoutOutlined, ToolOutlined } from '@ant-design/icons';
import { resetArticlesList } from '../../features/articles/articlesSlice';
import { selectSitesUtils, setDefeaultSite } from '../../features/configurations/configurationsSlice';
import { getSiteList } from '../../features/configurations/configurationsSlice';
import { ISelectOptions } from '../CustomSelect/ICustomSelect';
import ISite from '../../interfaces/models/ISite';
import CustomButton from '../CustomButton';
import CustomSelect from '../CustomSelect';

const Menu: React.FC = () => {
  const [current, setCurrent] = useState('keywords');

  const [defaultSite, setDefaultSite] = useState<ISite>()

  const dispatch = useAppDispatch()
  const config = useAppSelector(selectSitesUtils);

  useEffect(() => {
    if(config.sites.length === 0){ 
      dispatch(getSiteList())
    }else{
      setDefaultSite(config.sites.find(site => site.selected))
    }
  }, [config.sites])

  const logOut = () => {
      dispatch(resetArticlesList())
      dispatch(logoutAsync())
  }

  const siteList: Array<ISelectOptions> = useMemo(() => {
    return config.sites.map(site => ({id: site.id ? site.id.toString() : '0', name: site.domain }))
}, [config.sites])

  const items: MenuProps['items'] = useMemo(() => [
    {
      label: (<Link to="/">Home</Link>),
      key: 'home',
    },
    {
      label: (<Link to="/jobs">Jobs</Link>),
      key: 'jobs',
    },
    {
      label: (<Link to="/category">Categories</Link>),
      key: 'category',
    },
    
  ], []);

  const setSelectedSite = useCallback((e: any) => {
    dispatch(setDefeaultSite(parseInt(e)))
  }, []);

  const items2: MenuProps['items'] = useMemo(() => {
    if(defaultSite && defaultSite.id)
      return [
        {
          label:<Col><CustomSelect name="site" defaultValue={defaultSite?.id?.toString()} items={siteList} onChange={(e) => setSelectedSite(e)} placeholder="Choose One Site"></CustomSelect></Col>,
          key: 'site',
        },
        {
          label: <Link to="/config"><CustomButton onClick={() => {}}><ToolOutlined /> Config</CustomButton></Link>,
          key: 'config',
        },
        {
          label: <CustomButton onClick={logOut}><LogoutOutlined /> LogOut</CustomButton>,
          key: 'lgout',
        },
      ]
  }, [siteList, defaultSite]);

  const onClick: MenuProps['onClick'] = useCallback((e: any) => {
    setCurrent(e.key);
  }, [])

  return <>
    <AntDMenu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    <AntDMenu selectedKeys={[current]} mode="horizontal" items={items2} style={{position: 'absolute', top: 0, right: 20}} />
  </>
};

export default React.memo(Menu);