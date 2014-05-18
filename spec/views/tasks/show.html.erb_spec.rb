require 'spec_helper'

describe "tasks/show" do
  before(:each) do
    @task = assign(:task, stub_model(Task,
      :name => "Name",
      :desc => "Desc",
      :importance => 1,
      :urgency => 2
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/Desc/)
    rendered.should match(/1/)
    rendered.should match(/2/)
  end
end
