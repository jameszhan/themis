class AddProgressToTask < ActiveRecord::Migration
  def change
    add_column :tasks, :progress, :int, :default => 0
  end
end
