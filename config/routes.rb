# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :users, only: [:index, :create]
        resource :session, only: [:create, :destroy]
        resources :quizzes, except: %i[new edit], param: :slug
        resources :questions, except: %i[new edit] do
          post "clone", on: :member, to: "questions/clones#clone"
        end
        resources :organizations, only: [:index]
        resources :categories, only: [:index, :create]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
