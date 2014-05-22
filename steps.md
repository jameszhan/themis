~~~shell
rails new iSharing -m ./rails_templates/rails41.rb -d mysql

cd iSharing

rails g scaffold task name:string desc:string importance:integer urgency:integer start:datetime duration:integer

peony db:mysql:start

rake db:create db:migrate
~~~