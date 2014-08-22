require 'find'

def logger
  @logger ||= Logger.new(STDOUT).tap{|logger|
    logger.formatter = proc { |severity, datetime, progname, msg|
      "#{progname} #{datetime} #{severity}: #{msg}\n"
    }
    logger.datetime_format = "%Y-%m-%d %H:%M:%S"
    logger.level = Logger::INFO
  }
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
          blob = Blob.where(uri: path).first
          unless blob
            logger.info "load file #{path}"
            Blob.create(
                name: basename,
                mime: Mime.fetch(ext[/\w+/]){|fallback| "unknown/#{fallback}" }.to_s,
                uri: path,
                size: s.size,
                created_at: s.ctime,
                modified_at: s.mtime
            )
          else
            if blob.modified_at != s.mtime
              logger.info "update file #{path}"
              blob.update(
                  name: basename,
                  mime: Mime.fetch(ext[/\w+/]){|fallback| "unknown/#{fallback}" }.to_s,
                  uri: path,
                  size: s.size,
                  created_at: s.ctime,
                  modified_at: s.mtime
              )
            else
              logger.debug "ignore file #{path}"
            end
          end
        end
      end
    end
  end

  task :cleanup => :environment do
    Blob.all.each do|blob|
      unless File.exist? blob.uri
        logger.info "remove: #{blob.uri}"
        blob.delete
      end
    end
  end

  task :digest => :environment do
    Blob.all.each do|blob|
      DigestWorker.perform_async(blob.id) if DigestWorker.accept?(blob)
    end
  end
end