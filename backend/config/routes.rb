Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    # config/routes.rb

    # Defines RESTful routes for categories
    # Only exposes the :index and :create actions
    # This means only the following endpoints are available:
    # 
    # GET    /api/categories    -> maps to CategoriesController#index
    # POST   /api/categories    -> maps to CategoriesController#create
    #
    # Explanation:
    # - :index  => lists all categories (read-only)
    # - :create => allows creating a new category (write)
    resources :categories, only: [:index, :create]
    resources :expenses, only: [ :index, :create, :update, :destroy ]
  end
end
