import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Col, MenuProps, Row } from 'antd';
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
import CustomModal from '../CustomModal';
import CustomInputGroup from '../CustomInputGroup';
import { createSite } from '../../features/configurations/configurationsSlice';

const Menu: React.FC = () => {
  const [current, setCurrent] = useState('keywords');
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [wpUser, setWpUser] = useState('');
  const [wpUserPass, setWpUserPass] = useState('');
  const [createSiteModal, setCreateSiteModal] = useState(false);

  const [defaultSite, setDefaultSite] = useState<ISite>()

  const dispatch = useAppDispatch()
  const config = useAppSelector(selectSitesUtils);

  useEffect(() => {
    if(config.sites.length === 0){ 
      dispatch(getSiteList())
    }else{
      setDefaultSite(config.sites.find(site => site.selected))
    }
  }, [config.sites, dispatch])

  const logOut = useCallback(() => {
    dispatch(resetArticlesList())
    dispatch(logoutAsync())
}, [dispatch]);

  const siteList: Array<ISelectOptions> = useMemo(() => {
    return [ {id: '0', name: <b onClick={() => setCreateSiteModal(true)}>Create New</b>},
      ...config.sites.map(site => ({id: site.id ? site.id.toString() : '0', name: site.domain }))
    ]
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
  }, [dispatch]);

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
  }, [siteList, defaultSite, logOut, setSelectedSite]);

  const onClick: MenuProps['onClick'] = useCallback((e: any) => {
    setCurrent(e.key);
  }, []);


  const createNewSite = useCallback(() => {
    dispatch(createSite({
      name,
      domain,
      selected: false,
      wpUser,
      wpUserPass
    }))
    setCreateSiteModal(false)
  }, [name, domain, dispatch, wpUser, wpUserPass]);

  return <>
    <AntDMenu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    <AntDMenu selectedKeys={[current]} mode="horizontal" items={items2} style={{position: 'absolute', top: 0, right: 20}} />
    <CustomModal width={900} open={createSiteModal} setOpen={setCreateSiteModal} title='Create Site' onOk={() => createNewSite()}>
      <Row gutter={16} style={{marginBottom:10}}>
        <Col className="gutter-row" span={12}>
        <CustomInputGroup value={name} defaultValue={name} onChange={(e) => setName(e.target.value)} label="Name"></CustomInputGroup>
        </Col>
        <Col className="gutter-row" span={12}>
          <CustomInputGroup value={domain} defaultValue={domain} onChange={(e) => setDomain(e.target.value)} label="Domain"></CustomInputGroup>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
        <CustomInputGroup value={wpUser} defaultValue={wpUser} onChange={(e) => setWpUser(e.target.value)} label="Wp Username"></CustomInputGroup>
        </Col>
        <Col className="gutter-row" span={12}>
          <CustomInputGroup value={wpUserPass} defaultValue={wpUserPass} onChange={(e) => setWpUserPass(e.target.value)} label="Wp Password"></CustomInputGroup>
        </Col>
      </Row>
    </CustomModal>
  </>
};

export default React.memo(Menu);