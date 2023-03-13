import React, {useEffect, useState} from 'react';
import {DndContext, DragEndEvent, DragStartEvent, UniqueIdentifier} from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';
import { Card, Col, List, Row } from 'antd';
import IKeywordsDragAndDrop, { IDragKeyword } from './IKeywordsDragAndDrop';
import { removeDuplicate, replaceSpace } from '../../../utils/functions';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getPlanningArticles, selectArticles } from '../../../features/articles/articlesSlice';
import PlanningArticles from './PlanningArticles';

const KeywordsDragAndDrop: React.FC<IKeywordsDragAndDrop> = (props) => {
  const [draggedKeyword, setDraggedKeyword] = useState<UniqueIdentifier>('');
  const [keywords, setKeywords] = useState<Array<IDragKeyword>>([]);
  const {planningArticles} = useAppSelector(selectArticles);
  const dispatch = useAppDispatch()

  const handleDragStart = (event: DragStartEvent) =>{
    setDraggedKeyword(event.active.id)
  }

  useEffect(() => {
    if(props.jobId) dispatch(getPlanningArticles(parseInt(props.jobId)))
  }, []);

  useEffect(() => {
    setKeywords(props.keywords.map(keyword => ({
            similarity: keyword.similarity,
            parent: keyword.articleId ? keyword.articleId : null,
            name: keyword.name,
            id: keyword.id,
            component: (
                <Draggable id={`${replaceSpace(keyword.name)}-${keyword.id}`} dbId={keyword.id}>{keyword.name}</Draggable>
            )
        })))
}, [props.keywords])

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Row>
            <Col span={10} style={{border: 'solid 1px #000'}}>
                {removeDuplicate(keywords, 'id').filter(keyword => keyword.parent === null).map((keyword) => <div key={keyword.id}>{keyword.component}</div>)}
            </Col>
            <Col span={14}>
              <PlanningArticles jobId={props.jobId} articles={planningArticles} keywords={keywords}/>
            </Col>
        </Row>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const {over} = event;
    const keyword = keywords.find(_keyword => `${replaceSpace(_keyword.name)}-${_keyword.id}` === draggedKeyword.toString())
    if(keyword){
      keyword.parent = over ? over.id : null;
      setKeywords([...keywords.filter(_keyword => _keyword.id != draggedKeyword), keyword])
    }
  }
};

export default KeywordsDragAndDrop;