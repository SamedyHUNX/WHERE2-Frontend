import React, { useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import AccordionButton from "./AccordionButton";

function Accordion({ items, applyFilter }) {
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const handleClick = (nextIndex) => {
    setExpandedIndex(expandedIndex === nextIndex ? -1 : nextIndex);
  };

  const renderItems = items.map((item, index) => {
    const isExpanded = index === expandedIndex;
    const icon = isExpanded ? <GoChevronUp /> : <GoChevronDown />;
    return (
      <div key={item.id}>
        <div
          className="flex justify-between p-3 h-[80px] items-center cursor-pointer"
          onClick={() => handleClick(index)}
        >
          {item.label}
          <span>{icon}</span>
        </div>
        {isExpanded && Array.isArray(item.content) && (
          <div className="md:w-[300px] flex flex-col md:flex-row p-2 overflow-x-auto">
            {item.content.map((contentItem, contentIndex) => (
              <AccordionButton
                key={contentIndex}
                contentItem={contentItem}
                applyFilter={() => applyFilter(item.label ==='Major'?{major:contentItem}:item.label === 'Location'?{location:contentItem}:{price:contentItem})}
              />
            ))}
          </div>
        )}
      </div>
    );
  });

  return <div className="rounded">{renderItems}</div>;
}

export default Accordion;
