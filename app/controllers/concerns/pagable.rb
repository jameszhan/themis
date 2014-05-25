module Pagable

  def search
    model = find_resource_model
    @total_count = model.count
    @page_index = params[:page] || 1
    @page_size =  params[:per_page] || Kaminari.config.default_per_page
    @items = model.where(query_params).page(params[:page]).per(params[:per_page])
    render 'shared/_paginate'
  end


  def find_resource_model
    params[:controller].classify[/[\w_]+$/].constantize
  end

  private
    def query_params
      params
    end

end