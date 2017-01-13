var request = require('request');

module.exports = class DownloadQueue{
    constructor(openConnectionLimit, callback)
    {
        var base = this;
        var openConnections = 0;

        this.callback = callback;
        this.openConnectionLimit = openConnectionLimit;
        this.urlQueue = [];

        this.interval = setInterval(checkDownloadQueue, 100);

        function checkDownloadQueue()
        {
            if(base.urlQueue.length != 0 && openConnections < base.openConnectionLimit)
            {
                var url = base.urlQueue.shift();               
                openConnections++;

                var options = {
                    url: url,
                    headers: {
                        'User-Agent': 'request'
                    }
                };

                request(options, function(error, response, body){
                    if (!error && response.statusCode == 200) 
                    {
                        openConnections--; 
                        base.callback(url, body);
                    }
                    else
                    {
                        console.log("Download failed " + url);
                        openConnections--;
                        base.enqueDownload(url);
                    }
                });
            }
        }
    }

    enqueDownload(url)
    {
        this.urlQueue.push(url);
    }

    destroy()
    {
        clearInterval(this.interval);
    }
}