import { useEffect, useMemo, useState } from "react";
import { getHashCode } from '../../utils/functions';
import IKeyword from "../../interfaces/IKeyword"
import CustomTextArea from "../../Components/CustomTextArea";
import { Col, Row, Alert } from 'antd';
import "./keyword.css"
import { addSubtitles, getArticleByInternalId, selectArticle, setInititalState, translateKeywords } from "../../features/article/articleSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IArticle, SubTitleContent } from "../../interfaces/models/Article";
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton"


const Keywords = () => {

    const [error, setError] = useState<undefined|string>(undefined)
    const [translated, setTranslated] = useState(false)
    const [keywords, setKeyWords] = useState<Array<IKeyword>>([
        { label: "Keyword number 1", text: "", id: getHashCode()}
    ]);

    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const article = useAppSelector(selectArticle);

    let { id } = useParams();

    useEffect(() => {
        if(id) dispatch(getArticleByInternalId(parseInt(id)))
        return () => {
            dispatch(setInititalState())
        }
    }, []);

    useEffect(() => {
        if(!statusIsNext(article.article)){
            setKeyWords([...keywords.map(keyword => ({...keyword, enText: article.article.subtitles.find(subtitle => subtitle.id === keyword.id)?.translatedName}))])
            setTranslated(article.kewordsTranslated)
        }
    }, [article]);

    const statusIsNext = (article: IArticle) : boolean => {
        if(article.subtitles.length > 3 && !article.subtitles.find(subtitle => subtitle.translatedName === '' || !subtitle.translatedName)){
            console.log('navega a content editor')
            //navigate(`/content-editor/${article.internalId}`)
            return true;
        }

        return false;
    }

    const subTitles: Array<SubTitleContent> = useMemo(() => keywords.map( keyword =>
        ({
            id: keyword.id,
            name: keyword.text,
            translatedName: keyword.enText,
        })
    ), [keywords]);

    useEffect(() => {
        if(subTitles.length > 3) dispatch(addSubtitles(subTitles))
    },[subTitles]);

    const onChangeKeywords = (id: number, value: string) => {
        setError(undefined)
        const currentKeyword = keywords.find(keyword => keyword.id === id)
        if(!currentKeyword) return null;

        var hasLineBreak = /\r|\n/.exec(value);
        if (hasLineBreak) {
            setKeyWords(value.split(/\r|\n/).map((keyword, index) => ({ label: `Keyword number ${index+1}`, text: keyword, id: index+1})))
        }else{
            currentKeyword.text = value;
            setKeyWords([...keywords.filter(keyword => keyword.id !== id), currentKeyword]);
        }
    }

    const startSearchProcess = () => {
        navigate('/content-editor');
    }

    const translateKeywordsAction = () => {
        if(article.article.subtitles.length < 4){
            return setError("Pleace add more than 3 keywords.")
        }
        dispatch(translateKeywords(article.article))
    }


    return <>
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
        <Row className="footer-actions">
            <Col span={12} className="keyword-label">
                {error && <Alert message={error} type="error" showIcon />}
            </Col>
            <Col className="actions-col" span={12}>
                <CustomButton _key="translate-btn" className="action-btns" loading={article.statusTk === "loading"} disabled={translated} onClick={translateKeywordsAction}>Translate</CustomButton>
                <CustomButton _key="start-btn" className="action-btns" disabled={!translated} onClick={startSearchProcess}>Start</CustomButton>
            </Col>
        </Row>
    </>;
}

export default Keywords;