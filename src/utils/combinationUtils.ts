
import { Category } from "@/types/categories";

export const parseTextInput = (input: string): Category[] => {
  const lines = input.trim().split("\n");
  return lines
    .map((line) => {
      const [name, optionsStr] = line.split(":");
      if (!name || !optionsStr) return null;
      const options = optionsStr
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt);
      return { name: name.trim(), options };
    })
    .filter((cat): cat is Category => cat !== null && cat.options.length > 0);
};

export const generateCombination = (
  categories: Category[],
  selectedOptions: Record<number, number[]>
): string => {
  return categories
    .map((cat, index) => {
      const selectedIndices = selectedOptions[index] || [];
      return selectedIndices.length > 0
        ? `${cat.name}: ${selectedIndices.map(idx => cat.options[idx]).join(", ")}`
        : null;
    })
    .filter(Boolean)
    .join(" | ");
};
