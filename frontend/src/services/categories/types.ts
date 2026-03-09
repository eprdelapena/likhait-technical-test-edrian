/**
 * Category object returned by API
 */

export type Category = {
    id: number;             // Category ID from API
    name: string;           // Category name, e.g. "Bills"
    created_at: string;     // ISO timestamp when category was created
    updated_at: string;     // ISO timestamp of last update
}

/**
 * Payload type for creating a new category via API
 * This is the shape of the data you send in the POST request
 */
export type PostCategory = {
    category: {
        name: string, // The name of the new category to create
    }
}

/**
 * Response type for a successfully created category
 * This is the shape of the data returned by the API after posting a category
 */
export type PostCategoryResponse = {
    id: number;          // Unique ID assigned by the backend
    name: string;        // The name of the category
    created_at: string;  // ISO date string indicating when the category was created
    updated_at: string;  // ISO date string indicating when the category was last updated
}