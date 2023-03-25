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
import { addRemoveKeywordFromArticle, selectKeywords } from '../../../features/keywords/keywordSlice';
import { toast } from 'react-toastify';

const KeywordsDragAndDrop: React.FC<IKeywordsDragAndDrop> = (props) => {
  const [draggedKeyword, setDraggedKeyword] = useState<UniqueIdentifier>('');
  const [keywords, setKeywords] = useState<Array<IDragKeyword>>([]);
  const {planningArticles} = useAppSelector(selectArticles);
  const articleKeyword = useAppSelector(selectKeywords);
  const dispatch = useAppDispatch()

  const handleDragStart = (event: DragStartEvent) =>{
    setDraggedKeyword(event.active.id)
  }

  useEffect(() => {
    if(props.jobId) dispatch(getPlanningArticles(parseInt(props.jobId)))
  }, []);

  useEffect(() => {
    if(articleKeyword.errorMessage !== "") toast(articleKeyword.errorMessage)
  }, [articleKeyword.errorMessage]);

  useEffect(() => {
    setKeywords(props.keywords.map(keyword => ({
            parent: keyword.articleId ? keyword.articleId : null,            
            component: (
                <Draggable id={`${replaceSpace(keyword.name)}-${keyword.id}`} dbId={keyword.id}>{keyword.name}</Draggable>
            ),
            ...keyword
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
      if(keyword.id) dispatch(addRemoveKeywordFromArticle({id: keyword.id.toString(), articleId: over ? over.id.toString() : null, orderNumber: over ? (articleKeyword.keywords.length + 1).toString() : null}))
    }else{
      const aKeyword = articleKeyword.keywords.find(_keyword => `${replaceSpace(_keyword.name)}-${_keyword.id}` === draggedKeyword.toString())
      if(aKeyword){
        if(aKeyword.id) dispatch(addRemoveKeywordFromArticle({id: aKeyword.id.toString(), articleId: null, orderNumber: null}))
      }
    }
  }
};

export default KeywordsDragAndDrop;