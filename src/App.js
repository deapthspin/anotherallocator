import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {v4 as uuid} from 'uuid'
import './App.css'
const itemsFromBackend = [
  {id: uuid(), content: 'first task'},
  {id: uuid(), content: 'second task'},
  {id: uuid(), content: 'third task'},
  {id: uuid(), content: 'fourth task'},
  {id: uuid(), content: 'fifth task'},
  {id: uuid(), content: 'sixth task'},
]


const columnsFromBackend = localStorage.getItem('columnData') ? JSON.parse(localStorage.getItem('columnData')) : {
    [uuid()]: {
      name: 'Monday',
      items: itemsFromBackend
    },
    [uuid()]: {
      name: 'Tuesday',
      items: []
    },
    [uuid()]: {
      name: 'Wednesday',
      items: []
    },
    [uuid()]: {
      name: 'Thursday',
      items: []
    },
    [uuid()]: {
      name: 'Friday',
      items: []
    },
    [uuid()]: {
      name: 'Saturday',
      items: []
    },
    [uuid()]: {
      name: 'Sunday',
      items: []
    },
    [uuid()]: {
      name: 'Delete',
      items: []
    },
}

console.log(JSON.parse(localStorage.getItem('columnData')), columnsFromBackend)

const onDragEnd = (result, columns, setColumns) => {
  if(!result.destination) return;
  if (columns[result.destination.droppableId].name === 'Delete') {
    const { source, destination } = result
    const sourceColumn = columns[source.droppableId]
    const sourceItems = sourceColumn.items
    sourceItems.splice(source.index, 1)
    console.log(sourceItems)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      }
    })
  } else {
    const { source, destination } = result
    // console.log(source, destination)
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })
    } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    })
    }
  }
  
}



function App() {
  const [columns, setColumns] = useState(columnsFromBackend)

  function handleAddBlock(e) {
    const name = window.prompt('create a block')
    if (!name) {
      return;
    } else {
      const column = columns[e.target.id]
      const copiedItems = [...column.items]
      copiedItems.push({id: uuid(), content: name})

      setColumns({
        ...columns,
        [e.target.id]: {
          ...column,
          items: copiedItems
        }
      })
    }

  }

  useEffect(() => {
    localStorage.setItem('columnData', JSON.stringify(columns))
  }, [columns])

  return (
    <div style={{ display: 'flex', justifyContent:'center', height: '100%'}}>
      <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([id, column]) => {
          return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                {columns[id].name !== 'Delete' && <button className='addBlockButton' onClick={handleAddBlock} id={id}>add</button>}
                <Droppable droppableId={id} key={id}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                          padding: 4,
                          width: 250,
                          minHeight: 500,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: 'none',
                                      padding: 16,
                                      margin: '0 0 8px 0',
                                      minHeight: '50px',
                                      backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
                                      color: 'white',
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    {item.content}
                                  </div>
                                )
                              }}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </div>
            </div>
          )
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
