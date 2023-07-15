import { useMemo } from "react";
import { Card, List } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";

const CryptoHome = () => {
    const navigate = useNavigate()

    const options = useMemo(() => [
        {title: "Infinity Signals Long Term", onClick: () => {navigate('/crypto/channel/channel1617718235/coins')}},
        {title: "Infinity Signals High Leverage", onClick: () => {navigate('/crypto/channel/channel1622365719/coins')}}
    ], [])

    return <>
            <List
                grid={{ gutter: 0, column: 4 }}
                dataSource={options}
                renderItem={(item) => (
                <List.Item>
                    <Card
                        hoverable
                        style={{ width: 300 }}
                        onClick={item.onClick}
                        //cover={<img alt="example" src={item.source_url} />}
                    >
                        <Meta title={item.title} description="" />
                    </Card>
                </List.Item>
                )}
            />
    </>;
}

export default CryptoHome;