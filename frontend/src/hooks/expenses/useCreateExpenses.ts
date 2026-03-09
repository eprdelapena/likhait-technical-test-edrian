import { TCreateExpensePayload, TformErrorType } from "../../services/expenses/types";
import { useState } from "react";
import UtilsExpense from "../../services/expenses/utils";
import services from "../../services/services";

/**
 * Custom React hook to manage creating a new expense
 * Handles form state, validation, submission, and error handling
 * @param setIsModalOpen - function to control modal visibility
 * @param getExpenses - function to refresh expenses list after creation
 */
const useCreateExpenses = ({
    setIsModalOpen,
    getExpenses,
}: {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getExpenses: () => Promise<void>
}) => {
    // Form data state initialized with default values from UtilsExpense
    const [formData, setFormData] = useState<Partial<TCreateExpensePayload["expense"]>>(UtilsExpense.initialFormData);

    // State for validation and submission errors
    const [errors, setErrors] = useState<TformErrorType>({});

    // State to track submission loading
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    /**
     * Handle input changes in the form
     * @param field - field name to update
     * @param value - new value for the field
     */
    const handleChange = ({
        field,
        value,
    }: {
        field: keyof Partial<TCreateExpensePayload["expense"]>,
        value: string,
    }) => {
        setFormData((prev) => ({ ...prev, [field]: value })); // Update form data

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Reset the form to initial state
     * Clears form data and errors
     */
    const resetForm = () => {
        setFormData(UtilsExpense.initialFormData);
        setErrors({});
    };

    /**
     * Submit the expense form
     * Validates data, calls API, handles errors, refreshes expenses list, and closes modal
     */
    const createExpenses = async () => {
        const validationErrors = validateExpense(formData); // Validate form data

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Set errors if validation fails
            return;
        }

        setIsSubmitting(true); // Start submission loading

        try {
            const payload: TCreateExpensePayload = {
                expense: {
                    description: formData.description!, // Non-null assertion after validation
                    amount: Number(formData.amount),
                    category_id: Number(formData.category_id),
                    date: formData.date!,
                }
            };

            const response = await services.expensesService.CreateExpense(payload); // Call API

            if ("errors" in response) {
                // Show API errors in the form
                setErrors({
                    general: response.errors.join(", "),
                });
                return;
            }

            alert("Successfully added an expense " + `Date: ${formData.date}`); // Success feedback
            resetForm(); // Reset form
            getExpenses(); // Refresh expense list
            setIsModalOpen(false); // Close modal
        }
        catch (error) {
            console.error(error);
            setErrors({
                general: "Something went wrong" // Generic error message
            });
        }
        finally {
            setIsSubmitting(false); // Stop submission loading
        }
    }

    // Return hook state and functions
    return {
        isSubmitting,  // Loading indicator for submission
        createExpenses, // Function to submit form
        errors,        // Validation and API errors
        formData,      // Form data state
        handleChange   // Function to update form fields
    }
}

export default useCreateExpenses; // Export the custom hook

/**
 * Validate expense form data
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
    } else {
        const today = new Date();
        const inputDate = new Date(data.date);

        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            errors.date = "Expense date cannot be in the future";
        }
    }

    return errors; // Return validation errors (empty if valid)
}