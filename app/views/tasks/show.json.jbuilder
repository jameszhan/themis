json.extract! @task, :id, :name, :desc, :importance, :urgency, :start, :duration, :created_at, :updated_at
json.title @task.name
