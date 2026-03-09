import categoryService from "./categories/index"; // Import the CategoryService instance
import expensesService from "./expenses/index"; // Import the ExpensesService instance

/**
 * Centralized services object
 * Groups all service instances in a single export for easier imports elsewhere
 */
const services = {
    expensesService, // Access to ExpensesService methods (create, get, edit, delete)
    categoryService  // Access to CategoryService methods (get categories)
}

export default services; // Export the grouped services for use throughout the app