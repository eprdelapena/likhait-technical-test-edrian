import { useState } from 'react';
import services from "../../services/services";
import { TCreateExpensePayload, TExpense, TformErrorType } from '../../services/expenses/types';

/**
 * Custom React hook to handle editing an existing expense
 * Manages form state, validation, API call, errors, and loading state
 * @param initialData - the existing expense data to prefill the form
 * @param initialCategoryId - category ID to prefill the form
 * @param setIsModalOpen - function to control modal visibility
 * @param getExpenses - function to refresh the expenses list after editing
 */
const useEditExpenses = ({
    initialData,
    initialCategoryId,
    setIsModalOpen,
    getExpenses
}: {
    initialData: TExpense,
    initialCategoryId: number,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getExpenses: () => Promise<void>
}) => {
    // Loading state for API submission
    const [loading, setLoading] = useState<boolean>(false);

    // Form parameters state, initialized with the expense data passed in
    const [params, setParams] = useState<TCreateExpensePayload["expense"]>({
        description: initialData.description,
        amount: initialData.amount,
        category_id: initialCategoryId,
        date: initialData.date
    });

    // Validation and submission error state
    const [errors, setErrors] = useState<TformErrorType>({});

    /**
     * Handle changes in form fields
     * Updates the params state and clears errors for the changed field
     * @param field - the field name being updated
     * @param value - the new value for the field
     */
    const handleChange = ({
        field,
        value,
    }: {
        field: keyof Partial<TCreateExpensePayload["expense"]>,
        value: string,
    }) => {
        setParams((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Submit the edited expense to the API
     * Validates input, updates the expense, handles errors, and closes modal
     * @param id - ID of the expense to edit
     */
    const editExpenses = async (id: number) => {
        const validationErrors = validateExpense(params); // Validate current form data

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set validation errors if any
            return;
        }

        setLoading(true); // Start loading
        try {
            const response = await services.expensesService.EditExpense({
                params: {
                    ...params,
                    amount: Number(params.amount),          // Ensure amount is a number
                    category_id: Number(params.category_id) // Ensure category_id is a number
                },
                id
            });

            if ("errors" in response) {
                // API returned errors
                setErrors({
                    general: response.errors.join(", "),
                });
                return;
            }

            setLoading(true);
            alert("Successfully added an expense " + `Date: ${params.date}`); // Feedback
            getExpenses(); // Refresh expenses list
            setIsModalOpen(false); // Close modal
        }
        catch (error) {
            console.error(error); // Log API or unexpected errors
            return error;
        }
    }

    // Return hook state and handler functions
    return {
        editExpenses,  // Function to call for submitting edits
        loading,       // Loading indicator for UI
        errors,        // Validation and API errors
        params,        // Current form state
        handleChange   // Function to update form fields
    }
}

export default useEditExpenses; // Export the hook

/**
 * Validate the expense form data
 * @param data - partial expense object to validate
 * @returns errors object keyed by field names
 */
const validateExpense = (data: Partial<TCreateExpensePayload["expense"]>) => {
    const errors: Partial<TformErrorType> = {};

    if (!data?.amount || Number(data?.amount) <= 0 || isNaN(Number(data?.amount))) {
        errors.amount = "Amount must be greater than 0";
    }

    if (!data?.description?.trim()) {
        errors.description = "Description is required";
    }

    if (!data?.category_id) {
        errors.category_id = "Category is required";
    }

    if (!data?.date) {
        errors.date = "Date is required";
    }

    return errors; // Return validation errors (empty if valid)
}