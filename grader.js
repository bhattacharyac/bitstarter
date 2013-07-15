#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var urlfile = "localfile.txt";
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLURL_DEFAULT = "google.com";
var http = require('http');


var assertFileExists = function(infile) {
    var instr = infile.toString();
//console.log(instr);
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }

    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, htmlurl, checksfile) {
//console.log("in the function " + htmlurl);

      if(htmlurl!=null)
      {

      var options = {
      host: htmlurl,
      path: '/'
      }


      var request = http.request(options, function(res) {


      var data = '';
      res.on('data', function (chunk) {
      data += chunk;

      });


        res.on('end', function () {

        var htmldata = data;


        var outfile = 'localfile.txt';

        fs.writeFileSync("localfile.txt", data);
 
        });


    request.on('error', function (e) {
    console.log(e.message);
    });
    }); //end of request
    request.end();

    }//end of if block
    if(htmlurl == null)
    {

      urlfile=htmlfile;
    } 


    $ = cheerioHtmlFile(urlfile);
    var checks = loadChecks(checksfile).sort();




    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;

};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html' )
        .option('-u, --url <http_url>','HTTP URL')
        .parse(process.argv);
    var local_file = program.url;
    var checkJson = checkHtmlFile(program.file,program.url , program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
