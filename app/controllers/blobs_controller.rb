class BlobsController < ApplicationController
  before_action :set_blob, only: [:show, :edit, :update, :destroy]

  # GET /blobs
  # GET /blobs.json
  def index
    @blobs = Blob.page params[:page]
  end

  # GET /blobs/1
  # GET /blobs/1.json
  def show
  end

  # GET /blobs/new
  def new
    @blob = Blob.new
  end

  # GET /blobs/1/edit
  def edit
  end

  # POST /blobs
  # POST /blobs.json
  def create
    @blob = Blob.new(blob_params)

    respond_to do |format|
      if @blob.save
        format.html { redirect_to @blob, notice: 'Blob was successfully created.' }
        format.json { render :show, status: :created, location: @blob }
      else
        format.html { render :new }
        format.json { render json: @blob.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /blobs/1
  # PATCH/PUT /blobs/1.json
  def update
    respond_to do |format|
      if @blob.update(blob_params)
        format.html { redirect_to @blob, notice: 'Blob was successfully updated.' }
        format.json { render :show, status: :ok, location: @blob }
      else
        format.html { render :edit }
        format.json { render json: @blob.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /blobs/1
  # DELETE /blobs/1.json
  def destroy
    @blob.destroy
    respond_to do |format|
      format.html { redirect_to blobs_url, notice: 'Blob was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_blob
      @blob = Blob.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def blob_params
      params.require(:blob).permit(:digest, :uri, :size, :mime, :name, :modified_at)
    end
end
