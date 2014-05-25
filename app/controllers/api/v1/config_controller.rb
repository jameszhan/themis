# encoding: UTF-8
module Api::V1
  class ConfigController < ApplicationController

    def show
      target = global_config[params[:id]] || []
      render json: {data: target}
    end

    def categories
      @categories = YAML::load(File.read(Rails.root + 'config/categories.yml'))['global']
    end


    private
      def global_config
        @global_config ||= YAML::load(File.read(Rails.root + 'config/global_config.yml'))
      end

  end
end