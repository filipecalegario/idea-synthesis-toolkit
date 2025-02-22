
import React, { useState } from "react";
import { motion } from "framer-motion";

interface CombinationTableProps {
  categories: Array<{
    name: string;
    options: string[];
  }>;
  onCategoryEdit: (index: number, newName: string) => void;
  onOptionEdit: (categoryIndex: number, optionIndex: number, newValue: string) => void;
  selectedOptions: Record<number, number[]>;
  onOptionSelect: (categoryIndex: number, optionIndex: number) => void;
}

export const CombinationTable: React.FC<CombinationTableProps> = ({
  categories,
  onCategoryEdit,
  onOptionEdit,
  selectedOptions,
  onOptionSelect,
}) => {
  const [editingCell, setEditingCell] = useState<{ type: "category" | "option"; indices: number[] } | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleCellInteraction = (
    type: "category" | "option",
    categoryIndex: number,
    optionIndex: number | null,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const isDoubleClick = currentTime - lastClickTime < 300;
    setLastClickTime(currentTime);

    if (isDoubleClick) {
      // Handle double-click (edit mode)
      setEditingCell({
        type,
        indices: optionIndex !== null ? [categoryIndex, optionIndex] : [categoryIndex],
      });
    } else if (type === "option" && optionIndex !== null && !editingCell) {
      // Handle single-click (selection) only for options and when not in edit mode
      onOptionSelect(categoryIndex, optionIndex);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!editingCell) return;

    if (editingCell.type === "category") {
      onCategoryEdit(editingCell.indices[0], e.target.value);
    } else {
      onOptionEdit(editingCell.indices[0], editingCell.indices[1], e.target.value);
    }
    setEditingCell(null);
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
      <table className="w-full">
        <tbody>
          {categories.map((category, categoryIndex) => (
            <tr key={categoryIndex} className="border-b last:border-0">
              <td
                className="border-r p-3 font-medium editable-cell"
                onClick={(e) => handleCellInteraction("category", categoryIndex, null, e)}
              >
                {editingCell?.type === "category" && editingCell.indices[0] === categoryIndex ? (
                  <input
                    autoFocus
                    defaultValue={category.name}
                    onBlur={handleBlur}
                    className="w-full bg-transparent p-1 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  category.name
                )}
              </td>
              {category.options.map((option, optionIndex) => {
                const isSelected = selectedOptions[categoryIndex]?.includes(optionIndex);
                return (
                  <td
                    key={optionIndex}
                    className={`relative p-3 text-center transition-all duration-200 editable-cell ${
                      isSelected ? "cell-selected" : ""
                    }`}
                    style={{ width: `${100 / category.options.length}%` }}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={(e) => handleCellInteraction("option", categoryIndex, optionIndex, e)}
                    >
                      {editingCell?.type === "option" &&
                      editingCell.indices[0] === categoryIndex &&
                      editingCell.indices[1] === optionIndex ? (
                        <input
                          autoFocus
                          defaultValue={option}
                          onBlur={handleBlur}
                          className="w-full bg-transparent p-1 text-center outline-none"
                          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <motion.div
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.02 }}
                          className="transition-colors duration-200"
                        >
                          {option}
                        </motion.div>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
