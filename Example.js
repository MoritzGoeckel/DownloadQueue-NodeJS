//Including the library
var DownloadQueue = require('download-queue'); //"./DownloadQueue.js" if you installed it via github 

//Creating the queue object
//Setting the limit to 100 simultaneous connections
var queue = new DownloadQueue(100, true); 

//Generating some requests
for(var currentId = 0; currentId < 6000; currentId++)
    queue.enqueDownload(
        "http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1", //Url
        gotPageCallback //callback
    );

//The callback method
function gotPageCallback(url, error, response, html, $) 
{
    console.log("Got page: " + url + " " + queue.getQueueLength() + "Q " + queue.getOpenConnections() + "c's");
    
    //Using JQuery selectors
    console.log($('h1').text())
    
    //Todo: The actual scanning code goes here
}