class ChangeTaskDurationColumn < ActiveRecord::Migration
  def change
    change_column :tasks, :duration, :bigint
  end
end
