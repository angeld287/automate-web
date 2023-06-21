import {
    Button,
    Divider,
    Row,
  } from 'antd';
  import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getImagesList, selectMedia } from '../../features/media/mediaSlice';
import ImageGallery from '../../Components/App/ImageGallery';

  
  const ImagesManagement: React.FC = () => {  
    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);

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
            <ImageGallery list={media.imagesList}/>
        </Row>
      </>
      
    );
  };
  
  export default ImagesManagement;