import React, {useEffect, useState} from 'react';
import {DndContext, DragEndEvent, DragStartEvent, UniqueIdentifier} from '@dnd-kit/core';
import Draggable from './Draggable';
import Droppable from './Droppable';
import { Col, Row } from 'antd';
import { IDragKeyword } from './IKeywordsDragAndDrop';

const KeywordsDragAndDrop: React.FC = () => {
  const articles = ['1', '2', '3'];
  const [draggedKeyword, setDraggedKeyword] = useState<UniqueIdentifier>('');

  const [keywords, setKeywords] = useState<Array<IDragKeyword>>([{
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

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Row>
            <Col span={12}>
                {keywords.filter(keyword => keyword.parent === null).map((keyword) => <div key={keyword.id}>{keyword.component}</div>)}
            </Col>
            <Col span={12}>
                {articles.map((id) => {
                  const dragged = keywords.find(keyword => keyword.parent === id);
                  return (
                    <Droppable key={id} id={id}>
                      {dragged ? dragged.component : 'Drop here'}
                    </Droppable>
                )
                })}
            </Col>
        </Row>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const {over} = event;
    const keyword = keywords.find(_keyword => _keyword.id?.toString() === draggedKeyword.toString())
    if(keyword){
      keyword.parent = over ? over.id : null;
      setKeywords([...keywords.filter(_keyword => _keyword.id != draggedKeyword), keyword])
    }
  }
};

export default KeywordsDragAndDrop;