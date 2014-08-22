class DigestWorker
  include Sidekiq::Worker

  BUF_SIZE = 1024 * 1024 * 1024

  def perform(id)
    blob = Blob.find(id)
    begin
      if self.class.accept?(blob)
        logger.info { "digest for \"#{blob.uri}\"" }
        digest = digest(blob.uri)
        blob.update(digest: digest)
      end
    rescue Exception => e
      logger.error "path => #{blob.uri} error: #{e.message}"
      logger.error e.backtrace
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

  def self.accept?(blob)
    !blob.digest || File.stat(blob.uri).mtime != blob.modified_at
  end

end