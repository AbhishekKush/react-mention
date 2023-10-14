 import { FC, ReactElement } from "react"
type ChildProps  = {
  mention:string,
  onClick: ()=>void
  isSelected: boolean
  mentionStyle?:{ [key:string]: string}
}
const Mention : FC<ChildProps> = ({ mention, onClick, isSelected, mentionStyle={} }):ReactElement => {
  return (
    <div
      onClick={onClick}
      style={{...mentionStyle}}
      className={isSelected ? "selected" : ""}
    >
      {mention}
    </div>
  );
};

export default Mention;
