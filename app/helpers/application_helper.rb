module ApplicationHelper

  def url_for_order(name)
    url_for(params.merge(order: name, direction: params[:direction] == 'desc' ? 'asc' : 'desc'))
  end

  def sortable(column, title = nil)
    title ||= column.titleize
    order, direction = params.fetch(:order, column), params[:direction]
    icon = "<i class=\"#{column == order.to_sym ? "current #{direction}" : 'visible-xs'}\"></i>"
    raw "#{link_to(title, {:order => column, :direction => (direction == 'desc' ? 'asc' : 'desc')})}#{icon}"
  end

end
