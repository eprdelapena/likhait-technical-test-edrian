import { ECreateExpenseError, EExpenseCategory } from "../../constants/categories";

/**
 * Parameters for fetching expenses from the API
 */
export type TGetExpenseParams = {
    year?: number;   // Optional filter: year of expenses, e.g. 2026
    month?: number;  // Optional filter: month of expenses, e.g. 6 (June)
}

/**
 * Represents an expense object returned by the API
 */
export type TExpense = {
    id: number;             // Expense ID assigned by the API
    description: string;    // Description of the expense, e.g. "Tutoring session"
    amount: number;         // Expense amount in PHP or chosen currency, e.g. 97.27
    category: string;       // Category name from API, e.g. "Education"
    date: string;           // Expense date in YYYY-MM-DD format, e.g. "2026-02-18"
    created_at: string;     // ISO timestamp when expense was created, e.g. "2026-02-18T00:00:00.000Z"
    updated_at: string;     // ISO timestamp of last update, e.g. "2026-02-18T00:00:00.000Z"
}

/**
 * Payload for creating a new expense via the API
 */
export type TCreateExpensePayload = {
    expense: {
        description: string;  // Expense description to send to API
        amount: number;       // Amount to send
        category_id: number;  // API category ID (numeric) corresponding to Category
        date: string;         // Expense date in YYYY-MM-DD
    }
}

/**
 * API response for a successfully created expense
 */
export type TCreateExpenseResponse = {
    id: number;                  // Expense ID assigned by API
    description: string;         // Description returned by API
    amount: number;              // Amount returned by API
    category: EExpenseCategory;  // Category name returned by API, type-safe enum
    date: string;                // Expense date in YYYY-MM-DD format
    created_at: string;          // ISO timestamp of creation
    updated_at: string;          // ISO timestamp of last update
}

/**
 * API error structure when creating an expense fails
 */
export type TCreateExpenseError = {
    errors: ECreateExpenseError[]; // Array of predefined error codes from constants
}

/**
 * Type used to represent validation errors in the frontend form
 */
export type TformErrorType = {
    amount?: string;        // Error message for amount field
    description?: string;   // Error message for description field
    category_id?: string;   // Error message for category field
    date?: string;          // Error message for date field
    general?: string;       // Generic error message for the form
}