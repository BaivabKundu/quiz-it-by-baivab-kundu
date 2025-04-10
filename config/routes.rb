# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
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
        resources :submissions, only: %i[index], param: :slug do
          collection do
            resource :report, only: :create, module: :submissions do
              get :download, on: :collection
            end
          end
        end
        resource :organizations, only: [:show, :update]
        resources :categories, only: [:index, :create]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
