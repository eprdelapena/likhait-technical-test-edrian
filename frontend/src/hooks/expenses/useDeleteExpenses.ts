import { useState } from 'react';
import services from "../../services/services";

/**
 * Custom React hook to handle deletion of an expense
 * Manages loading state, calls the delete API, and refreshes expense list
 * @param setIsModalOpen - function to control modal visibility
 * @param getExpenses - function to refresh expenses list after deletion
 */
const useDeleteExpenses = ({
    setIsModalOpen,
    getExpenses
}: {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    getExpenses: () => Promise<void>
}) => {
    // Loading state for deletion process
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Delete an expense by ID
     * @param id - ID of the expense to delete
     */
    const deleteExpenses = async (id: number) => {
        try {
            setLoading(true); // Start loading

            await services.expensesService.deleteExpense({ id }); // Call delete API

            alert("Successfully deleted expense"); // Success feedback
            setIsModalOpen(false); // Close modal
            getExpenses(); // Refresh expenses list
        }
        catch (error) {
            alert("Something went wrong, delete unsuccessful"); // Error feedback
            console.error(error); // Log error for debugging
            return error;
        }
        finally {
            setLoading(false); // Stop loading
        }
    }

    // Return hook state and functions
    return {
        deleteExpenses, // Function to trigger deletion
        loading,        // Loading indicator for UI
        setLoading      // Setter to manually control loading if needed
    }
}

export default useDeleteExpenses; // Export the custom hook