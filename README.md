#DownloadQueue
A simple queue to download web pages in NodeJS

##Features
* Parallel downloads
* Limit simultaneous connections
* Retry on failed downloads

##Usage
``` Javascript
//Include
var DownloadQueue = require('./DownloadQueue.js');

//Create object with 100 simultaneous connections and a callback
var queue = new DownloadQueue(100, onGotPage);

//Enque some urls
for(var currentId = 0; currentId < 6000; currentId++)
    queue.enqueDownload("http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1");

//React on page content as it comes
function onGotPage(url, content)
{
    console.log("Got page: " + url + " " + queue.getQueueLength() + " left in queue " + queue.getOpenConnections() + " connections open");
    //The actual scanning code goes here
}
```