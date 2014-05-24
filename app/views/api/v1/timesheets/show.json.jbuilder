json.extract! @timesheet, :id, :title, :desc, :started_at, :completed_at, :category_id, :created_at, :updated_at
json.start @timesheet.started_at
json.end @timesheet.completed_at