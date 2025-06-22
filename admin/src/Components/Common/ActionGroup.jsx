import React from "react";
import ActionButton from "./ActionButton";

const ActionGroup = ({ actions, item, spacing = "space-x-1" }) => {
  return (
    <div className={`flex items-center ${spacing}`}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          onClick={() => action.onClick(item)}
          icon={action.icon}
          title={action.title}
          variant={action.variant}
          disabled={action.disabled}
          size={action.size}
        />
      ))}
    </div>
  );
};

export default ActionGroup;