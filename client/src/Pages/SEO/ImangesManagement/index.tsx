import {
    Button,
    Divider,
    Row,
  } from 'antd';
  import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getImagesList, selectMedia } from '../../../features/media/mediaSlice';
import ImageGallery from '../../../Components/App/ImageGallery';
import AddImage from '../../../Components/App/AddImage';
import SearchGoogleImage from '../../../Components/App/SearchGoogleImage';

  
  const ImagesManagement: React.FC = () => {  
    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);
    const [ addImageModal, openAddImageModal ] = useState(false);
    const [ searchImageModal, openSearchImageModal ] = useState(false);

    useEffect(() => {
      const siteId = localStorage.getItem('default-site');
      if(siteId)
        dispatch(getImagesList(parseInt(siteId)))
    }, [dispatch])

    return (
      <>
        <Row>
            <Button style={{margin: 10}} onClick={() => {openAddImageModal(true)}}>Add Image</Button>
            <Button style={{margin: 10}} onClick={() => {openSearchImageModal(true)}}>Add Image By Google Search</Button>
            <Divider orientation="left"></Divider>
            <ImageGallery list={media.imagesList}/>
            <AddImage 
                open={addImageModal} 
                setOpen={openAddImageModal} 
                title={''} 
                type={undefined} 
                relatedId={0}
            /> 
            <SearchGoogleImage
                open={searchImageModal} 
                setOpen={openSearchImageModal} 
                title={''} 
                type={undefined}
                relatedId={0}
            />
        </Row>
      </>
      
    );
  };
  
  export default ImagesManagement;