class CreateBlobs < ActiveRecord::Migration
  def change
    create_table :blobs do |t|
      t.string :digest
      t.string :uri
      t.integer :size, limit: 8
      t.string :mime
      t.string :name
      t.datetime :modified_at

      t.timestamps
    end

    add_index :blobs, [:uri], unique: true
  end
end
