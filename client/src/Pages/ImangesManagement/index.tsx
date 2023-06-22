import {
    Button,
    Divider,
    Row,
  } from 'antd';
  import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getImagesList, selectMedia } from '../../features/media/mediaSlice';
import ImageGallery from '../../Components/App/ImageGallery';
import AddImage from '../../Components/App/AddImage';

  
  const ImagesManagement: React.FC = () => {  
    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);
    const [ addImageModal, openAddImageModal ] = useState(false);
    const [ imageType, setImageType ] = useState('')

    useEffect(() => {
      const siteId = localStorage.getItem('default-site');
      if(siteId)
        dispatch(getImagesList(parseInt(siteId)))
    })

    const createNewImage = useCallback(() => {

    }, [])

    return (
      <>
        <Row>
            <Button style={{margin: 10}} onClick={() => {}}>Add Image By Url</Button>
            <Button style={{margin: 10}} onClick={() => {}}>Add Image By AI</Button>
            <Button style={{margin: 10}} onClick={() => {}}>Add Image By Google Search</Button>
            <Divider orientation="left"></Divider>
            <ImageGallery list={media.imagesList}/>
            {/* <AddImage 
                open={addImageModal} 
                setOpen={openAddImageModal} 
                title={selectedItem? selectedItem.name: ""} 
                type={imageType} 
                relatedId={selectedItem ? selectedItem.id: 0}
            /> */}
        </Row>
      </>
      
    );
  };
  
  export default ImagesManagement;