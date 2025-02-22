
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
                    onClick={() => onOptionSelect(categoryIndex, optionIndex)}
                    className={`relative p-3 text-center transition-all duration-200 cursor-pointer hover:bg-accent ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                    style={{ width: `${100 / category.options.length}%` }}
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isSelected ? 1 : 0 }}
                      className="absolute right-2 top-2"
                    >
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
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
