class AngularHandler
  def initialize(app)
    @app = app
  end

  def call(env)
    if env["PATH_INFO"] =~ /\/calendar$/
      env["PATH_INFO"] = "index.html" # force let using index.html
    end

    status, headers, body = @app.call(env)
    [status, headers, body]
  end
end

use AngularHandler
