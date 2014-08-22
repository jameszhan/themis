require 'rails_helper'

RSpec.describe "blobs/new", :type => :view do
  before(:each) do
    assign(:blob, Blob.new(
      :digest => "MyString",
      :uri => "MyString",
      :size => 1,
      :mime => "MyString",
      :name => "MyString"
    ))
  end

  it "renders new blob form" do
    render

    assert_select "form[action=?][method=?]", blobs_path, "post" do

      assert_select "input#blob_digest[name=?]", "blob[digest]"

      assert_select "input#blob_uri[name=?]", "blob[uri]"

      assert_select "input#blob_size[name=?]", "blob[size]"

      assert_select "input#blob_mime[name=?]", "blob[mime]"

      assert_select "input#blob_name[name=?]", "blob[name]"
    end
  end
end
