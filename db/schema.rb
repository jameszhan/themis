# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140822072302) do

  create_table "blobs", force: true do |t|
    t.string   "digest"
    t.string   "uri"
    t.integer  "size",        limit: 8
    t.string   "mime"
    t.string   "name"
    t.datetime "modified_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tasks", force: true do |t|
    t.string   "name"
    t.text     "desc"
    t.integer  "importance"
    t.integer  "urgency"
    t.datetime "start"
    t.integer  "duration",   limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "progress",             default: 0
  end

  create_table "timesheets", force: true do |t|
    t.string   "title"
    t.integer  "category_id"
    t.string   "desc"
    t.datetime "started_at"
    t.datetime "completed_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "timesheets", ["category_id"], name: "index_timesheets_on_category_id", using: :btree

end
