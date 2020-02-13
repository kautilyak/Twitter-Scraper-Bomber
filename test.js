var api = require('./config.js');
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('t4.txt');
var fs = require('fs');
var colors = require('colors');
var rate_trigger = false;
var file_data;
	
lr.on('line', function (id) {
    //'line' contains the current line without the trailing newline character.
	
		file_data = fs.readFileSync(`./t4.txt`, 'utf8');
		
		//Check if user_id is valid
		
		api.get('users/lookup', { user_id: `${id}` }, function(err, data, response) {
		  
			if(data.errors) {
				switch(data.errors[0].code){
					case 17: 
						console.log('Not exist');
						file_data = file_data.replace(`${id}`, ''); 
						file_data = file_data.replace(/^\s*[\r\n]/gm, '');
						fs.writeFileSync(`./t4.txt`, file_data, 'utf-8');
						break;	
					
					case 88:
						console.log(colors.red('App on cooldown mode'));
						rate_trigger = true;
						break;
					}
			}
			
		});
		
        // pause emitting of lines...
        lr.pause();
		
		if(rate_trigger) {
			
			setTimeout(() => {
				
				setTimeout(function () {

					lr.resume();
					rate_trigger = false;
					
				}, 300);
				
			}, 902000);
		} else {
			setTimeout(function () {

				lr.resume();
				
			}, 10);
		}
		
		
		
		
		
		console.log('ID - ' + colors.yellow(id));
		
});





