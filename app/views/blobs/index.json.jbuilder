json.array!(@blobs) do |blob|
  json.extract! blob, :id, :digest, :uri, :size, :mime, :name, :modified_at
  json.url blob_url(blob, format: :json)
end
