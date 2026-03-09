# spec/requests/api/categories_spec.rb
require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  # -----------------------------
  # Test: Successfully creating a new category
  # -----------------------------
  describe "POST /api/categories" do
    it "creates a new category" do
      # Expectation: sending a POST request increases Category count by 1
      expect {
        post "/api/categories", params: { category: { name: "Entertainment" } }
      }.to change(Category, :count).by(1)

      # Expect HTTP status 201 Created
      expect(response).to have_http_status(:created)
      # Parse the JSON response body
      json = JSON.parse(response.body)
      # Ensure the returned category has the correct name
      expect(json["name"]).to eq("Entertainment")
    end

    # -----------------------------
    # Test: Error when creating a category with a missing name
    # -----------------------------
    it "returns an error when name is missing" do
      # Send POST request with empty name
      post "/api/categories", params: { category: { name: "" } }
      # Expect HTTP status 422 Unprocessable Entity
      expect(response).to have_http_status(:unprocessable_entity)
      # Parse JSON response
      json = JSON.parse(response.body)
      # Ensure the validation error message is returned
      expect(json["errors"]).to include("Name can't be blank")
    end
  end
end