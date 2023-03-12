import { Button, Card, Col, Row, Space } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCategoryList, selectWputils } from "../../../../features/WPUtils/wputilsSlice";
import { createNewArticle } from "../../../../features/article/articleSlice";
import { removeDuplicate } from "../../../../utils/functions";
import { ISelectOptions } from "../../../CustomSelect/ICustomSelect";
import CustomSelectGroup from "../../../CustomSelectGroup";
import Droppable from "../Droppable";
import IPlanningArticles from "./IPlanningArticles";
import { INewPlanningArticle } from "../../../../interfaces/models/Article";
import { ArticleState } from "../../../../interfaces/Enums/States";

const PlanningArticles: React.FC<IPlanningArticles> = ({jobId, articles, keywords}) => {
    const dispatch = useAppDispatch();
    const { categories, statusc } = useAppSelector(selectWputils);
    const [category, setCategory] = useState('');

    useEffect(() => {
        dispatch(getCategoryList())
    },[])

    const categoryList: Array<ISelectOptions> = useMemo(() => {
        if(statusc === "loading") return []
        return categories.map(category => ({id: category.slug, name: category.name }))
    }, [categories, statusc])

    const createNewPlanningArticle = useCallback(() => {
        const article: INewPlanningArticle = {
            category: category,
            jobId: jobId ? parseInt(jobId) : 0,
            sysState: ArticleState.KEYWORD_PLANNING,
        };
        dispatch(createNewArticle(article))
    }, [category, jobId]);

    return <>
        <Row>
            <Col span={12}><CustomSelectGroup label="Category" onChange={(e) => {setCategory(e)}} items={categoryList} name="category_select" /></Col>
            <Col span={12}><Button type="primary" onClick={createNewPlanningArticle}>Create New</Button></Col>
        </Row>
        <Row>
            {articles.map((article) => {
                const dragged = keywords.filter(keyword => keyword.parent === article.id);
                return (
                    <Droppable key={article.id} id={article.id.toString()}>
                        <Card 
                            style={{margin: 20}} 
                            title={'title'}
                        >
                            {dragged ? removeDuplicate(dragged, 'id').map(keyword => <div key={keyword.id}>{keyword.component}</div>) : 'Drop here'}
                        </Card>
                    </Droppable>
                )
            })}
        </Row>
    </>
}

export default PlanningArticles;