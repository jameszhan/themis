class CreateTimesheets < ActiveRecord::Migration
  def change
    create_table :timesheets do |t|
      t.string :title
      t.belongs_to :category, index: true
      t.string :desc
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps
    end
  end
end
