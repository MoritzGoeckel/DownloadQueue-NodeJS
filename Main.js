var Downloader =  require('./Downloader.js');
//JQuery for node
var Cheerio = require('cheerio');

var openConnections = 0;
var maxConnections = 20;

//The generation of the urls to scan
for(var currentId = 0; currentId < 6000; currentId++)
    downloadAndDelay("http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1");

function downloadAndDelay(url)
{
    if(openConnections < maxConnections)
    {
        //Do it now
        console.log("Download: " + url);
        
        openConnections++;

        new Downloader(url, 
            function(url, body){ 
                console.log("Download succeeded")
                openConnections--; 
                onGotPage(url, body); 
            },
            function(url, response, error){
                console.log("Download failed");
                openConnections--; 
                downloadAndDelay(url);
                //FileStream.appendFile('./downloadError.log', this.url + "\r\n"); 
            }
        );
    }
    else{
        //Do it later
        setTimeout(function() {
            downloadAndDelay(url)
        }, 100 + (Math.random() * 1000));
    }
}

//The actual scanning code
onGotPage(url, html)
{
    var mails = [];
    let $ = Cheerio.load(html);
    var verein = "NULL";

    $(".detailrow").each(function( index ) {
        if(verein == "NULL" && $( this ).text().startsWith("Verein"))
        {
            verein = $(this).text().substr("Verein".length);
        }
    });

    $(".detailrow a").each(function( index ) {
        if($( this ).attr("href").startsWith("mailto:"))
        {
            var mail = $(this).text();
            mails.push(mail);
        }
    });

    if(verein == "NULL")
        verein = "";

    var str = verein + ";";
    if(mails.length != 0)
        str += mails[0];
    
    str += ";" + url + ";" + "\r\n";

    if(verein != "" || mails.length != 0)
    {
        console.log(str);
        FileStream.appendFile('./mails.csv', str, function (err) { 
            if(err != null)
                console.log("ERROR: " + err); 
        });
    }
}