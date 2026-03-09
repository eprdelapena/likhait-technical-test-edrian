import { ECommon } from "../../constants/common";
import { Category, PostCategory, PostCategoryResponse } from "./types";

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

    /**
     * Sends a POST request to create a new category via the API.
     *
     * @param params - Payload containing the category to create (PostCategory type)
     * @returns A Promise resolving to PostCategoryResponse if successful, or void on error
     */
    public async PostCategories(params: PostCategory): Promise<PostCategoryResponse | void> {
        try {
            // Define the API endpoint for creating categories
            const endpoint: string = "/api/categories";

            // Send the POST request to the backend
            const response = await fetch(`${this._baseUrl}${endpoint}`, {
                method: 'POST', // HTTP POST method for creating resources
                headers: {
                    'Content-Type': 'application/json', // Tell server the body is JSON
                },
                body: JSON.stringify(params), // Convert the TypeScript payload to a JSON string
            });

            // Check if the response was successful (status code 200-299)            
            if (!response?.ok) throw new Error();
            // Parse the JSON response body
            const data = await response?.json();
            // Return the parsed data as PostCategoryResponse type
            return data as PostCategoryResponse
        }
        catch (error) {
            // Log any errors to the console
            console.error(error);
            // Return void if the request failed
            return;
        }
    }
}

// Export a single instance of CategoryService for use throughout the app
const categoryService = new CategoryService();
export default categoryService;