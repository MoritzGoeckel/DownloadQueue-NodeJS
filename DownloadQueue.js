const request = require('request');
const cheerio = require('cheerio')

let queue = Symbol();
let interval = Symbol();
let openConnections = Symbol();

module.exports = class DownloadQueue{
    constructor(openConnectionLimit, useJQuery)
    {
        let base = this;

        //Private
        this[openConnections] = 0;
        this[queue] = [];
        this[interval] = setInterval(checkDownloadQueue, 1);

        //Public
        this.openConnectionLimit = openConnectionLimit;
        this.useJQuery = useJQuery;

        function checkDownloadQueue()
        {
            if(base[queue].length != 0 && base[openConnections] <= base.openConnectionLimit)
            {
                var queEntry = base[queue].shift();               
                base[openConnections]++;

                var options = {
                    url: queEntry.url,
                    headers: {
                        'User-Agent': 'request'
                    }
                };

                request(options, function(error, response, body){
                    if (!error && response.statusCode == 200) 
                    {
                        base[openConnections]--; 

                        let $ = null;
                        if(base.useJQuery)
                            $ = cheerio.load(body);
                        
                        queEntry.callback(queEntry.url, error, response, body, $);
                    }
                    else
                    {
                        console.log("Download failed, reenqueing: " + queEntry.url);
                        base[openConnections]--;
                        base.enqueDownload(queEntry.url);
                    }
                });
            }
        }
    }

    enqueDownload(url, callback)
    {
        this[queue].push({url:url, callback:callback});
    }

    destroy()
    {
        clearInterval(this[interval]);
    }

    getQueueLength()
    {
        return this[queue].length;
    }

    getOpenConnections()
    {
        return this[openConnections];
    }
}