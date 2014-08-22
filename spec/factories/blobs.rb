# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :blob do
    digest "MyString"
    uri "MyString"
    size 1
    mime "MyString"
    name "MyString"
    modified_at "2014-08-22 15:23:02"
  end
end
