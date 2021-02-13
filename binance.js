var http = require('http');
var url = require('url');
var querystring = require('querystring');

var parse_msg = function(msg) {
  var side = "";
  var position = "";
  var symbol = "";
  var levs = [];
  var entries = [];
  var targets = [];
  var stops = [];

  // Side is Buy
  // Position is Long
  side_str = /(buy|sell) ?\/ ?(long|short)/gi.exec(msg)[0];
  side = side_str.split("/")[0];
  position = side_str.split("/")[1];

  console.log(side, position);

  symbol = /#([0-9A-Z])\w+/g.exec(msg)[0];
  // Symbol is #BTCUSDT, remove # if needed
  // symbol = symbol.split("#")[1];
  console.log(symbol);

  // Find substring in parentheses and find x5 x10 substring
  lev_str = /\(.*futures ?\)/gi.exec(msg)[0];
  levs = lev_str.match(/x\d+/g);
  // Leverage is x10 x20, remove "x" if needed
  // lev = lev.split("x")[1];
  console.log(levs)

  // Find entry subtring and find entry price
  entry_str = /entry(.*)\n?target/gi.exec(msg)[0];
  entries = entry_str.match(/\d+\.?(\d+)?/g);
  console.log(entries)

  // Find target subtring and find target percentage
  target_str = /target(.*)\n?stop/gi.exec(msg)[0];
  targets = target_str.match(/\d+\.?(\d+)?/g);
  console.log(targets)

  // Find stoploss substrt and find stop percentage
  stop_str = /stoploss:.*\n?-/gi.exec(msg)[0];
  stops = stop_str.match(/\d+\.?(\d+)?/g);
  console.log(stops)

  return {
    side: side,
    position: position,
    symbol: symbol,
    levs: levs,
    entries: entries,
    targets: targets,
    stops: stops
  };
}

//create a server object:
http.createServer(function (req, res) {
  var q = url.parse(req.url, true).query;
  var msg = parse_msg(q.msg);
  console.log(msg);

  // New future order
  binance_query_open_order = {
    symbol: msg.symbol,
    side: msg.side,
    positionSide: msg.position,
    type: "MARKET",
    timeInForce: "GTE_GTC",
    quantity:1,
    timestamp:Number(new Date()),
    newOrderRespType: "RESULT"
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://testnet.binancefuture.com/fapi/v1/order?' + querystring.stringify(binance_query_open_order),
    'headers': {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': 'api-key'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

  // Create TP
  binance_query_tp = {
    symbol: msg.symbol,
    side: msg.side,
    positionSide: msg.position,
    type: "MARKET",
    timeInForce: "GTE_GTC",
    quantity:1,
    timestamp:Number(new Date()),
    newOrderRespType: "RESULT"
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://testnet.binancefuture.com/fapi/v1/order?' + querystring.stringify(binance_query_tp),
    'headers': {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': 'api-key'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

  // Create SL
  binance_query_sl = {
    symbol: msg.symbol,
    side: msg.side,
    positionSide: msg.position,
    type: "MARKET",
    timeInForce: "GTE_GTC",
    quantity:1,
    timestamp:Number(new Date()),
    newOrderRespType: "RESULT"
  }
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': 'https://testnet.binancefuture.com/fapi/v1/order?' + querystring.stringify(binance_query_sl),
    'headers': {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': 'api-key'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
  res.end(result);

}).listen(8080); //the server object listens on port 8080
