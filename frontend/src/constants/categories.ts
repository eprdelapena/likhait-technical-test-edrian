/**
 * Expense category constants and types
 */

/**
 * Enum representing all possible expense categories
 * Can be used for type-safe comparisons and API requests
 */
export enum EExpenseCategory {
  Food = "Food",
  Transportation = "Transportation",
  Entertainment = "Entertainment",
  Shopping = "Shopping",
  Bills = "Bills",
  Healthcare = "Healthcare",
  Education = "Education",
  Travel = "Travel",
  Personal = "Personal",
  Other = "Other",
}

/**
 * Enum representing possible errors when creating an expense
 * Useful for consistent error handling in services and UI
 */
export enum ECreateExpenseError {
  CategoryMustExist = "Category must exist", // Error when selected category does not exist
  NetworkError = "Network error",           // Error for network or server failures
}

/**
 * Array of expense categories with IDs
 * Useful for populating dropdowns or storing category IDs in the database
 */
export const EXPENSE_CATEGORIES = [
  { id: 1, name: "Food" },
  { id: 2, name: "Transportation" },
  { id: 3, name: "Entertainment" },
  { id: 4, name: "Shopping" },
  { id: 5, name: "Bills" },
  { id: 6, name: "Healthcare" },
  { id: 7, name: "Education" },
  { id: 8, name: "Travel" },
  { id: 9, name: "Personal" },
  { id: 10, name: "Other" },
] as const; // "as const" ensures type safety and readonly properties

/**
 * Array of expense category names only
 * Useful for type-safe string comparisons and form validations
 */
export const EXPENSE_CATEGORIES2 = [
  "Food",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Bills",
  "Healthcare",
  "Education",
  "Travel",
  "Personal",
  "Other",
] as const;

/**
 * Type representing all possible expense category strings
 * Derived from EXPENSE_CATEGORIES2
 */
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES2)[number];