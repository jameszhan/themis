json.array!(@categories) do|id, name|
    json.id id
    json.name name
end