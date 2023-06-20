import {
    Button,
    Divider,
    Row,
  } from 'antd';
  import React, { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { getImagesList } from '../../features/media/mediaSlice';

  
  const ImagesManagement: React.FC = () => {  
    const dispatch = useAppDispatch();

    useEffect(() => {
      const siteId = localStorage.getItem('default-site');
      if(siteId)
        dispatch(getImagesList(parseInt(siteId)))
    }, [])

    const createNewImage = useCallback(() => {

    }, [])
    return (
      <>
        <Row>
            <Button style={{margin: 10}} onClick={() => {createNewImage()}}>Edit</Button>
            <Divider orientation="left"></Divider>
        </Row>
      </>
      
    );
  };
  
  export default ImagesManagement;