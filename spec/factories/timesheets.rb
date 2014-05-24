# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :timesheet do
    title "MyString"
    category nil
    desc "MyString"
    start_time "2014-05-25 01:59:59"
    end_time "2014-05-25 01:59:59"
  end
end
