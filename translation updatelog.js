db.torah.update({heb: "נוּכַל"},{$set: {eng: "we~will~BE.ABLE"}},{multi: true});
db.torah.update({heb: "הָעֲדָרִים"},{$set: {eng: "the~DROVE~s"}},{multi: true});
db.torah.update({heb: "וְגָלְלוּ"},{$set: {eng: "and~they~will~ROLL"}},{multi: true});
db.torah.update({heb: "אַרְבֶּה"},{$set: {eng: "I(cs)~will~make~INCREASE(V)"}},{multi: true});
db.torah.update({heb: "שְׁנֵי"},{$set: {eng: "TWO~(male)"}},{multi:true});
db.torah.update({ "heb" : "דָּן" },{$set:{eng: "Dan"}}, {multi:true})
db.torah.update({ "heb" : "אַרְבֶּה" },{$set:{eng: "SWARMING.LOCUST"}}, {multi:true})

// Changed from DO.NOT > TO , in exodus 3 Mosheh drawing near, This word ogccurs 87 times so could research
db.torah.update({ "heb" : "אַל" },{$set:{eng: "TO"}}, {multi:true})
db.torah.update({ "anc" : "אפ" },{$set:{eng: "NOSE"}}, {multi:true})
db.torah.update({ "anc" : "תמות" },{$set:{eng: "you(ms)~will~DIE"}}, {multi:true}) 
db.torah.update({ "heb" : "מוֹת" },{$set:{eng: "DEATH"}}, {multi:true}) 

db.torah.update({ "heb" : "וַתֹּאכַל" },{$set:{eng: "and~she~will~EAT"}}, {multi:true}) 
db.torah.update({ "heb" : "שֵׁם" },{$set:{eng: "TITLE"}}, {multi:true}) 
db.torah.update({ "heb" : "וְשֵׁם" },{$set:{eng: "and~TITLE"}}, {multi:true}) 
// Death ""
db.torah.update({ "anc" : "השמיני" },{$set:{eng: "the~EIGHTH"}}, {multi:true}) 
db.torah.update({ "heb" : "הַשְּׁמִינִת" },{$set:{eng: "the~EIGHTH"}}, {multi:true})

db.torah.update({ "heb" : "בַּשָּׁנָה" },{$set:{eng:"in~the~YEAR"}}, {multi:true})
db.torah.update({ "heb" : "הַשֵּׁנִי" },{$set:{eng:"the~SECOND"}}, {multi:true})

db.torah.update({ "heb" : "נָא" },{$set:{eng:"PLEASE"}}, {multi:true})
db.torah.find({ "heb" : "נָא" })
