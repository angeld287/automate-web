import {
  Button,
  Col,
  Divider,
  Row,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { useAppDispatch } from '../../app/hooks';
import { getSite } from '../../features/configurations/configurationsSlice';

const Configurations: React.FC = () => {
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if(localStorage.getItem('default-site') !== null){
      //dispatch(getSite(parseInt()))
    }
      
  }, [dispatch]);

  const saveConfig = () => {
    //dispatch();
  }

  return (
    <>
      <Row>
      <Button style={{margin: 10}} disabled={!componentDisabled} onClick={() => {setComponentDisabled(false)}}>Edit</Button>
      <Divider orientation="left"></Divider>
        <Col style={{width: '70%', margin: 50}}>
          <CustomInput style={{marginBottom: 10}} disabled={componentDisabled} dataTestId='site-name' label='Site Name'></CustomInput>
          <CustomInput style={{marginBottom: 10}} disabled={componentDisabled} dataTestId='domain' label='Domain'></CustomInput>
          <CustomInput style={{marginBottom: 10}} disabled={componentDisabled} dataTestId='wordpress-username' label='Wordpress Username'></CustomInput>
          <CustomInput style={{marginBottom: 10}} disabled={componentDisabled} dataTestId='wordpress-password' label='Wordpress password'></CustomInput>
          <CustomButton onClick={saveConfig}>Save</CustomButton>
        </Col>
      </Row>
    </>
    
  );
};

export default () => <Configurations />;