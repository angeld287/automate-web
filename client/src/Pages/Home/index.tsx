import { useEffect, useMemo } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setModule } from "../../features/userSession/userSessionSlice";
import { Card, List } from "antd";
import Meta from "antd/es/card/Meta";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const options = useMemo(() => [
        {title: "SEO", onClick: () => {navigate('/site/home')}},
        {title: "CRYPTO", onClick: () => {navigate('')}}
    ], [])

    useEffect(() => {
        dispatch(setModule(null))
    }, [])
    return <>
            <List
                grid={{ gutter: 0, column: 4 }}
                dataSource={options}
                renderItem={(item) => (
                <List.Item>
                    <Card
                        hoverable
                        style={{ width: 240 }}
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

export default Home;