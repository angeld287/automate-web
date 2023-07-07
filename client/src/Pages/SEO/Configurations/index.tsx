import {
  Button,
  Col,
  Divider,
  Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../Components/CustomButton';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getSite, selectSitesUtils, updateSiteData } from '../../../features/configurations/configurationsSlice';
import { toast } from 'react-toastify';
import CustomInputGroup from '../../../Components/CustomInputGroup';

const Configurations: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [id, setId] = useState(0);
  const [name, setName] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [wpUser, setWpUser] = useState<string>('');
  const [wpUserPass, setWpUserPass] = useState<string>('');

  const { currentSite } = useAppSelector(selectSitesUtils);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(currentSite.id) setId(currentSite.id)
    setName(currentSite.name);
    setDomain(currentSite.domain);
    setWpUser(currentSite.wpUser);
    setWpUserPass(currentSite.wpUserPass);
  }, [currentSite])

  useEffect(() => {
    const sietId = localStorage.getItem('default-site');
    if(sietId){
      dispatch(getSite(parseInt(sietId)))
    }
      
  }, [dispatch]);

  const saveConfig = () => {
    if(name === '' || domain === '' || wpUser === '' || wpUserPass === '') return toast('Some of the fields are empty.')
    dispatch(updateSiteData({
      id,
      name,
      domain,
      wpUser,
      wpUserPass,
      selected: true
    }));
    setComponentDisabled(true)
  }

  return (
    <>
      <Row>
      <Button style={{margin: 10}} disabled={!componentDisabled} onClick={() => {setComponentDisabled(false)}}>Edit</Button>
      <Divider orientation="left"></Divider>
        <Col style={{width: '70%', margin: 50}}>
          <CustomInputGroup value={name} onChange={(e) => setName(e.target.value)} style={{marginBottom: 10}} disabled={componentDisabled} label='Site Name'></CustomInputGroup>
          <CustomInputGroup value={domain} onChange={(e) => setDomain(e.target.value)} style={{marginBottom: 10}} disabled={componentDisabled} label='Domain'></CustomInputGroup>
          <CustomInputGroup value={wpUser} onChange={(e) => setWpUser(e.target.value)} style={{marginBottom: 10}} disabled={componentDisabled} label='Wordpress Username'></CustomInputGroup>
          <CustomInputGroup value={wpUserPass} type='password' onChange={(e) => setWpUserPass(e.target.value)} style={{marginBottom: 10}} disabled={componentDisabled} label='Wordpress password'></CustomInputGroup>
          <CustomButton disabled={componentDisabled} onClick={saveConfig}>Save</CustomButton>
        </Col>
      </Row>
    </>
    
  );
};

export default Configurations;