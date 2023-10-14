import { useState, useRef, useEffect, FC, ReactElement, KeyboardEvent  } from "react";
import Mention from "./Mention";
import "./Mention.css";

type ChildProps = {
  placeholder: string,
  onChange: (updatedText:string)=>void,
  data: string[],
  mentionsInputStyle?: { [key:string]: string},
  mentionStyle?:{ [key:string]: string}
}
const MentionsInput: FC<ChildProps> = ({ placeholder, onChange, data, mentionsInputStyle={},mentionStyle={} }):ReactElement => {
  const [mentionSuggestions, setMentionSuggestions] = useState([] as string[]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const contentEditableRef = useRef(null);

  const handleInputChange = () => {
    const element = contentEditableRef.current as HTMLDivElement | null
    const text = element?.textContent || "";
    const lastWord = text.trim().split(/\s/).slice(-1)[0];

    if (lastWord.startsWith("@")) {
      const typedText = lastWord.substring(1);
      const filteredSuggestions:string[] = data.filter((mention) =>
        mention.toLowerCase().includes(typedText.toLowerCase())
      );
      setMentionSuggestions(filteredSuggestions);
      setSelectedSuggestionIndex(0);
    } else {
      setMentionSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
    onChange(text);
  };

  const handleKeyDown = (e:KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, mentionSuggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && selectedSuggestionIndex !== -1) {
      e.preventDefault();
      handleMentionSelect(mentionSuggestions[selectedSuggestionIndex]);
    }
  };

  const handleMentionSelect = (mention:string) => {
    const text = contentEditableRef.current as HTMLDivElement | null;
    if (text) {
      const words = text.innerHTML?.split(/\s/) || [];
      const newTag = `<span class="selected-mention" contenteditable="false">@${mention}</span>`;
      words[words.length - 1] = newTag;
      text.innerHTML = words.join(" ");
    }
    setMentionSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  useEffect(() => {
    // Set the cursor position to the end after each render
    const text = contentEditableRef.current;
    if (text) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(text);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });

  return (
    <div>
      <div className="container">
        <div
          ref={contentEditableRef}
          placeholder={placeholder}
          className="content-editable"
          contentEditable
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{...mentionsInputStyle}}
        ></div>
        {mentionSuggestions.length > 0 && (
          <div className="mention-suggestions">
            {mentionSuggestions.map((mention, index) => (
              <Mention
                key={mention}
                mention={mention}
                onClick={() => handleMentionSelect(mention)}
                isSelected={index === selectedSuggestionIndex}
                mentionStyle={{...mentionStyle}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentionsInput;
