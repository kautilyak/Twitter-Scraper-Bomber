const api = require('./config.js');
var argv = require('minimist')(process.argv.slice(2));
var fs = require("fs");

var acc = argv['a'];
var c=-1;
var id_list = [];
var count = 0
console.log('Scraping IDs...');

var timeout = setInterval(() => {
	console.clear();
	api.get('followers/ids',{ screen_name: 'BitMEXdotcom' , cursor: c}, function (err, data, response) {
		//console.dir(data);
		if(data.ids) {
			data.ids.forEach((id, index) => {
			console.log(id);
			});
			c = data['next_cursor'];
			if(c == 0) {
				clearInterval(timeout);
			}
		}
		
	});
}, 14000);

