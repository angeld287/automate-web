import React, {useEffect, useState} from 'react';
import {DndContext, DragEndEvent, DragStartEvent, UniqueIdentifier} from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';
import { Card, Col, List, Row } from 'antd';
import IKeywordsDragAndDrop, { IDragKeyword } from './IKeywordsDragAndDrop';
import { replaceSpace } from '../../../utils/functions';

const KeywordsDragAndDrop: React.FC<IKeywordsDragAndDrop> = (props) => {
  const articles = ['1', '2', '3'];
  const [draggedKeyword, setDraggedKeyword] = useState<UniqueIdentifier>('');

  const [keywords, setKeywords] = useState<Array<IDragKeyword>>([]);

  const handleDragStart = (event: DragStartEvent) =>{
    setDraggedKeyword(event.active.id)
  }

  useEffect(() => {
    setKeywords(props.keywords.map(keyword => ({
            parent: null,
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
            <Col span={12}>
                {keywords.filter(keyword => keyword.parent === null).map((keyword) => <div key={keyword.id}>{keyword.component}</div>)}
            </Col>
            <Col span={12}>
                {articles.map((id) => {
                  const dragged = keywords.filter(keyword => keyword.parent === id);
                  return (
                    <Droppable key={id} id={id}>
                        <Card 
                            style={{margin: 20}} 
                            title={'title'}
                        >
                            {dragged ? dragged.map(keyword => <div key={keyword.id}>{keyword.component}</div>) : 'Drop here'}
                        </Card>
                    </Droppable>
                )
                })}
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