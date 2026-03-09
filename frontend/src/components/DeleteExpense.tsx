import React from 'react';
import { Button } from "../vibes";
import { COLORS } from '../constants/colors';
import { TExpense } from '../services/expenses/types';
import useDeleteExpenses from '../hooks/expenses/useDeleteExpenses';
import UtilsExpense from "../services/expenses/utils";

/**
 * Component to confirm and handle deletion of a single expense
 * Shows expense details and provides Cancel/Delete buttons
 */
const CDeleteExpense = ({
    setIsDeleteModalOpen,  // Function to close the delete modal
    expense,               // Expense object to delete
    getExpenses            // Function to refresh expenses list after deletion
}: Props) => {

    // Use custom hook to handle deletion logic
    const { deleteExpenses } = useDeleteExpenses({
        setIsModalOpen: setIsDeleteModalOpen, // Hook uses modal setter
        getExpenses                           // Hook uses function to refresh list
    });

    return (
        <>
            <div style={{ padding: "1rem 0" }}>
                {/* Confirmation message */}
                <p style={{ marginBottom: "1.5rem", color: COLORS.text.primary }}>
                    Are you sure you want to delete this expense?
                </p>

                {/* Display expense details */}
                {expense && (
                    <p style={{ marginBottom: "1.5rem", color: COLORS.text.secondary }}>
                        <strong>{expense.description}</strong> -{" "}
                        {UtilsExpense.formatCurrency(expense.amount)}
                    </p>
                )}

                {/* Action buttons */}
                <div
                    style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                    }}
                >
                    {/* Cancel button closes modal */}
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                        }}
                    >
                        Cancel
                    </Button>

                    {/* Delete button triggers deleteExpenses */}
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteExpenses(expense.id);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CDeleteExpense; // Export component

/**
 * Props type for CDeleteExpense component
 */
type Props = {
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>; // Modal state setter
    expense: TExpense;                                                   // Expense to delete
    getExpenses: () => Promise<void>;                                    // Refresh expenses after deletion
}