module Api::V1
  class TimesheetsController < ApplicationController

    # GET /timesheets
    # GET /timesheets.json
    def index
      if params[:startTime] && params[:startTime]
        @tasks = Task.start_between(Time.at(params[:startTime].to_i), Time.at(params[:startTime].to_i))
      else
        @tasks = Task.all
      end
      @tasks = @tasks.page(params[:page]).per(params[:per_page])
    end
  end
end

