## This is the extension part of the back-end

Can test for conditional search under certain filters from the front-end

## How to test

1. Download postman 

2. Run code app.py

3. Open postman, use the link given by app.py : http://127.0.0.1:5000/buy?keyword=*????* the ???? needed to be replaced by postcode, such as 2032.

Then post the json below, notice the values can be changed.

{  
    &ensp"beds": "Any",  
    &ensp"baths": "Any",  
    &ensp"carspots": "Any",  
    &ensp"auction_start": "2020-01-10",  
    &ensp"auction_end": "2021-1-10"  
  
}  

the result should be like:

[  
    {  
       &ensp "auction_end": "2020-12-10",  
       &ensp "auction_start": "2020-07-10",  
       &ensp "baths": 3,  
       &ensp "beds": 3,  
       &ensp "compare_addr": "Kingsford New South Wales 2032",  
       &ensp "id": 1,  
       &ensp "image": "C:\\Users\\Administrator\\Desktop\\9900\\test_images\\images.jpg",  
       &ensp "introDetails": null,  
       &ensp "introTitle": null,  
       &ensp "landSize": 260,  
       &ensp "parkingSpace": 2,  
       &ensp "postcode": 2032,  
       &ensp "propertyType": "House",  
       &ensp "sellerEmail": "12345@gmail.com",  
       &ensp "startPrice": 500000,  
       &ensp "state": "New South Wales",  
       &ensp "streetAddress": null,  
       &ensp "suburb": "Kingsford",  
       &ensp "unitNumber": "21B"  
    }  


  
## Image with different storage method

There are two database are used for test. db.sqlite stores the image information as their path, not the image itself.

dbBinary.sqlite stores the images itself for every record, in bytes format.

They will return different values for image only.

## Change to dbBinary.sqlite for test
The default database is db.sqlit. If you want to change to dbBinary.db, follow these steps:

1. Unpound the line 54 in models.py, and pound the line 48.

2. unpound line 359, 360 and 378 in auth.py, and pound line 377.

3. run the code
