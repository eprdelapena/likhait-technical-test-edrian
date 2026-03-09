/**
 * CalendarExpenseTable component
 * 
 * Displays a paginated table of expenses with options to edit or delete each expense.
 * Handles modal visibility, page state, and renders category emojis.
 */

import React, { useState } from "react";
import { Expense } from "../types";
import { formatCurrency, formatDate } from "../utils/expenseUtils";
import { getCategoryEmoji } from "../constants/categoryEmojis";
import { COLORS } from "../constants/colors";
import { Button, Modal, Pagination } from "../vibes";
import { EditExpenseForm } from "../components/EditExpenseForm";
import { TCreateExpensePayload } from "../services/expenses/types.ts";
import CDeleteExpense from "../components/DeleteExpense";
import { Category } from "../services/categories/types.ts";

interface CalendarExpenseTableProps {
  categoriesFetch: Category[];                 // List of categories fetched from API
  getExpenses: () => Promise<void>;           // Function to refresh expenses
  initialData?: Partial<TCreateExpensePayload["expense"]>; // Optional initial data for form
  expenses: Expense[];                        // Array of expenses to display
}

const ITEMS_PER_PAGE = 10; // Number of expenses per page

export function CalendarExpenseTable({
  getExpenses,
  categoriesFetch,
  expenses,
}: CalendarExpenseTableProps) {
  const [currentPage, setCurrentPage] = useState(1);         // Tracks current pagination page
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null); // Expense being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);               // Edit modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);           // Delete modal visibility

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE); // Total number of pages
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;         // Start index for current page
  const endIndex = startIndex + ITEMS_PER_PAGE;                  // End index for current page
  const currentExpenses = expenses.slice(startIndex, endIndex); // Expenses to display on current page

  /**
   * Open edit modal for selected expense
   */
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  // Table styling
  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: COLORS.background.main,
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: `1px solid ${COLORS.border}`,
  };

  const theadStyle: React.CSSProperties = {
    backgroundColor: COLORS.background.card,
  };

  const thStyle: React.CSSProperties = {
    padding: "0.75rem",
    textAlign: "left",
    fontWeight: 600,
    color: COLORS.text.primary,
    borderBottom: `2px solid ${COLORS.border}`,
  };

  const tdStyle: React.CSSProperties = {
    padding: "0.75rem",
    borderBottom: `1px solid ${COLORS.border}`,
    color: COLORS.text.primary,
  };

  const emptyStyle: React.CSSProperties = {
    padding: "2rem",
    textAlign: "center",
    color: COLORS.text.secondary,
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
  };

  // Show message if no expenses are available
  if (expenses.length === 0) {
    return (
      <div style={tableStyle}>
        <div style={emptyStyle}>
          No expenses found. Add your first expense to get started!
        </div>
      </div>
    );
  }

  return (
    <>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Amount</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentExpenses.map((expense) => (
            <tr key={expense.id}>
              <td style={tdStyle}>{formatDate(new Date(expense.date))}</td>
              <td style={tdStyle}>{expense.description}</td>
              <td style={tdStyle}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{getCategoryEmoji(expense.category)}</span>
                  <span>{expense.category}</span>
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600 }}>
                {formatCurrency(expense.amount)}
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <div style={actionButtonsStyle}>
                  {/* Edit button */}
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </Button>
                  {/* Edit modal */}
                  <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                      setIsEditModalOpen(false);
                      setEditingExpense(null);
                    }}
                    title="Edit Expense"
                  >
                    {editingExpense && (
                      <EditExpenseForm
                        initialData={expense}
                        categories={categoriesFetch}
                        setIsModalOpen={setIsEditModalOpen}
                        getExpenses={getExpenses}
                        submitLabel="Update Expense"
                      />
                    )}
                  </Modal>

                  {/* Delete button */}
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => {
                      alert("hello"); // Temporary alert
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </Button>

                  {/* Delete modal */}
                  <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                      setIsDeleteModalOpen(false);
                    }}
                    title="Delete Expense"
                  >
                    <CDeleteExpense
                      expense={expense}
                      getExpenses={getExpenses}
                      setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                  </Modal>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}