import React from "react";
import { TextField, SelectBox, Button } from "../vibes";
import useEditExpenses from "../../src/hooks/expenses/useEditExpenses";
import { Category } from "../services/categories/types";
import { TExpense } from "../services/expenses/types";

/**
 * Props for EditExpenseForm component
 */
interface EditExpenseFormProps {
  initialData: TExpense;                                         // Existing expense to prefill form
  categories: Category[];                                         // List of categories for dropdown
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Modal visibility control
  getExpenses: () => Promise<void>;                               // Function to refresh expenses list
  submitLabel?: string;                                           // Optional label for submit button
}

/**
 * Form component for editing an existing expense
 * Uses useEditExpenses hook for managing state, validation, and API calls
 */
export function EditExpenseForm({
  initialData,
  categories,
  setIsModalOpen,
  getExpenses,
  submitLabel = "Add Expense",
}: EditExpenseFormProps) {

  // Destructure custom hook to manage form logic
  const {
    editExpenses,   // Function to submit edited expense
    params,         // Current form values
    errors,         // Validation or API errors
    loading,        // Loading state for submission
    handleChange    // Handler for input changes
  } = useEditExpenses({
    initialData,
    initialCategoryId: Number(categories.find(
      (cat) => cat.name === initialData.category
    )),
    setIsModalOpen,
    getExpenses,
  });

  /**
   * Close modal without submitting
   */
  const onCancel = () => {
    setIsModalOpen(false);
  }

  /**
   * Map categories to select options
   */
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // Styles for form layout
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editExpenses(initialData.id); // Submit edited expense
      }}
      style={formStyle}
    >
      {/* Amount input field */}
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={params.amount}
        onChange={(e) => handleChange({ field: "amount", value: e.target.value })}
        error={errors.amount}
        fullWidth
        required
      />

      {/* Description input field */}
      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={params.description}
        onChange={(e) => handleChange({ field: "description", value: e.target.value })}
        error={errors.description}
        fullWidth
        required
      />

      {/* Category select dropdown */}
      <SelectBox
        label="Category"
        options={categoryOptions}
        value={params.category_id}
        onChange={(e) =>
          handleChange({ field: "category_id", value: e.target.value })
        }
        error={errors.category_id}
        fullWidth
        required
      />

      {/* Date input field */}
      <TextField
        label="Date"
        type="date"
        value={params.date}
        onChange={(e) => handleChange({ field: "date", value: e.target.value })}
        error={errors.date}
        fullWidth
        required
      />

      {/* Display general errors */}
      {errors.general && (
        <div style={{ color: "red", marginBottom: "0.5rem" }}>
          {errors.general}
        </div>
      )}

      {/* Submit / Cancel buttons */}
      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}