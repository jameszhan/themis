# encoding: UTF-8
module Api::V1
  class ConfigController < ApplicationController

    def categories
      @categories = YAML::load(File.read(Rails.root + 'config/categories.yml'))['global']
    end

  end
end