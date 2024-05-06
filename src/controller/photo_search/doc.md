# GET /photo/search/moduloid/[origin]/[n]/[limit]
INPUT in the url:
    [n] - number - ammount of records that will be skipped   
    [origin] - number - from which to start selecting   
    [limit] - number  

get [limit] nth photos starting from the origin.  

example:  
photo/search/moduloid/15/3/5  

output: (just id's but in reality whole photo descriptors are returned)  
15  
18  
21  
24  
27  

*some values can be skipped if not found in the database