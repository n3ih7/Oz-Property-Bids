## This is the extension part of the back-end

Can test for conditional search under certain filters from the front-end

## How to test

1. Download postman 

2. Run code `app.py`

3. Open postman, use the link given by app.py : http://127.0.0.1:5000/buy?keyword=???? the ???? needed to be replaced by postcode, such as 2032.

Then post the json below, notice the values can be changed.

{  
            "beds": "Any",  
            "baths": "Any",  
            "carspots": "Any",  
            "auction_start": "2020-01-10",  
            "auction_end": "2021-1-10"  
  
}  

the result should be like:

[  
    {  
             "auction_end": "2020-12-10",  
             "auction_start": "2020-07-10",  
             "baths": 3,  
             "beds": 3,  
             "compare_addr": "Kingsford New South Wales 2032",  
             "id": 1,  
             "image": "C:\\Users\\Administrator\\Desktop\\9900\\test_images\\images.jpg",  
             "introDetails": null,  
             "introTitle": null,  
             "landSize": 260,  
             "parkingSpace": 2,  
             "postcode": 2032,  
             "propertyType": "House",  
             "sellerEmail": "12345@gmail.com",  
             "startPrice": 500000,  
             "state": "New South Wales",  
             "streetAddress": null,  
             "suburb": "Kingsford",  
             "unitNumber": "21B"  
    }  


  
## Image with different storage method

There are two database are used for test. db.sqlite stores the image information as their path, not the image itself.

dbBinary.sqlite stores the images itself for every record, in bytes format.

They will return different values for image only.

## Change to dbBinary.sqlite for test
The default database is db.sqlit. If you want to change to dbBinary.db, follow these steps:

1. Unpound the line 54 in `models.py`, and pound the line 48.

2. unpound line 359, 360 and 378 in `auth.py`, and pound line 377.

3. run the code
