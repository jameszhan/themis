require 'spec_helper'

describe "tasks/new" do
  before(:each) do
    assign(:task, stub_model(Task,
      :name => "MyString",
      :desc => "MyString",
      :importance => 1,
      :urgency => 1,
      :duration => 1
    ).as_new_record)
  end

  it "renders new task form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", tasks_path, "post" do
      assert_select "input#task_name[name=?]", "task[name]"
      assert_select "input#task_desc[name=?]", "task[desc]"
      assert_select "input#task_importance[name=?]", "task[importance]"
      assert_select "input#task_urgency[name=?]", "task[urgency]"
      assert_select "input#task_duration[name=?]", "task[duration]"
    end
  end
end
