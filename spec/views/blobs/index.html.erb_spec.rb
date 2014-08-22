require 'rails_helper'

RSpec.describe "blobs/index", :type => :view do
  before(:each) do
    assign(:blobs, [
      Blob.create!(
        :digest => "Digest",
        :uri => "Uri",
        :size => 1,
        :mime => "Mime",
        :name => "Name"
      ),
      Blob.create!(
        :digest => "Digest",
        :uri => "Uri",
        :size => 1,
        :mime => "Mime",
        :name => "Name"
      )
    ])
  end

  it "renders a list of blobs" do
    render
    assert_select "tr>td", :text => "Digest".to_s, :count => 2
    assert_select "tr>td", :text => "Uri".to_s, :count => 2
    assert_select "tr>td", :text => 1.to_s, :count => 2
    assert_select "tr>td", :text => "Mime".to_s, :count => 2
    assert_select "tr>td", :text => "Name".to_s, :count => 2
  end
end
