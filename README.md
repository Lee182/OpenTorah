# opentorah
An express app (in very early stages at the moment) which renders the hebrew bible and mechanical transation to your browser from a mongo database.
<br/>
The data structure is a flat level structure where a single word is an single entry
## Install
### Dependencies
- mongodb (see here for instalation)
- nodejs

### Initilizing
```
$ git clone /respitory/
$ cd /respitory/

$ mongoimport --db=reader -c torah --jsonArray torah.json
$ npm install
```
## Start-up

Navigate to the opentorah folder and run
```
$ node app.js
// the default express server is at http://localhost:5775
```
In the url you can type localhost:5775/bookname/1?v=5
<br />
## Express App Functionality (...So far)
With the app 
```
localhost:5775/genesis                        // renders genesis 1
localhost:5775/leviticus/19                   // renders leviticus chapter 19
localhost:5775/deuteronomy/6?v=4              // uses a verse query renders only deuteronomy 6:4
```
Note the only books avalible atm is this array``["genesis", "exodus", "leviticus", "numbers", "deuteronomy"]``
## db queries (examples)
### Schema
The data structure is a flat level structure where a single word is an single entry
``` 
$ mongo reader                    // Connect to reader database
> db.torah.findOne({})            // Query the torah collection with the db
{
	"_id" : 1,                       // This is an words unique identifyer
	"book" : "genesis",
	"c" : 1,                         // Chapter
	"v" : 1,                         // Hebrew verse number
	"w" : 1,                         // Word number within that verse
	"heb" : "בְּרֵאשִׁית",                // Heberew
	"eng" : "in~SUMMIT"              // English Mechanical translation from Jeff Benner
}
```

### Find a given value
db.torah.find({heb:"הַשָּׁמיִם"}).sort()
## About 0.1
Notice this project is 0.0.1 version, this is because I have some __big aims__
- A mulit-layed computerised translation with dictionaries, lexicon and concordances
- Develop a plugable translation concept
  - Where users can modify the database,
    - to improve translation, 
    - create a translation, 
    - or change words at preference    
  - This data can be exported and someone else can import the data like plugand play

