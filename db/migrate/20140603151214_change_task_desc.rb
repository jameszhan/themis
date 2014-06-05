class ChangeTaskDesc < ActiveRecord::Migration
  def change
    change_column :tasks, :desc, :text
  end
end
