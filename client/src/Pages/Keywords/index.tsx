import { useCallback, useEffect, useMemo, useState } from "react";
import { getHashCode } from '../../utils/functions';
import IKeyword from "../../interfaces/IKeyword"
import CustomTextArea from "../../Components/CustomTextArea";
import { Col, Row, Alert } from 'antd';
import "./keyword.css"
import { addCategory, addSubtitles, addTitle, getArticleByInternalId, selectArticle, setArticleInititalState, translateKeywords } from "../../features/article/articleSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IArticle, SubTitleContent } from "../../interfaces/models/Article";
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton"
import CustomInputGroup from "../../Components/CustomInputGroup";
import CustomSelect from "../../Components/CustomSelect"
import CustomSelectGroup from "../../Components/CustomSelectGroup";
import { getCategoryList, selectWputils } from "../../features/WPUtils/wputilsSlice";
import { ISelectOptions } from "../../Components/CustomSelect/ICustomSelect";
import CustomLoader from "../../Components/CustomLoader";


const Keywords = () => {

    const [error, setError] = useState<undefined|string>(undefined)
    const [translated, setTranslated] = useState(false)
    const [title , setTitle] = useState('')
    const [keywords, setKeyWords] = useState<Array<IKeyword>>([
        { label: "Keyword number 1", text: "", id: getHashCode()}
    ]);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const { article, kewordsTranslated, statusTk} = useAppSelector(selectArticle);
    const { categories, statusc } = useAppSelector(selectWputils);

    let { id } = useParams();

    useEffect(() => {
        if(id) dispatch(getArticleByInternalId(parseInt(id)))
        dispatch(getCategoryList())
        return () => {
            dispatch(setArticleInititalState())
        }
    }, []);

    useEffect(() => {
        setTranslated(kewordsTranslated)
    }, [kewordsTranslated]);

    useEffect(() => {
        if(article.subtitles.length > 0){
            setKeyWords(article.subtitles.map(
                (subtitle, index) => ({
                    id: subtitle.id,
                    label: `Keyword number ${index}`, 
                    text: subtitle.name,
                    enText: subtitle.translatedName
                })
            ))
        }else{
            setKeyWords([
                { label: "Keyword number 1", text: "", id: getHashCode()}
            ])
        }
        setTitle(article.title)
    }, [article])

    //const statusIsNext = (article: IArticle) : boolean => {
    //    if(article.subtitles.length > 3 && !article.subtitles.find(subtitle => subtitle.translatedName === '' || !subtitle.translatedName)){
    //        console.log('navega a content editor')
    //        //navigate(`/content-editor/${article.internalId}`)
    //        return true;
    //    }
    //    return false;
    //}

    const subTitles: Array<SubTitleContent> = useMemo(() => keywords.map( keyword =>
        ({
            id: keyword.id,
            name: keyword.text,
            translatedName: keyword.enText,
        })
    ), [keywords]);

    const categoryList: Array<ISelectOptions> = useMemo(() => {
        if(statusc === "loading") return []
        return categories.map(category => ({id: category.slug, name: category.name }))
    }, [categories])

    useEffect(() => {
        if(subTitles.length > 3) dispatch(addSubtitles(subTitles))
    },[subTitles]);

    useEffect(() => {
        dispatch(addTitle(title))
    },[title]);

    const onChangeKeywords = (id: number, value: string) => {
        const { subtitles, title, category } = article;
        setError(undefined)
        const currentKeyword = keywords.find(keyword => keyword.id === id)
        if(!currentKeyword) return null;

        var hasLineBreak = /\r|\n/.exec(value);
        if (hasLineBreak) {
            const _keywords = value.split(/\r|\n/).map((keyword, index) => ({ label: `Keyword number ${index+1}`, text: keyword, id: index+1}));
            setKeyWords([..._keywords.map(keyword => ({...keyword, enText: subtitles.find(subtitle => subtitle.id === keyword.id)?.translatedName}))])
        }else{
            currentKeyword.text = value;
            const _keywords = [...keywords.filter(keyword => keyword.id !== id), currentKeyword]
            setKeyWords([..._keywords.map(keyword => ({...keyword, enText: subtitles.find(subtitle => subtitle.id === keyword.id)?.translatedName}))]);
        }
    }

    const startSearchProcess = () => {
        navigate('/content-editor');
    }

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
                <CustomInputGroup defaultValue={title} onChange={(e) => {setTitle(e.target.value)}} name="article_title" label="Article Title"/>
            </Col>
            <Col span={8} className="gutter-row">
                <CustomSelectGroup label="Category" defaultValue={article.category} onChange={(e) => {setCategoryToArticle(e)}} items={categoryList} name="category_select" />
            </Col>
        </Row>
        <Row>
            <Col span={24}>
                {keywords.sort((keyword_a, keyword_b) => (keyword_a.id < keyword_b.id ? -1 : 1)).map(keyword => {
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
                                readOnly={!translated}
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
                <CustomButton _key="translate-btn" className="action-btns" loading={statusTk === "loading"} disabled={translated} onClick={translateKeywordsAction}>Translate</CustomButton>
                <CustomButton _key="start-btn" className="action-btns" disabled={!translated} onClick={startSearchProcess}>Start</CustomButton>
            </Col>
        </Row>
    </>;
}

export default Keywords;