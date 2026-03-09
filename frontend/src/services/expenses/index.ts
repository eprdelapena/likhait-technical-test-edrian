import { ECommon } from '../../constants/common';
import { TCreateExpenseError, TCreateExpensePayload, TCreateExpenseResponse, TExpense, TGetExpenseParams } from './types';
import { ECreateExpenseError } from '../../constants/categories';

/**
 * ExpensesService: handles all API requests related to expenses
 * Provides methods to create, get, edit, and delete expenses
 */
class ExpensesService {
    private _baseUrl: string = ECommon.BASE_API_URL; // Base API URL from constants

    constructor() {
        // No initialization needed currently
    }

    /**
     * Create a new expense
     * @param params - payload containing expense data
     * @returns TCreateExpenseResponse on success, or TCreateExpenseError on failure
     */
    public async CreateExpense(params: TCreateExpensePayload): Promise<TCreateExpenseResponse | TCreateExpenseError> {
        try {
            const endpoint: string = "/api/expenses"; // API endpoint for creating expenses
            const response = await fetch(`${this._baseUrl}${endpoint}`, {
                method: 'POST', // HTTP POST method
                headers: {
                    'Content-Type': 'application/json', // send JSON data
                },
                body: JSON.stringify(params), // convert payload to JSON string
            });

            const data = await response.json(); // parse response JSON

            // If response contains errors array, return as TCreateExpenseError
            if ('errors' in data && Array.isArray(data.errors)) {
                return data as TCreateExpenseError;
            }

            // Handle network or other errors where response is not ok
            if (!response.ok) {
                return {
                    errors: [ECreateExpenseError.NetworkError], // return enum error
                } as TCreateExpenseError;
            }

            return data as TCreateExpenseResponse; // successful response
        } catch (error) {
            console.error('CreateExpense error:', error);
            return {
                errors: [ECreateExpenseError.NetworkError],
            } as TCreateExpenseError;
        }
    }

    /**
     * Get expenses filtered by year and month
     * @param year - optional year filter
     * @param month - optional month filter
     * @returns array of TExpense on success, or TCreateExpenseError on failure
     */
    public async GetExpense({ year, month }: TGetExpenseParams): Promise<TExpense[] | TCreateExpenseError> {
        try {
            const endpoint: string = "/api/expenses";

            // Default values if year or month are invalid
            const queryYear = year && !Number.isNaN(Number(year)) ? year : 2026;
            const queryMonth = month && !Number.isNaN(Number(month)) ? month : new Date().getMonth() + 1;

            // Build URL query parameters
            const query = new URLSearchParams({
                year: queryYear.toString(),
                month: queryMonth.toString()
            });

            const response = await fetch(`${this._baseUrl}${endpoint}?${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            // Handle non-ok responses
            if (!response.ok) {
                return {
                    errors: [ECreateExpenseError.NetworkError],
                } as TCreateExpenseError;
            }

            return data as TExpense[]; // return array of expenses
        }
        catch (error) {
            console.error('CreateExpense error:', error);
            return {
                errors: [ECreateExpenseError.NetworkError],
            } as TCreateExpenseError;
        }
    }

    /**
     * Edit an existing expense by ID
     * @param id - ID of the expense to edit
     * @param params - updated expense data
     * @returns TCreateExpenseResponse on success, or TCreateExpenseError on failure
     */
    public async EditExpense(
        {
            id,
            params
        }: { id: number, params: TCreateExpensePayload["expense"] }
    ): Promise<TCreateExpenseResponse | TCreateExpenseError> {
        try {
            const endpoint: string = "/api/expenses";
            const response = await fetch(`${this._baseUrl}${endpoint}/${id}`, {
                method: "PUT", // HTTP PUT for update
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expense: params }), // wrap params under "expense"
            });

            const data = await response.json();

            // Check for API errors
            if ('errors' in data && Array.isArray(data.errors)) {
                return data as TCreateExpenseError;
            }

            if (!response.ok) {
                return {
                    errors: [ECreateExpenseError.NetworkError],
                } as TCreateExpenseError;
            }

            return data as TCreateExpenseResponse; // successful response
        }
        catch (error) {
            return {
                errors: [ECreateExpenseError.NetworkError],
            } as TCreateExpenseError;
        }
    }

    /**
     * Delete an expense by ID
     * @param id - ID of the expense to delete
     * @returns API response or undefined on error
     */
    public async deleteExpense({ id }: { id: number }) {
        try {
            const endpoint: string = "/api/expenses";

            const response = await fetch(`${this._baseUrl}${endpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            // Throw error if response not OK
            if (!response.ok) {
                throw new Error();
            }

            return data; // return deletion result
        }
        catch (error) {
            console.error(error); // log deletion error
        }
    }
}

// Create a single instance of ExpensesService for use throughout the app
const expensesService = new ExpensesService();
export default expensesService;