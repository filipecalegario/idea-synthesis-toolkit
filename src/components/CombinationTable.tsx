
import React from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";

interface CombinationTableProps {
  categories: Array<{
    name: string;
    options: string[];
  }>;
  selectedOptions: Record<number, number[]>;
  onOptionSelect: (categoryIndex: number, optionIndex: number) => void;
}

export const CombinationTable: React.FC<CombinationTableProps> = ({
  categories,
  selectedOptions,
  onOptionSelect,
}) => {
  const handleCheckboxChange = (categoryIndex: number, optionIndex: number, checked: boolean) => {
    onOptionSelect(categoryIndex, optionIndex);
  };

  return (
    <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
      <table className="w-full">
        <tbody>
          {categories.map((category, categoryIndex) => (
            <tr key={categoryIndex} className="border-b last:border-0">
              <td className="border-r p-3 font-medium">
                {category.name}
              </td>
              {category.options.map((option, optionIndex) => {
                const isSelected = selectedOptions[categoryIndex]?.includes(optionIndex);
                return (
                  <td
                    key={optionIndex}
                    className={`relative p-3 text-center transition-all duration-200 ${
                      isSelected ? "cell-selected" : ""
                    }`}
                    style={{ width: `${100 / category.options.length}%` }}
                  >
                    <div className="absolute right-1 top-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleCheckboxChange(categoryIndex, optionIndex, checked as boolean)}
                        className="hover:border-primary"
                      />
                    </div>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="transition-colors duration-200"
                    >
                      {option}
                    </motion.div>
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
