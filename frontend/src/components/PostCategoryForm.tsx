/**
 * Form component for adding a new category
 * Uses usePostCategories hook for form state, validation, and submission
 */

import React from "react";
import { TextField, Button } from "../vibes";
import usePostCategories from "../../src/hooks/categories/usePostCategories";

/**
 * Props for CategoryForm component
 */
interface CategoryFormProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;  // Function to control modal visibility
  getCategories: () => Promise<void>;                      // Function to refresh category list after creation
}

/**
 * Form component for creating a new category
 * Handles input changes, validation, API submission, and loading state
 */
export function PostCategoryForm({ setModal, getCategories }: CategoryFormProps) {
  // Use custom hook for category form logic
  const { postCategory, categoryName, setCategoryName, loading } = usePostCategories({
    setModal,
    getCategories,
  });

  // CSS for form layout
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  // CSS for buttons
  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        postCategory(); // Submit category
      }}
      style={formStyle}
    >
      {/* Category Name input */}
      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        fullWidth
        required
      />

      {/* Buttons */}
      <div style={buttonGroupStyle}>
        <Button type="submit" variant="primary" disabled={loading} fullWidth>
          {loading ? "Submitting..." : "Add Category"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setModal(false)}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}