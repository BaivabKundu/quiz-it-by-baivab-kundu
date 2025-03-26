# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"
  get "*path", to: "home#index", via: :all
end
