import { Button, Col, Row, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getCategoryList, selectWputils } from "../../../../features/WPUtils/wputilsSlice";
import { createNewArticle } from "../../../../features/article/articleSlice";
import { ISelectOptions } from "../../../CustomSelect/ICustomSelect";
import CustomSelectGroup from "../../../CustomSelectGroup";
import IPlanningArticles from "./IPlanningArticles";
import { INewPlanningArticle } from "../../../../interfaces/models/Article";
import { ArticleState } from "../../../../interfaces/Enums/States";
import { toast } from "react-toastify";
import CustomButton from "../../../CustomButton";
import ArticleStep from "./ArticleStep";

const PlanningArticles: React.FC<IPlanningArticles> = ({jobId, articles, keywords}) => {
    const dispatch = useAppDispatch();
    const { categories, statusc } = useAppSelector(selectWputils);
    const [category, setCategory] = useState('');
    const { token } = theme.useToken();
    const [currentArticle, setCurrentArticle] = useState<number>(0)
    const [artclesSteps, setArticleSteps] = useState<Array<any>>([]);

    useEffect(() => {
        dispatch(getCategoryList())
    },[])

    useEffect(() => {
        setArticleSteps(articles.map(
            article => ({
                id: article.id,
                article,
                component: () => <ArticleStep article={article} key={article.id}/>
            })
        ))
    }, [articles, keywords]);

    const categoryList: Array<ISelectOptions> = useMemo(() => {
        if(statusc === "loading") return []
        return categories.map(category => ({id: category.name, name: category.name }))
    }, [categories, statusc]);

    const contentStyle: React.CSSProperties = {
        //lineHeight: '260px',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px ${token.colorBorder}`,
        margin: 16,
        paddingBottom: 16,
        width: '100%'
    };

    const createNewPlanningArticle = useCallback(() => {
        if(category === ''){
            return toast('Pleace provide a category')
        }
        const article: INewPlanningArticle = {
            category: category,
            jobId: jobId ? parseInt(jobId) : 0,
            sysState: ArticleState.KEYWORD_PLANNING,
            title: "Titulo no definido"
        };
        dispatch(createNewArticle(article))
        return toast('Created!')
    }, [category, jobId]);

    return <>
        <Row>
            <Col span={12}><CustomSelectGroup label="" placeholder="Category" onChange={(e) => {setCategory(e)}} items={categoryList} name="category_select" /></Col>
            <Col span={6}><Button type="primary" onClick={createNewPlanningArticle}>Create New</Button></Col>
            <Col span={6}><h1>{articles.length}</h1></Col>
        </Row>
        <Row>
            <div style={contentStyle}>
                {artclesSteps[currentArticle]?.component()}
                <CustomButton disabled={currentArticle === 0} onClick={() => {setCurrentArticle(currentArticle-1)}}>Previews</CustomButton>
                <CustomButton disabled={artclesSteps.length === (currentArticle+1)} onClick={() => {setCurrentArticle(currentArticle+1)}}>Next</CustomButton>
            </div>
        </Row>
        <Row>
            
        </Row>
    </>
}

export default React.memo(PlanningArticles);