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
