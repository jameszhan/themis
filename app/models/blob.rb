class Blob < ActiveRecord::Base

  validates_presence_of :name, :uri, :size, :modified_at
  validates_length_of :uri, maximum: 255

  def content
    File.read(self.uri)
  end

end
