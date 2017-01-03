var request = require('request');
var FileStream = require('fs');

module.exports = class Downloader{

    constructor(scanner, url, callback)
    {
        this.isBusy = true;
        this.scanner = scanner;
        this.url = url;
        this.callback = callback;

        var options = {
            url: this.url,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, this.handleResponse.bind(this));
    }

    handleResponse (error, response, body) {
        this.isBusy = false;        
        
        this.callback(this.url, response);

        if(typeof response == 'undefined')
        {
            console.log("Error downloading: " + this.url);
            FileStream.appendFile('./downloadError.log', this.url + "\r\n");
            return;
        }
        
        if(response.statusCode == 302){
            console.log("Moved to: " + response.headers['Location']);
        }
        
        if (!error && response.statusCode == 200) {
            this.scanner.onGotPage(body, this.url);
        }
    }
}