class CreateTimesheets < ActiveRecord::Migration
  def change
    create_table :timesheets do |t|
      t.string :title
      t.belongs_to :category, index: true
      t.string :desc
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end
end
