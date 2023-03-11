import { DndContext, DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import KeywordsDragAndDrop from "../../Components/App/KeywordsDragAndDrop";
import Draggable from "../../Components/App/KeywordsDragAndDrop/Draggable";
import { IDragKeyword } from "../../Components/App/KeywordsDragAndDrop/IKeywordsDragAndDrop";
import KeywordsList from "../../Components/App/KeywordsList";
import { getSearchJobDetails, selectKeywordSearchJob } from "../../features/keywordSearchJob/keywordSearchJobSlice";
import IKeyword from "../../interfaces/models/Keyword";

const ArticlesPlanner = () => {
    let { id } = useParams();
    const [keywords, setKeywords] = useState<Array<IKeyword>>([])
    const [favsKeywords, setFavsKeywords] = useState<Array<IKeyword>>([])

    const dispatch = useAppDispatch();
    const { keywordSearchJob } = useAppSelector(selectKeywordSearchJob);

    const [draggedKeyword, setDraggedKeyword] = useState<UniqueIdentifier>('');
    const [dragKeywords, setDragKeywords] = useState<Array<IDragKeyword>>([{
        parent: null,
        name: "",
        id: 1,
        component: (
            <Draggable id="1">Drag me 1</Draggable>
        )
        }, 
        {
        parent: null,
        name: "",
        id: 2,
        component: (
            <Draggable id="2">Drag me 2</Draggable>
        )
        }
    ]);

    const handleDragStart = (event: DragStartEvent) =>{
        setDraggedKeyword(event.active.id)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {over} = event;
        const keyword = dragKeywords.find(_keyword => _keyword.id?.toString() === draggedKeyword.toString())
        if(keyword){
            keyword.parent = over ? over.id : null;
            setKeywords([...keywords.filter(_keyword => _keyword.id != draggedKeyword), keyword])
        }
    }

    useEffect(() => {
        if(id) dispatch(getSearchJobDetails(parseInt(id)));
        return () => {}
    },[]);

    useEffect(() => {
        if(keywordSearchJob && keywordSearchJob.keywords) setKeywords(keywordSearchJob.keywords)
    }, [keywordSearchJob])

    return <>
        <h2>Articles Planner {id}</h2>
        <Row className="">
            <Col span={7} style={{border: 'solid 1px #000'}}>
                <KeywordsList items={keywords} setFavsKeywords={setFavsKeywords}/>
            </Col>
            <Col span={17} className="drag-and-drop" style={{border: 'solid 1px #000'}}>
                <KeywordsDragAndDrop keywords={favsKeywords}/>
            </Col>
        </Row>
    </>;
}

export default ArticlesPlanner;