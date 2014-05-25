module Api::V1
  class TimesheetsController < ApplicationController
    include Paginatable

    before_action :set_timesheet, only: [:show, :update, :destroy]

    # GET /timesheets
    # GET /timesheets.json
    def index
      if params[:started_at] && params[:stopped_at]
        @timesheets = Timesheet.start_between(Time.at(params[:started_at].to_i), Time.at(params[:stopped_at].to_i))
      else
        @timesheets = Timesheet.all
      end
      @timesheets = @timesheets.page(params[:page]).per(params[:per_page])
    end

    # GET /timesheets/1
    # GET /timesheets/1.json
    def show
    end

    # POST /timesheets
    # POST /timesheets.json
    def create
      @timesheet = Timesheet.new(timesheet_params)
      respond_to do |format|
        if @timesheet.save
          format.html { redirect_to @timesheet, notice: 'Timesheet was successfully created.' }
          format.json { render :show, status: :created, location: api_v1_timesheet_url(@timesheet) }
        else
          format.html { render :new }
          format.json { render json: @timesheet.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /timesheets/1
    # PATCH/PUT /timesheets/1.json
    def update
      respond_to do |format|
        if @timesheet.update(timesheet_params)
          format.html { redirect_to @timesheet, notice: 'Timesheet was successfully updated.' }
          format.json { render :show, status: :ok, location: api_v1_timesheet_url(@timesheet) }
        else
          format.html { render :edit }
          format.json { render json: @timesheet.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /timesheets/1
    # DELETE /timesheets/1.json
    def destroy
      @timesheet.destroy
      respond_to do |format|
        format.html { redirect_to api_v1_timesheets_url, notice: 'Timesheet was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_timesheet
        @timesheet = Timesheet.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def timesheet_params
        params.require(:timesheet).permit(:title, :desc, :category_id, :started_at, :completed_at)
      end

      def query_params
        params.permit(:title, :category_id)
      end

  end
end

