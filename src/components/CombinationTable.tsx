
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handleCellDoubleClick = (
    type: "category" | "option",
    categoryIndex: number,
    optionIndex: number | null,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setEditingCell({
      type,
      indices: optionIndex !== null ? [categoryIndex, optionIndex] : [categoryIndex],
    });
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
                onDoubleClick={(e) => handleCellDoubleClick("category", categoryIndex, null, e)}
              >
                {editingCell?.type === "category" && editingCell.indices[0] === categoryIndex ? (
                  <input
                    autoFocus
                    defaultValue={category.name}
                    onBlur={handleBlur}
                    className="w-full bg-transparent p-1 outline-none"
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
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
                    className={`relative p-3 text-center transition-all duration-200 editable-cell`}
                    style={{ width: `${100 / category.options.length}%` }}
                  >
                    <div className="absolute right-1 top-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onOptionSelect(categoryIndex, optionIndex)}
                      />
                    </div>
                    <div
                      className="cursor-text"
                      onDoubleClick={(e) => handleCellDoubleClick("option", categoryIndex, optionIndex, e)}
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
