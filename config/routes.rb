# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :users, only: [:index, :create] do
        post :create_standard_user, on: :collection
      end
      resource :session, only: [:create, :destroy]
      resources :quizzes, except: %i[new edit], param: :slug do
        post "clone", on: :member, to: "quizzes/clones#clone"
        collection do
          delete :bulk_destroy
          put :bulk_update
        end
      end
      resources :questions, except: %i[new edit] do
        post "clone", on: :member, to: "questions/clones#clone"
      end
      resources :submissions, only: %i[index create update] do
        resource :result, only: :show, on: :member, module: :submissions
        collection do
          resource :report, only: :create, module: :submissions do
            get :download, on: :collection
          end
        end
      end
      resources :organizations, only: [:index, :show, :update]
      resources :categories, only: [:index, :create]
      resources :redirections, only: %i[index create update destroy]
    end
  end

  # if Rails.env.test?
  get "/test_auth" => "test_authenticable#index"
  get "database_error", to: "api_exceptions_test/test#raise_database_error"
  get "authorization_error", to: "api_exceptions_test/test#raise_authorization_error"
  get "parameter_missing", to: "api_exceptions_test/test#raise_parameter_missing"
  get "record_not_found", to: "api_exceptions_test/test#raise_record_not_found"
  get "record_not_unique", to: "api_exceptions_test/test#raise_record_not_unique"
  get "validation_error", to: "api_exceptions_test/test#raise_validation_error"
  get "generic_error", to: "api_exceptions_test/test#raise_generic_error"
  # end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
