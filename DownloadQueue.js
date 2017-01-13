var request = require('request');
var urlQueue = Symbol();
var interval = Symbol();
var openConnections = Symbol();

module.exports = class DownloadQueue{
    constructor(openConnectionLimit, callback)
    {
        var base = this;

        //Private
        this[openConnections] = 0;
        this[urlQueue] = [];
        this[interval] = setInterval(checkDownloadQueue, 1);

        //Public
        this.callback = callback;
        this.openConnectionLimit = openConnectionLimit;

        function checkDownloadQueue()
        {
            if(base[urlQueue].length != 0 && base[openConnections] <= base.openConnectionLimit)
            {
                var url = base[urlQueue].shift();               
                base[openConnections]++;

                var options = {
                    url: url,
                    headers: {
                        'User-Agent': 'request'
                    }
                };

                request(options, function(error, response, body){
                    if (!error && response.statusCode == 200) 
                    {
                        base[openConnections]--; 
                        base.callback(url, body);
                    }
                    else
                    {
                        console.log("Download failed " + url);
                        base[openConnections]--;
                        base.enqueDownload(url);
                    }
                });
            }
        }
    }

    enqueDownload(url)
    {
        this[urlQueue].push(url);
    }

    destroy()
    {
        clearInterval(this[interval]);
    }

    getQueueLength()
    {
        return this[urlQueue].length;
    }

    getOpenConnections()
    {
        return this[openConnections];
    }
}