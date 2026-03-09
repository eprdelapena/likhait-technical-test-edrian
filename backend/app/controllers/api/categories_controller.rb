class Api::CategoriesController < ApplicationController
  # GET /api/categories
  def index
    categories = Category.order(:name)
    render json: categories
  end

    # POST /api/categories
  # This action handles creating a new category in the system.
  # 
  # Request Body (JSON):
  # -------------------
  # POST /api/categories
  # Content-Type: application/json
  #
  # {
  #   "category": {
  #     "name": "Food"
  #   }
  # }
  #
  # Explanation:
  # - "category" → required key (matches params.require(:category))
  # - "name" → string (only permitted attribute, matches permit(:name))
  #
  # Example Successful Response:
  # ----------------------------
  # HTTP/1.1 201 Created
  # Content-Type: application/json
  #
  # {
  #   "id": 1,
  #   "name": "Food",
  #   "created_at": "2026-03-09T12:00:00Z",
  #   "updated_at": "2026-03-09T12:00:00Z"
  # }
  #
  # Example Error Response (name blank):
  # -----------------------------------
  # HTTP/1.1 422 Unprocessable Entity
  # Content-Type: application/json
  #
  # {
  #   "errors": ["Name can't be blank"]
  # }

  def create
    # Initialize a new Category object with permitted parameters from the request
    category = Category.new(category_params)

      # Attempt to save the category to the database
    if category.save

      # If successful, return the created category as JSON with HTTP status 201 Created
      render json: category, status: :created
    else

      # If saving fails (e.g., validation error), return the errors as JSON
      # If successful, return the created category as JSON with HTTP status 201 Created
      render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
    end
  end
  private

  # Strong parameters method: ensures only allowed attributes are passed to the model
  def category_params
    # Require the 'category' key in the params and permit only the 'name' attribute
    params.require(:category).permit(:name)
  end
end