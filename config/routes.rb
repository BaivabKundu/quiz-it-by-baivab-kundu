# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :create]
      resource :session, only: [:create, :destroy]
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
