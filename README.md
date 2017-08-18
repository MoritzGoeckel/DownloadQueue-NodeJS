# A simple Download Queue with serverside JQuery
A simple queue to download web pages in NodeJS and analyze them with server side JQuery if necessary

## Install
```
npm install download-queue
```

## Features
* Parallel downloads
* Limit simultaneous connections
* Retry on failed downloads

## API
``` Javascript
constructor(openConnectionLimit, useJQuery)
.enqueDownload(url, callback)
.destroy()              //Stopps and deletes queue
.getQueueLength()       //How many are enqued
.getOpenConnections()   //Currently open connections
```

## Usage
``` Javascript
//Including the library
var DownloadQueue = require('./DownloadQueue.js');

//Creating the queue object
//Setting the limit to 100 simultaneous connections
var queue = new DownloadQueue(100, true); //Asking for JQuery in callback 

//Generating some requests
for(var currentId = 0; currentId < 6000; currentId++)
    queue.enqueDownload(
        "http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1", //Url
        gotPageCallback //callback
    );

//The callback method
function gotPageCallback(url, error, response, html) 
{
    console.log("Got page: " + url + " " + queue.getQueueLength() + "Q " + queue.getOpenConnections() + "c's");

    //Using JQuery selectors
    console.log($('h1').text())

    //Todo: The actual scanning code goes here
}
```