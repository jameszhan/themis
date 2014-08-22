require 'rails_helper'

RSpec.describe "Blobs", :type => :request do
  describe "GET /blobs" do
    it "works! (now write some real specs)" do
      get blobs_path
      expect(response.status).to be(200)
    end
  end
end
