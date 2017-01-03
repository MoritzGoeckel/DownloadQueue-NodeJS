var Downloader =  require('./Downloader.js');
var Scanner = require('./Scanner.js');
var FileStream = require('fs');

var openConnections = 0;

var inputCount = 0;

var s = new Scanner(function(mails, verein, url){
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

    inputCount++;
    console.log(inputCount);
});

//doRegularDownload();
doErrorDownload();

function doRegularDownload(){
    for(var currentId = 0; currentId < 6000; currentId++)
        downloadAndDelay("http://sportunion.at/de/sportangebote/vereine/clubshow-"+ currentId +"?Page=1");
}

function doErrorDownload(){
    var input = FileStream.createReadStream('1.log');
    readLines(input, function(data) {
        downloadAndDelay(data);
    });
}

function downloadAndDelay(url)
{
    if(openConnections < 20)
    {
        console.log("Download: " + url);
        new Downloader(s, url, function(){ openConnections--; });
        openConnections++;
    }
    else
        setTimeout(function() {
            downloadAndDelay(url)
        }, 100 + (Math.random() * 1000));
}

//###################################### Readline #####

function readLines(input, func) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\r\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\r\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
  });
}