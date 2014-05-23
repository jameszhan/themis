class Task < ActiveRecord::Base
  scope :start_between, lambda{|start_date, end_date| where('start BETWEEN ? AND ?', start_date, end_date)}
end
