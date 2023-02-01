import { useCallback, useEffect, useMemo, useState } from "react";
import { getHashCode } from '../../utils/functions';
import IKeyword from "../../interfaces/IKeyword"
import CustomTextArea from "../../Components/CustomTextArea";
import { Col, Row, Alert } from 'antd';
import "./keyword.css"
import { addCategory, addSubtitles, addTitle, getArticleByInternalId, selectArticle, setKewordsTranslated, translateKeywords } from "../../features/article/articleSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SubTitleContent } from "../../interfaces/models/Article";
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton"
import CustomInputGroup from "../../Components/CustomInputGroup";
import CustomSelectGroup from "../../Components/CustomSelectGroup";
import { getCategoryList, selectWputils } from "../../features/WPUtils/wputilsSlice";
import { ISelectOptions } from "../../Components/CustomSelect/ICustomSelect";
import CustomLoader from "../../Components/CustomLoader";


const Keywords = () => {

    const [error, setError] = useState<undefined|string>(undefined)
    const [title , setTitle] = useState('')
    const [keywords, setKeyWords] = useState<Array<IKeyword>>([
        { label: "Keyword number 1", text: "", id: getHashCode(), orderNumber: 0}
    ]);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const { article, kewordsTranslated, statusTk} = useAppSelector(selectArticle);
    const { categories, statusc } = useAppSelector(selectWputils);

    let { id } = useParams();

    useEffect(() => {
        if(id) dispatch(getArticleByInternalId(parseInt(id)))
        dispatch(getCategoryList())
        
        return () => {}
    }, []);

    useEffect(() => {
        const { subtitles } = article;
        if(subtitles.length > 0){
            dispatch(setKewordsTranslated(!(subtitles.find(subtitle => !subtitle.translatedName || subtitle.translatedName === ''))))
            setKeyWords(subtitles.map(
                (subtitle, index) => ({
                    id: subtitle.id,
                    label: `Keyword number ${index}`,
                    text: subtitle.name,
                    enText: subtitle.translatedName,
                    orderNumber: subtitle.orderNumber,
                })
            ))
        }else{
            dispatch(setKewordsTranslated(false))
            setKeyWords([
                { label: "Keyword number 1", text: "", id: getHashCode(), orderNumber: 0}
            ])
        }

        setTitle(article.title)
    }, [article])

    const categoryList: Array<ISelectOptions> = useMemo(() => {
        if(statusc === "loading") return []
        return categories.map(category => ({id: category.slug, name: category.name }))
    }, [categories, statusc])

    useEffect(() => {
        dispatch(addTitle(title))
    },[title]);

    const onChangeKeywords = (id: number, value: string) => {
        const { subtitles } = article;
        setError(undefined)
        const currentKeyword = keywords.find(keyword => keyword.id === id)
        if(!currentKeyword) return null;

        let hasLineBreak = /\r|\n/.exec(value);
        let _keywords = null;
        if (hasLineBreak) {
            _keywords = value.split(/\r|\n/).map((keyword, index) => ({ label: `Keyword number ${index+1}`, text: keyword, id: index+1, orderNumber: index}));
        }else{
            currentKeyword.text = value;
            _keywords = [...keywords.filter(keyword => keyword.id !== id), currentKeyword].sort((kA, kB) => (kA.orderNumber < kB.orderNumber ? -1 : 1))
        }

        setKeyWords([..._keywords.map(keyword => ({...keyword, enText: subtitles.find(subtitle => subtitle.id === keyword.id)?.translatedName}))])
        
        if(_keywords.length > 3) dispatch(addSubtitles(_keywords.map( (keyword, index) =>
            ({
                id: keyword.id,
                name: keyword.text,
                translatedName: subtitles.find(subtitle => subtitle.id === keyword.id)?.translatedName,
                orderNumber: index,
            })
        )))
    }

    const startSearchProcess = useCallback(() => {
        const { internalId } = article;
        if(!internalId || internalId === 0)
            return setError("the article must be created in db to start process.")

        navigate(`/content-editor/${article.internalId}`);
    }, [article]);

    const translateKeywordsAction = () => {
        const { subtitles, title, category } = article;

        if(subtitles.length < 4)
            return setError("Pleace add more than 3 keywords.")

        if(!title || title === "")
            return setError("Pleace add an article title.")

        if(!category || category === "")
            return setError("Pleace add an article category.")
        
        dispatch(translateKeywords(article))
    }

    const setCategoryToArticle = useCallback((category: string) => {
        dispatch(addCategory(category))
    }, [])


    if (statusc === 'loading') return <CustomLoader />

    return <>
        <Row gutter={16} className="keyword-rows">
            <Col span={13} className="gutter-row">
                <CustomInputGroup defaultValue={title} onChange={(e) => {setTitle(e.target.value); setError(undefined);}} name="article_title" label="Article Title"/>
            </Col>
            <Col span={8} className="gutter-row">
                <CustomSelectGroup label="Category" defaultValue={article.category} onChange={(e) => {setCategoryToArticle(e); setError(undefined);}} items={categoryList} name="category_select" />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                {keywords.map(keyword => {
                    return <Row key={`key-id-${keyword.id}`} className="keyword-input-group">
                        <Col span={4} className="keyword-label">
                            <label>{keyword.label}</label>
                        </Col>
                        <Col span={9}>
                            <CustomTextArea 
                                dataTestId={`test-id-${keyword.id}`}
                                onChange={(e) => onChangeKeywords(keyword.id, e.target.value)}
                                value={keyword.text}
                                label={keyword.label}
                                readOnly={false}
                                size="large"
                                rows={1}
                            />
                        </Col>
                        <Col span={9} className="keywords-translation">
                            <CustomInput
                                style={{fontSize: 11}}
                                dataTestId={`test-id-${keyword.id}`}
                                type="text"
                                onChange={() => {}}
                                value={keyword.enText}
                                label={`translation: ${keyword.label}`}
                                readOnly={!kewordsTranslated}
                            />
                        </Col>
                    </Row>
                })}
            </Col>
        </Row>
        <Row className="footer-actions">
            <Col span={12} className="keyword-label">
                {error && <Alert message={error} type="error" showIcon />}
            </Col>
            <Col className="actions-col" span={12}>
                <CustomButton key="translate-btn" className="action-btns" loading={statusTk === "loading"} disabled={kewordsTranslated} onClick={translateKeywordsAction}>Translate</CustomButton>
                <CustomButton key="start-btn" className="action-btns" disabled={!kewordsTranslated} onClick={startSearchProcess}>Search Content</CustomButton>
            </Col>
        </Row>
    </>;
}

export default Keywords;