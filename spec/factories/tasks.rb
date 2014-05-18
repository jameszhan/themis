# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :task do
    name "MyString"
    desc "MyString"
    importance 1
    urgency 1
  end
end
