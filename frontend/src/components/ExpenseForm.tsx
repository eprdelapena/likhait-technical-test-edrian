/**
 * Form component for adding a new expense
 * Uses useCreateExpenses hook for form state, validation, and submission
 */

import React from "react";
import { TextField, SelectBox, Button } from "../vibes";
import useCreateExpenses from "../../src/hooks/expenses/useCreateExpenses";
import { Category } from "../services/categories/types";

/**
 * Props for ExpenseForm component
 */
interface ExpenseFormProps {
  categories: Category[];                                         // List of categories for dropdown
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;  // Function to control modal visibility
  getExpenses: () => Promise<void>;                               // Function to refresh expense list after creation
  onCancel?: () => void;                                          // Optional cancel handler
  submitLabel?: string;                                           // Optional label for submit button
}

/**
 * Form component for creating a new expense
 * Handles input changes, validation, API submission, and error display
 */
export function ExpenseForm({
  categories,
  setIsModalOpen,
  getExpenses,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {

  // Destructure custom hook to handle form logic
  const {
    createExpenses,  // Function to submit expense form
    handleChange,    // Handles input changes
    errors,          // Validation and API errors
    isSubmitting,    // Loading state during submission
    formData         // Current form data
  } = useCreateExpenses({
    setIsModalOpen,
    getExpenses
  });

  // Map categories to select options
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  // CSS for form layout
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  // CSS for submit/cancel buttons
  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createExpenses(); // Submit form
      }}
      style={formStyle}
    >
      {/* Amount input */}
      <TextField
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        value={formData.amount}
        onChange={(e) => handleChange({ field: "amount", value: e.target.value })}
        error={errors.amount}
        fullWidth
        required
      />

      {/* Description input */}
      <TextField
        label="Description"
        type="text"
        placeholder="Enter description"
        value={formData.description}
        onChange={(e) => handleChange({ field: "description", value: e.target.value })}
        error={errors.description}
        fullWidth
        required
      />

      {/* Category select */}
      <SelectBox
        label="Category"
        options={categoryOptions}
        value={formData.category_id}
        onChange={(e) =>
          handleChange({ field: "category_id", value: e.target.value })
        }
        error={errors.category_id}
        fullWidth
        required
      />

      {/* Date input */}
      <TextField
        label="Date"
        type="date"
        max={new Date().toISOString().split("T")[0]} 
        value={formData.date}
        onChange={(e) => handleChange({ field: "date", value: e.target.value })}
        error={errors.date}
        fullWidth
        required
      />

      {/* Display general API errors */}
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
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}