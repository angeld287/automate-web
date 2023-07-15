import { useCallback, useEffect, useMemo } from "react";
import { Card, Col, List, Row, Space, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { generateCoinsReport, getAllChannelMessages, selectChannel } from "../../../features/channels/channelsSlice";
import CustomLoader from "../../../Components/CustomLoader";
import { ICoinReport } from "../../../interfaces/models/Crypto/Message";
import CustomButton from "../../../Components/CustomButton";

const Coins = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    let { channelId } = useParams();
    const channels = useAppSelector(selectChannel);

    useEffect(()=> {
        if(channelId)
            dispatch(getAllChannelMessages(channelId));
    }, [])

    const getCoins = useCallback(() => {
        if(channels.messages.length > 0 && channels.getAllMessagesState === 'idle'){
            dispatch(generateCoinsReport());
        }
    }, [channels.getAllMessagesState, channels.messages])

    if(channels.getAllMessagesState === 'loading') return <CustomLoader />

    return <>
            <Row>
                <Col style={{margin: 10}}><CustomButton onClick={() => { getCoins()}}>Get Coins Report</CustomButton></Col>
            </Row>
            <Row style={{marginTop: 10}}>
                <List
                    grid={{ gutter: 0, column: 4 }}
                    dataSource={channels.coinsReport}
                    renderItem={(item: ICoinReport) => (
                    <List.Item>
                        <Card
                            hoverable
                            style={{ width: 300 }}
                            //onClick={item.onClick}
                            //cover={<img alt="example" src={item.source_url} />}
                        >
                            <Meta title={item.name} description="" />
                            <Row>
                                <Space size={[0, 8]} wrap>
                                    Profits: <Tag color="#87d068">{item.takeProfitQuantity}</Tag>
                                    Profits: <Tag color="#87d068">{item.takeProfitQuantity}</Tag>
                                </Space>
                            </Row>
                        </Card>
                    </List.Item>
                    )}
                />
            </Row>
    </>;
}

export default Coins;