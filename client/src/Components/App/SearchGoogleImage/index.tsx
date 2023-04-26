import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Col, Divider, List, Row, Skeleton, Switch, Tag } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { clearGoogleResults, createMedia, searchGoogleImages, selectMedia } from "../../../features/media/mediaSlice";
import { isValidImageUrl, isValidUrl } from "../../../utils/functions";
import CustomInput from "../../CustomInput";
import CustomModal from "../../CustomModal";
import ISearchGoogleImage from "./ISearchGoogleImage";
import CustomButton from "../../CustomButton";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomInputGroup from "../../CustomInputGroup";

const SearchGoogleImage: React.FC<ISearchGoogleImage> = ({open, setOpen, title, type, relatedId}) => {
    const [url, setUrl] = useState('');
    const [imageTitle, setTitle] = useState('');
    const [fullImage, setFullImage] = useState(false);
    const [error, setError] = useState<undefined | string>(undefined);
    const dispatch = useAppDispatch();
    const media = useAppSelector(selectMedia);
    const [orderNumber, setOrderNumber] = useState<string>("")
    
    useEffect(() => {
        return () => setUrl('');
    }, [])

    useEffect(() => {
        setTitle(title);
        dispatch(clearGoogleResults())
    }, [open])

    useEffect(() => {
        if(url !== '' && (!isValidUrl(url) || !isValidImageUrl(url))) {
            setError('The url is not valid image url.')
        } else{
            setError(undefined)
        }
    }, [url]);

    const uploadImage = useCallback((link: string) => {
        if(link === ''){
            return setError('Please provide an image url.')
        }

        if(orderNumber === ''){
            return setError('Please provide an order number.')
        }

        dispatch(createMedia({imageAddress: link, title: imageTitle, type, relatedId, orderNumber}))
        setOpen(false);
        setOrderNumber("");
    }, [relatedId, imageTitle, orderNumber]);

    const searchImages = useCallback(() => {
        dispatch(clearGoogleResults())
        dispatch(searchGoogleImages({keyword: imageTitle, index: undefined}))
    }, [media, imageTitle])
    
    return (
        <CustomModal width={'80%'} title="Choose the preferred image" {...{open, setOpen}} confirmLoading={media.gstatus === 'loading'}>
            <Row>
                <Col span={20}><CustomInput onPressEnter={() => searchImages()} style={{marginTop: 5}} value={imageTitle} defaultValue={imageTitle} onChange={(e) => {e.preventDefault(); setTitle(e.target.value)}} placeholder="Image title" dataTestId="imput-image-title" label="Image title"/></Col>
                <Col><CustomButton style={{marginLeft: 5, marginTop: 9}} onClick={() => searchImages()}><SearchOutlined /></CustomButton></Col>
                <Col><Switch style={{marginLeft: 5, marginTop: 14}} onClick={() => setFullImage(true)}></Switch></Col>
            </Row>
            <Row>
                <div id="scrollableDiv" style={{
                        height: 400,
                        width: '100%',
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                    }}
                >
                    <InfiniteScroll
                        dataLength={media.googleResults.length}
                        next={() => dispatch(searchGoogleImages({keyword: imageTitle, index: media.gindex}))}
                        hasMore={true}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        scrollableTarget="scrollableDiv"
                    >
                        {fullImage &&
                            <List
                                loading={media.gstatus === 'loading'}
                                className="draft-articles-list"
                                itemLayout="horizontal"
                                dataSource={media.googleResults}
                                renderItem={(image) => (
                                    <List.Item>
                                        <Card
                                            onDoubleClick={() => uploadImage(image.link)}
                                            //actions={[<SelectOutlined />]}
                                            key={image.link}
                                            //style={{ marginTop: 10 }}
                                            cover={<img src={image.link}/>}
                                        />
                                    </List.Item>
                                )}
                            />
                        }
                        {!fullImage &&
                            <List
                                grid={{
                                    gutter: 16
                                }}
                                dataSource={media.googleResults}
                                renderItem={(item) => (
                                    <List.Item key={item.link}>
                                        <Card 
                                            onDoubleClick={() => uploadImage(item.link)}
                                            key={item.link}
                                            style={{width: 220}} 
                                            cover={<img src={item.thumbnailLink}/>}
                                            actions={[<CustomInputGroup key="order" label="" defaultValue={orderNumber} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />]}
                                        >
                                        </Card>
                                    </List.Item>
                                )}
                                />
                        }
                        
                    </InfiniteScroll>
                </div>
            </Row>
            <Row style={{marginTop: 10}}>
                {(error !== undefined) && <Col><Tag icon={<CloseCircleOutlined />} color="error">{error}</Tag></Col>}
            </Row>
        </CustomModal>
    )
}

export default React.memo(SearchGoogleImage);