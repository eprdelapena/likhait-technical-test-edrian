import { useEffect, useState } from "react";
import { TExpense, TGetExpenseParams } from "../../services/expenses/types";
import { ECreateExpenseError } from "../../constants/categories";
import services from "../../services/services";
import UtilsExpense from "../../services/expenses/utils";

/**
 * Custom React hook to fetch, manage, and filter expense data
 * Handles API calls, loading state, errors, sorting, and URL updates
 */
const useGetExpenses = () => {
    // State for filtering expenses by year and month
    const [params, setParams] = useState<TGetExpenseParams>({
        year: 2026,                   // Default year
        month: new Date().getMonth() + 1 // Default to current month (1-12)
    });

    // State to store fetched expenses
    const [expenses, setExpenses] = useState<TExpense[]>([]);

    // Loading state for API calls
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // State to store API or validation errors
    const [errors, setErrors] = useState<ECreateExpenseError[]>([]);

    /**
     * Handle change in year filter
     * Updates params state and updates browser URL
     * @param year - selected year
     */
    const handleYearChange = (year: number) => {
        setParams((prev) => ({
            ...prev,
            year
        }));
        UtilsExpense.updateURL(year, Number(params.month));
    };

    /**
     * Handle change in month filter
     * Updates params state and updates browser URL
     * @param month - selected month
     */
    const handleMonthChange = (month: number) => {
        setParams((prev) => ({
            ...prev,
            month
        }));
        UtilsExpense.updateURL(Number(params.year), month);
    };

    /**
     * Fetch expenses from the API based on current params
     * Handles loading, error state, and sorts expenses by date descending
     */
    const getExpenses = async () => {
        setIsLoading(true); // Start loading
        setErrors([]);      // Clear previous errors

        try {
            const response = await services.expensesService.GetExpense(params); // Fetch expenses

            if ("errors" in response) {
                setErrors(response.errors); // Handle API errors
                return;
            }

            // Sort expenses by date descending (most recent first)
            const sortedExpenses = [...response].sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setExpenses(sortedExpenses); // Update state with sorted expenses
        }
        catch (error) {
            console.error(error); // Log unexpected errors
            setErrors([ECreateExpenseError.NetworkError]); // Set network error
        }
        finally {
            setIsLoading(false); // Stop loading
        }
    }

    // Automatically fetch expenses whenever params (year/month) change
    useEffect(() => {
        getExpenses();
    }, [params]);

    // Update URL with initial year/month when component mounts
    useEffect(() => {
        UtilsExpense.updateURL(params?.year!, params?.month!);
    }, []);

    // Return state and functions for use in components
    return {
        expenses,        // Current list of expenses
        isLoading,       // Loading state for UI
        params,          // Current filter params (year/month)
        errors,          // API or validation errors
        setParams,       // Setter to manually update params
        handleMonthChange, // Handler to update month
        handleYearChange,  // Handler to update year
        getExpenses       // Function to manually refresh expenses
    }
}

export default useGetExpenses; // Export the custom hook