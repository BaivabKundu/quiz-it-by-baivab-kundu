# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :users, only: [:index, :create]
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
        resources :submissions, only: %i[index], param: :slug
        resources :organizations, only: [:index]
        resources :categories, only: [:index, :create]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
