import {
    Button,
    Divider,
    Row,
  } from 'antd';
  import React, { useCallback } from 'react';

  
  const ImagesManagement: React.FC = () => {  

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