~~~shell
rails new themis -m ./rails_templates/rails41.rb -d mysql

cd themis

rails g scaffold task name:string desc:string importance:integer urgency:integer start:datetime duration:integer

peony db:mysql:start

rake db:create db:migrate

rails g migration change_task_duration_column
rake db:migrate

rails g  model timesheet title:string category:belongs_to desc:string started_at:datetime completed_at:datetime
rake db:migrate

rails g scaffold blob digest uri size:integer mime name modified_at:datetime
rake db:migrate
~~~

#load webfs
~~~sh
rake webfs:load
bundle exec sidekiq
rake webfs:digest
~~~