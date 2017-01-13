var Cheerio = require('cheerio');
var DownloadQueue = require('./DownloadQueue.js');

var queue = new DownloadQueue(100, onGotPage);

//The generation of the urls to scan
for(var currentId = 0; currentId < 6000; currentId++)
    queue.enqueDownload("http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1");

function onGotPage(url, html)
{
    console.log("Got page: " + url + " " + queue.getQueueLength() + "Q " + queue.getOpenConnections() + "c's");
    let $ = Cheerio.load(html);

    //The actual scanning code goes here
    
    /*$(".detailrow").each(function( index ) {
        if(verein == "NULL" && $( this ).text().startsWith("Verein"))
            verein = $(this).text().substr("Verein".length);
    });*/
}