import { useEffect, useState } from "react";
import CustomInput from "../../Components/CustomInput";
import { getHashCode } from '../../utils/functions';
import IKeyword from "../../interfaces/IKeyword"
import CustomTextArea from "../../Components/CustomTextArea";
import { Col, Row } from 'antd';
import "./keyword.css"

const Keywords = () => {

    const [keywords, setKeyWords] = useState<Array<IKeyword>>([
        { label: "Keyword number 1", text: "", id: getHashCode()}
    ]);

    const onChangeKeywords = (id: number, value: string) => {
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
    </>;
}

export default Keywords;