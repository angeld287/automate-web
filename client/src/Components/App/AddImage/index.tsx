import { CloseCircleOutlined } from "@ant-design/icons";
import { Col, Row, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { createMedia } from "../../../features/media/mediaSlice";
import { isValidImageUrl, isValidUrl } from "../../../utils/functions";
import CustomInput from "../../CustomInput";
import CustomModal from "../../CustomModal";
import IAddImage from "./IAddImage";

const AddImage: React.FC<IAddImage> = ({open, setOpen, title}) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState<undefined | string>(undefined);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(url !== '' && (!isValidUrl(url) || !isValidImageUrl(url))) {
            setError('The url is not valid image url.')
        } else{
            setError(undefined)
        }
    }, [url]);

    const uploadImage = () => {
        if(url === ''){
            return setError('Please provide an image url.')
        }

        dispatch(createMedia({imageAddress: url, title}))
    }
    
    return (
        <CustomModal title="Add the image url" {...{open, setOpen}} onOk={() => {uploadImage()}}>
            <CustomInput onChange={(e) => {e.preventDefault(); setUrl(e.target.value)}} placeholder="Image url" dataTestId="imput-image-url" label="Image url"/>
            <Row style={{marginTop: 10}}>
                {(error !== undefined) && <Col><Tag icon={<CloseCircleOutlined />} color="error">{error}</Tag></Col>}
            </Row>
        </CustomModal>
    )
}

export default React.memo(AddImage);