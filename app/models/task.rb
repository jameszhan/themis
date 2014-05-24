class Task < ActiveRecord::Base
  scope :start_between, lambda{|started_at, stopped_at| where('start BETWEEN ? AND ?', started_at, stopped_at)}
end
