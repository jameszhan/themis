class DigestWorker
  include Sidekiq::Worker

  BUF_SIZE = 1024 * 1024 * 1024

  def perform(id)
    blob = Blob.find(id)
    if blob
      if accept?(blob)
        begin
          logger.info { "digest for \"#{blob.uri}\"" }
          digest = digest(blob.uri)
          blob.update(digest: digest)
        rescue Exception => e
          logger.error "path => #{blob.uri} error: #{e.message}"
          logger.error e.backtrace
        end
      else
        logger.info "Not accept #{blob.uri}"
      end
    else
      logger.info "can't find the blob for #{id}."
    end
  end

  def digest(uri)
    #sha = Digest::SHA1.new
    sha = Digest::SHA256.new
    open(uri, 'rb') do|io|
      while buf = io.read(BUF_SIZE)
        sha.update(buf)
      end
    end
    sha.hexdigest
  end

  def accept?(blob)
    stat = File.stat(blob.uri)
    stat.file? && (!blob.digest || stat.mtime != blob.modified_at)
  end

end