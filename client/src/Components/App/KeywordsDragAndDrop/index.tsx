import React, {useState} from 'react';
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

  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const draggableMarkup = (
    <Draggable id="draggable">Drag me</Draggable>
  );

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

                  return (
                    <Droppable key={id} id={id}>
                      {parent === id ? draggableMarkup : 'Drop here'}
                    </Droppable>
                )
                })}
            </Col>
        </Row>
    </DndContext>
  );

  function handleDragEnd(event: DragEndEvent) {
    const {over} = event;
    if(over){
      const keyword = keywords.find(k => k.id === draggedKeyword)
      if(keyword){
        keyword.parent = over.id;
      }
    }
  }
};

export default KeywordsDragAndDrop;