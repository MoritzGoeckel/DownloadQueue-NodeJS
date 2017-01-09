var request = require('request');
var FileStream = require('fs');

module.exports = class Downloader{

    constructor(url, callbackSuccess, callbackError)
    {
        this.url = url;
        this.callbackSuccess = callbackSuccess;
        this.callbackError = callbackError;

        var options = {
            url: this.url,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, this.handleResponse.bind(this));
    }

    handleResponse (error, response, body) {
        
        /*if(response.statusCode == 302){
            console.log("Moved to: " + response.headers['Location']);
        }*/
        
        if (!error && response.statusCode == 200) 
        {
            this.callbackSuccess(this.url, body);
        }
        else
        {
            this.callbackError(this.url, response, error);
        }
    }
}