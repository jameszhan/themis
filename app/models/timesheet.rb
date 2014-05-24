class Timesheet < ActiveRecord::Base
  scope :start_between, lambda{|start_date, end_date| where('start_time BETWEEN ? AND ?', start_date, end_date)}
end
