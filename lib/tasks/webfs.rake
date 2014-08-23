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

namespace :webfs do
  task :load => :environment do
    config = YAML.load_file(File.expand_path('config/webfs.yml', Rails.root))
    config['dirs'].each do |dir|
      Find.find(dir) do|path|
        ext = File.extname(path).downcase
        basename = File.basename(path, ext)
        if basename[0] == ?.
          logger.info "prune directory or file #{path}."
          Find.prune
        elsif File.directory?(path)
          if config['osx_formats'].include?(ext)
            upsert_blob(path, basename, ext)
            logger.info "prune path #{path}."
            Find.prune
          else
            next
          end
        elsif ext.empty? || config['ignore_extensions'].include?(ext)
          logger.info "prune file #{path}."
          Find.prune
        elsif File.file?(path)
          upsert_blob(path, basename, ext)
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

  ###
  # SELECT a.id, a.digest, a.uri, a.name, a.mime, a.extension, a.modified_at, b.cnt
  # FROM themis.blobs a
  # INNER JOIN (
  #   SELECT digest, COUNT(*) AS cnt
  #   FROM themis.blobs
  #   GROUP BY digest
  #   HAVING COUNT(*) > 1
  # ) b ON a.digest = b.digest
  # ORDER BY a.digest
  ###
  task :dups => :environment do
    sql =<<-SQL
      INNER JOIN (
        SELECT digest, COUNT(*) AS cnt
        FROM blobs
        GROUP BY digest
        HAVING COUNT(*) > 1
      ) b ON b.digest = blobs.digest
    SQL
    Blob.joins(sql).order('blobs.digest').each{|blob| logger.info "#{blob.digest} #{blob.name}"}
  end

  task :digest => :environment do
    Blob.where(digest: nil).each do|blob|
      DigestWorker.perform_async(blob.id) if DigestWorker.accept?(blob)
    end
  end
end