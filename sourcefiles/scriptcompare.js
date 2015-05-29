var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  // Get all the anc hebrew morph in torah
  db.tank.aggregate([
    { $match: {book: {$in:['genesis','exodus','leviticus','numbers','deuteronomy']}} },
    { $unwind: "$ancmorph"},
    { $group: {_id:"$ancmorph", age:"mosheh"} }
  ], function(err,docs){
  //[ {_id: soemheb, age:"mosheh"},
  //  {_id: soemheb1},
  //  {_id: soemheb2} ]
  })
  // compare anc morph to tank
  // Find places in tank where different
});

// Finds the differents morph between mosheh and tank
  db.tank.aggregate([
    {
      $match: 
        { book: 
         {$nin:['genesis','exodus','leviticus','numbers','deuteronomy']}
        } 
    },
    { $unwind: "$ancmorph"},
    { $group: {_id:"$ancmorph"} }
  ])

  db.tank.aggregate([
    {
      $project:
        {
          ancmorph:1,
          book: 1,
          age: {
           $cond: { 
              if:        
                {"$or": [ 
                   { $eq:["$book",'genesis']},
                   {$eq:["$book",'exodus']},                     
                   {$eq:["$book",'leviticus']},                       
                   {$eq:["$book",'numbers']},                         
                   {$eq:["$book",'deuteronomy']}                     
                ]},
            then: "mosheh", else: "tank" 
            }
          } 
        }
    },
    { $unwind: "$ancmorph"},
    { $group: {_id:{anc:"$ancmorph"},age:{$addToSet:"$age"}, count:{$sum:1}} },
    { $match: { age:{$not:{$eq:"mosheh"}} }},
  { $sort: {count:-1} },
  //{ $group: {_id:0, count:{$sum:1}} }
  ])

// Find the number of words different

  db.tank.aggregate([
    {
      $project:
        {
          anc: 1,
          ancmorph:1,
          book: 1,
          age: {
           $cond: { 
              if:        
                {"$or": [ 
                   { $eq:["$book",'genesis']},
                   {$eq:["$book",'exodus']},                     
                   {$eq:["$book",'leviticus']},                       
                   {$eq:["$book",'numbers']},                         
                   {$eq:["$book",'deuteronomy']}                     
                ]},
            then: "mosheh", else: "tank" 
            }
          } 
        }
    },
    // { $unwind: "$ancmorph"},
    { $group: {_id:{anc:"$anc"},/*age:{$addToSet:"$age"},*/ count:{$sum:1}} },
    {$match: {count:{$lte:1}}},
    //{ $match: { age:{$eq:"mosheh"} }},
  { $sort: {count:-1} },
 { $group: {_id:0, count:{$sum:1}} }
  ])

// Find if the morph is consistent or not 
db.tank.aggregate([
  {$group: {_id: "$anc", array: {$addToSet:"$ancmorph"} }},
  {$match: {"$or": [{array:{$size: 5}},{array:{$size: 5}}] }},
//  {$group:{_id:0,sum:{$sum:1}}}
])
