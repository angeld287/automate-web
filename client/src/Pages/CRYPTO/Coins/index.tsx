import { useCallback, useEffect, useMemo } from "react";
import { Card, Col, List, Row, Space, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { generateCoinsReport, getAllChannelMessages, selectChannel } from "../../../features/channels/channelsSlice";
import CustomLoader from "../../../Components/CustomLoader";
import { ICoinReport } from "../../../interfaces/models/Crypto/Message";
import CustomButton from "../../../Components/CustomButton";
import CoinsPieReport from "../../../Components/Reports/CoinsPieReport";

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
                    grid={{ gutter: 0, column: 3 }}
                    dataSource={channels.coinsReport}
                    renderItem={(item: ICoinReport) => (
                    <List.Item>
                        <Card
                            //hoverable
                            style={{ width: 400 }}
                            //onClick={item.onClick}
                            //cover={<img alt="example" src={item.source_url} />}
                        >
                            <Meta title={item.name} description="" />
                            <CoinsPieReport {...item}/>
                            <Row>Total: {item.openSignalQuantity} |
                                {parseFloat((item.takeProfitQuantity && item.openSignalQuantity ? item.takeProfitQuantity/item.openSignalQuantity : '0').toString(), ).toFixed(1)} target(s) per operations
                            </Row>
                        </Card>
                    </List.Item>
                    )}
                />
            </Row>
    </>;
}

export default Coins;