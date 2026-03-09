import { TCreateExpensePayload } from "./types";

/**
 * Format a Date object into a string in the format YYYY-MM-DD
 * @param date - Date object to format
 * @returns formatted date string
 */
function formatDate(date: Date): string {
    const year = date.getFullYear(); // Get full year (e.g., 2026)
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad with 0
    const day = String(date.getDate()).padStart(2, "0"); // Get day of month and pad with 0
    return `${year}-${month}-${day}`; // Return formatted string e.g., "2026-03-09"
}

/**
 * Returns an initial, default form data object for creating a new expense
 * Uses Partial type to allow optional fields
 */
const initialFormData = (): Partial<TCreateExpensePayload["expense"]> => {
    return {
        description: "", // Default empty description
        amount: 0,       // Default amount set to 0
        category_id: 1,  // Default category ID (1 as placeholder)
        date: UtilsExpense.formatDate(new Date()), // Default date is today in YYYY-MM-DD format
    }
}

/**
 * Updates the browser URL with given year and month as query parameters
 * Does not reload the page, uses history API
 * @param year - numeric year (e.g., 2026)
 * @param month - numeric month (1-12)
 */
const updateURL = (year: number, month: number) => {
    const params = new URLSearchParams(); // Create a new URLSearchParams object
    params.set("year", year.toString());  // Set 'year' parameter
    params.set("month", month.toString()); // Set 'month' parameter
    const newURL = `${window.location.pathname}?${params.toString()}`; // Combine pathname and query
    window.history.pushState({}, "", newURL); // Update URL in browser without page reload
};

/**
 * Format a number into a currency string with 2 decimal places
 * @param amount - numeric amount
 * @returns formatted string e.g., "$123.45"
 */
export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

/**
 * Utility object grouping all expense-related helper functions
 */
const UtilsExpense = {
    formatDate,        // Date formatting
    initialFormData,   // Initial form values
    updateURL,         // URL query updater
    formatCurrency     // Currency formatter
}

export default UtilsExpense; // Export the utility object for use in other modules