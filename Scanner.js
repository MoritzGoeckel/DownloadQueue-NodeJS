var cheerio = require('cheerio');

module.exports = class Scanner{

    constructor(recievedLinks)
    {
        this.recievedLinks = recievedLinks;
    }
    
    onGotPage(html, url)
    {
        var mails = [];
        
        let $ = cheerio.load(html);
        
        var theBase = this;

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

        this.recievedLinks(mails, verein, url);
    }
}