class Timesheet < ActiveRecord::Base
  scope :start_between, lambda { |started_at, stopped_at| where('started_at BETWEEN ? AND ?', started_at, stopped_at) }
  belongs_to :category
end
