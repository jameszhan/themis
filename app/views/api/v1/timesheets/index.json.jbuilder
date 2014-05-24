json.array!(@timesheets) do |timesheet|
  json.extract! timesheet, :id, :title, :category_id, :desc, :started_at, :completed_at
  json.start timesheet.started_at
  json.end   timesheet.completed_at
end
