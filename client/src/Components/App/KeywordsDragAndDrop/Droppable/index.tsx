import { useDroppable } from "@dnd-kit/core";
import IDroppable from "./IDroppable";

const Droppable: React.FC<IDroppable> = ({ id, children }) => {
    const {isOver, setNodeRef} = useDroppable({
        id: id,
      });
    const style = {
        color: isOver ? 'green' : undefined,
    };
    return <div ref={setNodeRef} style={style}>
    {children}
  </div>;
}

export default Droppable;