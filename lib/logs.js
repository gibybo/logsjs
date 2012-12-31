var http = require('http');
var url = require('url');
var querystring = require('querystring');

(function() {
  var x = function(token) {
    this.token_ = token;
  };

  var host = 'http://tredev.giby.tv:8080';

  x.prototype.stat = function(jobName, opt_params, cb) {
    var params = opt_params || {};
    params._apiToken = this.token_;
    params._jobName = jobName;
    this.httpPost_(host + '/api/stat', params, cb || function() {});
  };

  x.prototype.error = function(jobName, errorName, opt_params, opt_exception, cb) {
    var params = opt_params || {};
    params._apiToken = this.token_;
    params._jobName = jobName;
    params._errorName = errorName;
    if (opt_exception) {
      if (opt_exception instanceof Error) {
        params._exception = opt_exception.stack;
      } else {
        params._exception = opt_exception.toString();
      }
    }
    this.httpPost_(host + '/api/error', params, cb || function() {});
  };

  x.prototype.httpPost_ = function(reqUrl, params, cb) {
    var parsedUrl = url.parse(reqUrl);
    for (var p in params) {
      if (typeof params[p] === 'object') {
        params[p] = JSON.stringify(params[p]);
      }
    }
    var data = querystring.stringify(params);
    var req = http.request({
      host: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'User-Agent': 'LogsJS v0.1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    }, function(resp) {
      var result = '';
      resp.setEncoding('utf8');
      resp.on('data', function(chunk) {
        result += chunk;
      });
      resp.on('end', function() {
        cb(null, result);
      });
    });
    req.on('error', cb);
    req.end(data);
  };

  module.exports = x;
})();
