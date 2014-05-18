~~~shell
rails new iSharing -m ./rails_templates/rails41.rb -d mysql

cd iSharing

rails g scaffold task name:string desc:string importance:integer urgency:integer
~~~