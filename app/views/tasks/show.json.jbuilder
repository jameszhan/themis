json.extract! @task, :id, :name, :desc, :importance, :urgency, :start, :duration, :progress, :created_at, :updated_at
json.title @task.name
