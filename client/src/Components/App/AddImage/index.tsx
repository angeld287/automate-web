import { CloseCircleOutlined } from "@ant-design/icons";
import { Checkbox, Col, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createMedia, createMediaOpenAI, selectMedia } from "../../../features/media/mediaSlice";
import { isValidImageUrl, isValidUrl } from "../../../utils/functions";
import CustomInput from "../../CustomInput";
import CustomModal from "../../CustomModal";
import IAddImage from "./IAddImage";
import { Typography } from 'antd';

const { Text } = Typography;


const AddImage: React.FC<IAddImage> = ({open, setOpen, title, type, relatedId}) => {
    const [url, setUrl] = useState('');
    const [imageTitle, setTitle] = useState('');
    const [openAI, setOpenAI] = useState(true);
    const [error, setError] = useState<undefined | string>(undefined);
    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);
    

    useEffect(() => {
        return () => setUrl('')
    }, [])

    useEffect(() => {
        setTitle(title)
    }, [open, title])

    useEffect(() => {
        if(url !== '' && (!isValidUrl(url) || !isValidImageUrl(url))) {
            setError('The url is not valid image url.')
        } else{
            setError(undefined)
        }
    }, [url]);

    const uploadImage = () => {
        if(openAI){
            dispatch(createMediaOpenAI({title: imageTitle, relatedId, type}))
        }else{
            if(url === ''){
                return setError('Please provide an image url.')
            }
            dispatch(createMedia({imageAddress: url, title: imageTitle, type, relatedId, orderNumber: '1'}))
        }
    }
    
    return (
        <CustomModal title="Add the image url" {...{open, setOpen}} confirmLoading={media.status === 'loading'} onOk={() => {uploadImage()}}>
            {!openAI && <CustomInput onChange={(e) => {e.preventDefault(); setUrl(e.target.value)}} placeholder="Image url" dataTestId="imput-image-url" label="Image url"/>}
            <CustomInput style={{marginTop: 5}} value={imageTitle} defaultValue={imageTitle} onChange={(e) => {e.preventDefault(); setTitle(e.target.value)}} placeholder="Image title" dataTestId="imput-image-title" label="Image title"/>
            <Checkbox defaultChecked onChange={() => setOpenAI(!openAI)}><Text style={{fontSize: 10}} type="secondary">Create Image With Artificial Inteligence</Text></Checkbox>
            <Row style={{marginTop: 10}}>
                {(error !== undefined) && <Col><Tag icon={<CloseCircleOutlined />} color="error">{error}</Tag></Col>}
            </Row>
        </CustomModal>
    )
}

export default React.memo(AddImage);