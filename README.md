# OpenTorah
An express app (in very early stages at the moment) which renders the hebrew bible and mechanical transation to your browser from a mongo database.
<br/>
The data structure is a flat level structure where a every single word is an single entry
## Install
### Dependencies
- [mongodb](http://docs.mongodb.org/manual/installation/)
- [nodejs](http://nodejs.org/)

### Initilizing
```
$ git clone https://github.com/Lee182/opentorah.git
$ cd opentorah

$ mongoimport --db=reader -c torah --jsonArray torah.json
$ npm install
```
(note for beginner a dollar sign means a refference to the shell or terminal)

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
How many words are there in the torah (or this data set)?
```
db.torah.count()
```
How many times does moses appear?
```
db.torah.find({eng:{$regex: "Mosheh"}}).count()           // 647
```
### Find a given value
#### Simple finds
for more about .find() you can read [in the docs](http://docs.mongodb.org/manual/reference/method/db.collection.find/) or an [example](http://docs.mongodb.org/manual/core/read-operations-introduction/)
<br/>
and query operators (those they start with a dollar sign $or) [here](http://docs.mongodb.org/manual/reference/operator/query/)
```
// Finds any word with the same value as hashamayim and sorts in ascending order
> db.torah.find({heb:"הַשָּׁמיִם"}).sort({_id: 1})

// RegEx searches are used to find pattern in text, the .limit(5) 'limits' the top 5 results
> db.torah.find({eng:{$regex: "SUMMIT"}}).limit(5)
```
### The Aggregation Framework
Again its probably good to dive in and read the [introduction](http://docs.mongodb.org/manual/core/aggregation-introduction/) and concepts on aggregation
<br/>
Here are some things you can do
Find the numbers of words without an translation eng: '[x]'?
```
db.torah.aggregate([
  // Filter by book or other fields using $match
  { $match: {eng: '[X]', $or: [{book: "exodus"}, {book: "numbers"}]} },
  
  // Group the results by book to make an report
  { $group: {_id: "$book", count: {$sum: 1}, words: {$addToSet: "$_id"}} },
  
  // Hide words array and cleanup the format
  { $project: {_id:0, book: "$_id", n:"$count"} }
])
```
Find the top 20 words in the torah?
```
db.torah.aggregate([
  { $group: {_id: "$heb", count: {$sum: 1}, eng: {$addToSet: "$eng"}} },
  { $sort: {count: -1}},
  { $limit: 20 }
])
```
Find the average number of words per chapter in an book?
```
db.torah.aggregate([
  { $group: { _id: {book: "$book", c:"$c"}, count: {$sum: 1} } },
  { $group: {_id: "$_id.book", average: {$avg: "$count"}} }
])
```
Generate an concordance of the Yhwh // do note there is 1820 results so it will overflow your terminal with information
```
db.torah.aggregate([
  { $match: {eng: {$regex: "Yhwh"}}},
  { $group: {_id: "$heb", eng: {$addToSet: "$eng"},count: {$sum:1}, ref: {$addToSet: {book: "$book", c:"$c", v:"$v",w:"$w" } } } }

//  Stage to clean up the report
//  { $group: {_id:{heb:"$_id", count:"$count"}} }
]).pretty()
```
count the number of unique hebrew words?
```
db.torah.aggregate([ 
  { $group: {_id: "$heb", eng: {$addToSet: "$eng"},count: {$sum:1} } },
  { $group: {_id:"Number of words is", n:{$sum:1}} }
]).pretty()
// { "_id" : "Number of words is", "n" : 15951 }
```
### Updating Translations
I would suggest a read of the update [docs](http://docs.mongodb.org/manual/reference/method/db.collection.update/#db.collection.update)
if you are don't recognise the syntax
<br />
First i've queryied the db to find words without values
```
> db.torah.aggregate([{$group: {_id:"$heb",eng:{$addToSet:"$eng"}}},{$match: {eng:"[X]"}}])
{ "_id" : "חַי", "eng" : [ "[X]" ] }
{ "_id" : "שְׁנֵי", "eng" : [ "[X]" ] }
{ "_id" : "מֵת", "eng" : [ "[X]" ] }
{ "_id" : "נוּכַל", "eng" : [ "[X]", "we~will~BE.ABLE" ] }
```
looking at the results I see ``{ "_id" : "נוּכַל", "eng" : [ "[X]", "we~will~BE.ABLE" ] }``
I can update the hebrew english translation
```
> db.torah.update({heb: "נוּכַל"},{$set: {eng: "we~will~BE.ABLE"}},{multi: true})
```
The shell acknowledges the write also
```
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 0 })
```
I would also recommend keeping an updatelog.js as part of contributing to the translation
```
db.torah.update({heb: "נוּכַל"},{$set: {eng: "we~will~BE.ABLE"}},{multi: true})
db.torah.update({heb: "הָעֲדָרִים"},{$set: {eng: "the~DROVE~s"}},{multi: true})
db.torah.update({heb: "וְגָלְלוּ"},{$set: {eng: "and~they~will~ROLL"}},{multi: true})
db.torah.update({heb: "אַרְבֶּה"},{$set: {eng: "I(cs)~will~make~INCREASE(V)"}},{multi: true})
```
That way you can run the script 
```
$ mongo reader updatelog.js
```

## Birdseye aims
There is a lot which could be done with this project, like creating people collection storing words people say and to whom, a events collection keeping a timeline and record of key events, or a historical refference collection. The possibilities are alot which is why for now I am focused on the reader of which I would need to incorparte dictionaries refferences in a clean UI
Notice the project is 0.0.1 version in the package.json file
<br />
Here are some aims
- A mulit-layed computerised translation with dictionaries, lexicon and concordances
- Develop a plugable translation concept
  - Where users can modify the database,
    - to improve translation, 
    - create a translation, 
    - or change words at preference    
  - This data can be exported and someone else can import the data like plugand play
## TODO
- add an array within entry for the roots/morphology of words
- mine data from [tanakh.us](http://www.tanakh.us) as the current torah collection does not hold values for whitespace 'ס' and paragrapths 'פ'
- Make a node script which backs up a torah collection
- or when you make updates to db.torah store your updatelog.js file

## Bibliography
- __Gregory Bartholomew__
    - booksTxt files  from mt-compiler 
    - DESCRIPTION:  Generates XeLaTeX code for the "Mechanical Translation of the Torah"
- __Jeff Benner__
    - [Mechanical Translaiton (Mt)](http://mechanical-translation.org/)
- Hebrew text
    - Vowel of the WLC
