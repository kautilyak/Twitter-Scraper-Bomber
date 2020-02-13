const api = require('./config.js');
var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader(argv['f']);

var freq = argv['t'];
var count = 0;
var e_log = 0;
var invalid = 0;
var blocked = 0;
var rate_trigger = false;
var file_data;
console.log(argv['f']);

lr.on('line', function (id) {
	var date = new Date();
	var username;
    //'line' contains the current line without the trailing newline character.
	
		file_data = fs.readFileSync(`./${argv['f']}`, 'utf8');
		
		//Check if user_id is valid
		
		api.get('users/lookup', { user_id: `${id}` }, function(err, data, response) {
		  
			if(data.errors) {
				switch(data.errors[0].code){
					case 17: 
						console.log('Not exist');
						break;		
					}
			} else {
				username = data[0].name;
			}
		});
		
		var text = `Hello Cryptonite! How many times have you missed a buying oppertunity in the crypto market? You sure you want that to happen again? 
					'FOLLOW me and TURN ON ALERTS' to get regular alerts about 190 different crypto, whenever there's a movement in the market. 
					Starting from Currency pair updates to market statistics. #CryptoBot 🚀🚀`;
        var obj = {
            "event": {
                "type": "message_create",
                "message_create": {"target": {"recipient_id": id}, "message_data": {"text": text}}
            }
        };
		
		
        api.post("direct_messages/events/new", obj, (err, data, response) => {
           
			console.log(data);
            if (data.event) {
                e_log++; //messages sent count
            }
            if (data.errors) {
                switch (data.errors[0].code) {

                    case 108:
                        invalid++; //invalid count inc.
                        break;

                    case 349:
                        blocked++; //blocked count inc.
                        break;

                    case 226:

                        //lr.close(); //IF rate limited , connection closes.
						rate_trigger = true;
                         // console.log(`\n\n - You are being rate limited. Please try after a while.
                         // \n ${colors.yellow('Lines Progressed :')} ${colors.green(count-1)}
                         // \n ${colors.yellow('Messages Sent :')} ${colors.green(e_log)}
                         // \n ${colors.yellow('Non-Existent users :')} ${colors.green(invalid)}
                         // \n ${colors.yellow("Can't Message user :")} ${colors.green(blocked)}`);
                        break;

                }
            }
            count++;
        });
        // pause emitting of lines...
        lr.pause();
		
		if(rate_trigger) {
			setTimeout(() => {
				// ...do your asynchronous line processing..
				setTimeout(function () {

					// ...and continue emitting lines.
					lr.resume();
					rate_trigger = false;
				}, freq);
			}, 600000);
		} else {
			// ...do your asynchronous line processing..
			setTimeout(function () {

				// ...and continue emitting lines.
				lr.resume();
			}, freq);
			
			file_data = file_data.replace(`${id}`, ''); 
		}
		
		file_data = file_data.replace(/^\s*[\r\n]/gm, '');
		
		fs.writeFileSync(`./${argv['f']}`, file_data, 'utf-8');
		console.log(count + ' - ' + colors.yellow(id));
		
});





