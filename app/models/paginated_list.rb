class PaginatedList
  cattr_accessor :items

  def initialize(items)
    @items = items
  end

end