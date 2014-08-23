require 'find'

def logger
  @logger ||= Logger.new(STDOUT).tap{|logger|
    logger.formatter = proc { |severity, datetime, progname, msg|
      "#{progname} #{datetime} #{severity}: #{msg}\n"
    }
    logger.datetime_format = '%Y-%m-%d %H:%M:%S'
    logger.level = Logger::INFO
  }
end

def upsert_blob(path, basename, ext)
  stat = File.stat(path)
  blob = Blob.where(uri: path).first
  if blob
    if blob.modified_at != stat.mtime
      logger.info "update file #{path}"
      blob.update(
          name: basename,
          mime: Mime.fetch(ext[/\w+/]){|fallback| "unknown/#{fallback}" }.to_s,
          uri: path,
          extension: ext,
          size: stat.size,
          created_at: stat.ctime,
          modified_at: stat.mtime
      )
    else
      logger.debug "ignore file #{path}"
    end
  else
    logger.info "load file #{path}"
    Blob.create(
        name: basename,
        mime: Mime.fetch(ext[/\w+/]){|fallback| "unknown/#{fallback}" }.to_s,
        uri: path,
        extension: ext,
        size: stat.size,
        created_at: stat.ctime,
        modified_at: stat.mtime
    )
  end
end

IGNORE_EXTENSIONS = %w{.mbp .apnx .iml .ipr .iws .class .jar .lnk .url .bak .tmp .lpr .o .obj .demo .gem .log .sqlite3 .sqlite3-journal .exe .out}
OSX_APP_EXTENSION = %w{.pages .numbers .key .app}

namespace :webfs do
  task :load => :environment do
    dirs = YAML.load_file(File.expand_path('config/webfs.yml', Rails.root))
    dirs.each do|dir|
      Find.find(dir) do|path|
        ext = File.extname(path).downcase
        basename = File.basename(path, ext)
        if basename[0] == ?. || ext.empty? || IGNORE_EXTENSIONS.include?(ext)
          logger.info "prune directory or file #{path}."
          Find.prune
        elsif File.file?(path)
          upsert_blob(path, basename, ext)
        elsif File.directory?(path)
          if OSX_APP_EXTENSION.include?(ext)
            upsert_blob(path, basename, ext)
            logger.info "prune path #{path}."
            Find.prune
          else
            next
          end
        else
          logger.info "unaccept path #{path}."
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
    Blob.where(digest: nil).each do|blob|
      DigestWorker.perform_async(blob.id) if DigestWorker.accept?(blob)
    end
  end
end