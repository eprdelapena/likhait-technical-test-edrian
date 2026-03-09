import { ECommon } from "../../constants/common";
import { Category } from "./types";

/**
 * CategoryService: handles API requests related to expense categories
 * Provides a method to fetch all categories from the backend
 */
class CategoryService {
    private _baseUrl: string = ECommon.BASE_API_URL; // Base API URL from constants

    constructor() {
        // No initialization needed currently
    }

    /**
     * Fetch all categories from the API
     * @returns Promise resolving to an array of Category objects
     *          Returns empty array if fetch fails
     */
    public async GetCategories(): Promise<Category[]> {
        try {
            const endpoint: string = "/api/categories"; // API endpoint for categories

            // Fetch categories from backend
            const response = await fetch(`${this._baseUrl}${endpoint}`, {
                method: 'GET', // HTTP GET method
                headers: {
                    'Content-Type': 'application/json', // Expect JSON response
                },
            });

            const data = await response.json(); // Parse response as JSON
            return data as Category[]; // Return as array of Category
        }
        catch (error) {
            console.error("Failed to fetch categories:", error); // Log error
            return []; // Return empty array on failure
        }
    }
}

// Export a single instance of CategoryService for use throughout the app
const categoryService = new CategoryService();
export default categoryService;