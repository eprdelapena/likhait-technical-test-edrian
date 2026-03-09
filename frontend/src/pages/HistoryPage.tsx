/**
 * Page component for viewing and managing expense history
 * Integrates year/month navigation, category breakdown, calendar table, and add expense modal
 */

import React, { useState } from "react";
import YearNavigation from "../components/YearNavigation";
import { MonthNavigation } from "../components/MonthNavigation";
import CategoryBreakdown from "../components/CategoryBreakdown";
import { CalendarExpenseTable } from "../components/CalendarExpenseTable";
import { ExpenseForm } from "../components/ExpenseForm";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import useGetExpenses from "../hooks/expenses/useGetExpenses"
import useGetCategories from "../hooks/categories/useGetCategories"
import { PostCategoryForm } from "../components/PostCategoryForm";

const HistoryPage: React.FC = () => {

  // Modal state for adding a new expense
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryModal, setCategoryModal] = useState<boolean>(false);

  // Hook to fetch and manage expenses, filtering by year/month
  const {
    handleMonthChange,
    handleYearChange,
    params,
    expenses,
    getExpenses,
    isLoading
  } = useGetExpenses();

  // Hook to fetch categories from the backend
  const {
    categoriesFetch,
    getCategories
  } = useGetCategories();

  /**
   * Calculate category breakdown for summary view
   * Aggregates amount and count per category
   */
  const categoryData = expenses.reduce(
    (acc, expense) => {
      const category = expense.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { category, amount: 0, count: 0 };
      }
      acc[category].amount += Number(expense.amount);
      acc[category].count += 1;
      return acc;
    },
    {} as Record<string, { category: string; amount: number; count: number }>,
  );

  // Sort categories by amount descending
  const categories = Object.values(categoryData).sort(
    (a, b) => b.amount - a.amount,
  );

  // Calculate total amount and total count for summary
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

  // Page and layout styles
  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  };

  const leftHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    flexShrink: 0,
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "18px",
    color: COLORS.secondary.s08,
  };

  return (
    <div style={pageStyle}>
      {/* Page header with title, year navigation, and add expense button */}
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>Expense History</h1>
          <YearNavigation
            currentYear={params?.year!}
            onYearChange={handleYearChange}
          />
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Button variant="secondary" onClick={() => setCategoryModal(true)}>
            Add Category
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            Add Expense
          </Button>
        </div>
      </div>

      {/* Month navigation component */}
      <MonthNavigation
        currentMonth={params?.month!}
        currentYear={params?.year!}
        onMonthChange={handleMonthChange}
      />

      <div>
        {isLoading ? (
          // Show loading state while fetching expenses
          <div style={loadingStyle}>Loading...</div>
        ) : (
          <>
            {/* Category breakdown summary */}
            <CategoryBreakdown
              categories={categories}
              total={total}
              totalCount={totalCount}
            />
            <div style={{ marginTop: "32px" }}>
              {/* Table showing individual expenses */}
              <CalendarExpenseTable
                categoriesFetch={categoriesFetch}
                getExpenses={getExpenses}
                expenses={expenses}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal for adding a new expense */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Expense"
      >
        <ExpenseForm
          categories={categoriesFetch}
          onCancel={() => setIsModalOpen(false)}
          setIsModalOpen={setIsModalOpen}
          getExpenses={getExpenses}
        />
      </Modal>
      <Modal
        isOpen={categoryModal}
        onClose={() => setCategoryModal(false)}
        title="Add Category"
      >
        <PostCategoryForm
          setModal={setCategoryModal}
          getCategories={getCategories}
        />
      </Modal>

    </div>
  );
};

export default HistoryPage;