require 'rails_helper'

RSpec.describe "blobs/show", :type => :view do
  before(:each) do
    @blob = assign(:blob, Blob.create!(
      :digest => "Digest",
      :uri => "Uri",
      :size => 1,
      :mime => "Mime",
      :name => "Name"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/Digest/)
    expect(rendered).to match(/Uri/)
    expect(rendered).to match(/1/)
    expect(rendered).to match(/Mime/)
    expect(rendered).to match(/Name/)
  end
end
