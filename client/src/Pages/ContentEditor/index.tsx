import { Card, Skeleton, Row } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectArticle } from "../../features/article/articleSlice"
import { selectKeyword } from "../../features/keyword/keywordSlice";

const ContentEditor = () => {
    const [loading, setLoading ] = useState(true);

    const article = useAppSelector(selectArticle);
    const keyword = useAppSelector(selectKeyword);
    const dispatch = useAppDispatch();

    useEffect(() => {
        //dispatch(getKeywordsContent(article.article))
    }, []);

    return <>
        <Row className="">
            {article.article.subtitles.map((subtitle, index) => <Card
                key={subtitle.id}
                style={{ width: '100%', marginTop: 16 }}
            >
                <Skeleton loading={loading} avatar={(index === 1 || index === 3) ? {shape: "square", size: 100} : false} active />
            </Card>)}
        </Row>
    </>;
}

export default ContentEditor;