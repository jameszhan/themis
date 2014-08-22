class CreateBlobs < ActiveRecord::Migration
  def change
    create_table :blobs do |t|
      t.string :digest
      t.string :uri, limit: 255, null: false
      t.integer :size, limit: 8, null: false
      t.string :mime
      t.string :name, null: false
      t.datetime :modified_at

      t.timestamps
    end

    add_index :blobs, [:uri], unique: true
  end
end
