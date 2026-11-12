require 'webrick'

class MultiPageFileHandler < WEBrick::HTTPServlet::FileHandler
  def do_GET(req, res)
    clean_path = req.path.chomp('/')
    doc_root = @config[:DocumentRoot]
    
    # Clean URL rewrite support: /about -> /about/index.html or /about.html
    if !clean_path.empty? && clean_path != '/'
      dir_index = File.join(doc_root, clean_path, 'index.html')
      html_file = File.join(doc_root, "#{clean_path}.html")
      
      if File.exist?(dir_index) && !req.path.end_with?('/') && !File.file?(File.join(doc_root, req.path))
        res.set_redirect(WEBrick::HTTPStatus::MovedPermanently, "#{clean_path}/")
        return
      elsif File.exist?(html_file) && !File.file?(File.join(doc_root, req.path))
        req.instance_variable_set(:@path, "#{clean_path}.html")
      end
    end

    begin
      super
    rescue WEBrick::HTTPStatus::NotFound
      not_found_file = File.join(doc_root, '404.html')
      if File.exist?(not_found_file)
        res.status = 404
        res['Content-Type'] = 'text/html'
        res.body = File.read(not_found_file)
        return
      else
        raise
      end
    end

    # Bypass sendfile syscall which fails inside macOS sandbox
    if res.body.is_a?(IO) || res.body.is_a?(File)
      res.body = res.body.read
    end
  end
end

port = 8080
server = WEBrick::HTTPServer.new(
  Port: port,
  DocumentRoot: File.expand_path(__dir__),
  BindAddress: '0.0.0.0',
  Logger: WEBrick::Log.new($stderr, WEBrick::Log::WARN),
  AccessLog: []
)

server.mount('/', MultiPageFileHandler, File.expand_path(__dir__))
trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }

puts "SERVER_READY on port #{port}"
$stdout.flush

server.start
