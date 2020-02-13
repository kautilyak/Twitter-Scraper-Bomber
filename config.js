const Twit = require('twit');


var T = new Twit({
  consumer_key:         'EEZ8y6fu8G8Lx7rSlStOiUQm1',
  consumer_secret:      '5UUeBf4tq26vunh3FVTk1yPhP3CnAR9kamcNQBWvkFLXhmea97',
  access_token:         '1141208687001780225-XhJ02lWq0Wd0t6UGlnrY8X2NcdjZIW',
  access_token_secret:  'ZkdktoFcOfbEKC26Ht25OeiYZngRv6M0cxs6LqRbWvYkb',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})


const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest',
  qs: {
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'd6db63aa-9881-4b4d-898e-bea37fd0ae6b'
  },
  json: true,
  gzip: true
};


function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//Check isJSON
function isJSON(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
	
module.exports = T;
module.exports.requestOptions = requestOptions;
module.exports.formatNumber = formatNumber;
module.exports.isJSON = isJSON;