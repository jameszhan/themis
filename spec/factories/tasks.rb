# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :task do
    name "MyString"
    desc "MyString"
    importance 1
    urgency 1
    start "2014-05-21 21:47:29"
    duration 1
  end
end
