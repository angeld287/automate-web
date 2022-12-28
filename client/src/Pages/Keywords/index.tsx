import { useState } from "react";
import { getHashCode } from '../../utils/functions';
import IKeyword from "../../interfaces/IKeyword"
import CustomTextArea from "../../Components/CustomTextArea";
import { Col, Row, Alert } from 'antd';
import "./keyword.css"
import CustomButton from "../../Components/CustomButton";
import { addSubtitles } from "../../features/article/articleSlice";
import { useAppDispatch } from "../../app/hooks";
import { SubTitleContent } from "../../interfaces/models/Article";

const Keywords = () => {

    const [error, setError] = useState<undefined|string>(undefined)
    const [keywords, setKeyWords] = useState<Array<IKeyword>>([
        { label: "Keyword number 1", text: "", id: getHashCode()}
    ]);

    const dispatch = useAppDispatch();

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
        if(keywords.length < 4){
            return setError("Pleace add more than 3 keywords.")
        }

        const subTitles: Array<SubTitleContent> = keywords.map( keyword =>
            ({
                name: keyword.text,
                translatedName: "",
            })
        )

        dispatch(addSubtitles(subTitles))
    }


    return <>
        {keywords.sort((keyword_a, keyword_b) => (keyword_a.id < keyword_b.id ? -1 : 1)).map(keyword => {
            return <Row key={`key-id-${keyword.id}`} className="keyword-input-group">
                <Col span={4} className="keyword-label">
                    <label>{keyword.label}</label>        
                </Col>
                <Col span={12}>
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
            </Row>
        })}
        <Row className="footer-actions">
            <Col span={12} className="keyword-label">
                {error && <Alert message={error} type="error" showIcon />}
            </Col>
            <Col span={4}>
                <CustomButton onClick={startSearchProcess}>Start</CustomButton>
            </Col>
        </Row>
    </>;
}

export default Keywords;