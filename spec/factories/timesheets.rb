# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :timesheet do
    title "MyString"
    category nil
    desc "MyString"
    started_at "2014-05-25 03:26:12"
    completed_at "2014-05-25 03:26:12"
  end
end
