import { useState } from "react";
import services from "../../services/services";

/**
 * Custom React hook for posting a new category via API
 *
 * @param getCategories - Function to fetch all categories after successful creation
 * @param setModal - Function to control modal visibility
 */
const usePostCategories = ({ getCategories, setModal }: Props) => {
    // State for the category name input
    const [categoryName, setCategoryName] = useState<string>("");

    // State for loading indicator while API request is in progress
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Function to post a new category
     * Handles validation, API request, and state updates
     */
    const postCategory = async () => {
        setLoading(true); // Start loading

        try {
            // Simple validation: category name must not be empty
            if (!categoryName) {
                alert("Category name cannot be empty");
                return; // Exit if validation fails
            }

            // Call the backend service to create a category
            await services.categoryService.PostCategories({
                category: {
                    name: categoryName
                }
            });

            // Notify user of success
            alert("Successfully posted a category");

            // Refresh the categories list after successful creation
            getCategories();

        } catch (error) {
            // Log any errors to the console
            console.error(error);
            return;
        } finally {
            // Close modal and stop loading regardless of success/failure
            setModal(false);
            setLoading(false);
        }
    }

    // Return state and functions to be used in components
    return {
        postCategory,     // Function to trigger API call
        categoryName,     // Current category name input
        setCategoryName,  // Setter for category name input
        loading           // Loading state
    }
}

export default usePostCategories;

// Props type definition for the hook
type Props = {
    getCategories: () => Promise<void>; // Function to refresh categories
    setModal: React.Dispatch<React.SetStateAction<boolean>> // Modal visibility setter
}