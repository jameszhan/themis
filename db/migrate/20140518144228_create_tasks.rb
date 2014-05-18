class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.string :desc
      t.integer :importance
      t.integer :urgency

      t.timestamps
    end
  end
end
