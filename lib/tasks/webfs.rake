require 'find'

def fallback_mime(fallback)
  if ['epub', 'mobi'].include?(fallback)
    "application/#{fallback}"
  else
    "unknown/#{fallback}"
  end
end

namespace :webfs do
  task :load => :environment do
    dirs = YAML.load_file(File.expand_path('config/webfs.yml', Rails.root))
    dirs.each do|dir|
      Find.find(dir) do|path|
        unless File.directory?(path)
          dir, base = File.split(path)
          s = File.stat(path)
          ext = File.extname(path)
          basename = File.basename(path, ext)
          Blob.create(
              name: basename,
              mime: Mime.fetch(ext[/\w+/]){|fallback| fallback_mime(fallback) }.to_s,
              uri: path,
              size: s.size,
              created_at: s.ctime,
              modified_at: s.mtime
          )
        end
      end
    end
  end

  task :digest => :environment do
    Blob.all.each do|blob|
      DigestWorker.perform_async(blob.id) if DigestWorker.accept?(blob)
    end
  end
end