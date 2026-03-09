import { useEffect, useState } from "react";
import { Category } from "../../services/categories/types";
import services from "../../services/services";

/**
 * Custom React hook to fetch expense categories from the backend
 * Handles loading state, API call, and stores categories in local state
 */
const useGetCategories = () => {
    const [categoriesFetch, setCategoriesFetch] = useState<Category[]>([]); // Stores fetched categories
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state for UI feedback

    /**
     * Fetch categories from the API using CategoryService
     * Updates local state and loading indicator
     */
    const getCategories = async () => {
        setIsLoading(true); // Start loading
        try {
            const response = await services.categoryService.GetCategories(); // Call API
            setCategoriesFetch(response); // Save response to state
        }
        catch (error) {
            console.error(error); // Log any errors
        }
        finally {
            setIsLoading(false); // End loading
        }
    }

    /**
     * Automatically fetch categories when the hook is first used (component mounts)
     */
    useEffect(() => {
        getCategories();
    }, []);

    // Return state and function to allow manual re-fetching
    return {
        getCategories,      // Function to manually fetch categories
        isLoading,          // Loading indicator for UI
        categoriesFetch,    // Fetched categories data
    }
}

export default useGetCategories; // Export the custom hook