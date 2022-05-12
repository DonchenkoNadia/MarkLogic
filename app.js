var marklogic = require('marklogic');
var fs = require("fs");

var connection = {
  host: 'localhost',
  port: 6000,
  user: 'admin',
  password: 'admin'
};

var dbClient = marklogic.createDatabaseClient(connection);

/* 

1. figure out how to check all files in direcotry 
2. how to generate uri and content for every document in folder
3. lines of writing that to the DB are below

*/

/*  Trying p. 1 */
var dir = "./data"

/* The callback gets two arguments (err, files)
where files is an array of the names of the files in the directory excluding'.' and '..'. */

function readFiles(dir, onFileContent, onError) {
  fs.readdir(dir, function(err, files) {
    if(err) {
      onError(err);
      return;
    }  
    console.log("\nReading to dict the content of files with following names: ");
    files.forEach(function(file) {
        console.log(file);
        fs.readFile(dir + '/' + file, 'utf-8', function(err, content) {
          if (err) {
            onError(err);
            return;
          }
          onFileContent(file, content);
        });
      });
    });
}


readFiles(dir, function(filename, content) {
  var uri = "/another_patents/" + filename;

  var docDescriptor = [
    {
      "uri": uri,
      "contentType": "application/json",
      "content": content, 
      "collections": ["hiTech", "knowHow", "innovation"]
    }
  ];

  // insert the document to DB
  dbClient.documents.write(docDescriptor).result(
    function(response){
      console.log("Finished with loading of document " + uri);
    },
    function(error) {
        console.log(JSON.stringify(error));
      }
  );

}, function(err) {
  console.log(err);
});

/*
console.log("Here comes more code! "  + dict);
for (var key in dict){
  console.log("\nChecking the content of created dict: ");
  console.log("Key: " + key);
  console.log("Value: " + dict[key]);
}


var myURI = 'naf_test_hello.json'

var doc = {
  message: 'hello world'
};

dbClient.documents.write({
  uri: myURI,
  content: doc
})
.result()
.then(function(response) {
  return dbClient.documents.read(response.documents[0].uri).result();
})
.then(function(document) {
  console.log(document[0].content);
})
.catch(function(error) {
  console.log(error);
}); 
*/