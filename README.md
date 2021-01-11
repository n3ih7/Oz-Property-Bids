# Oz-Property-Bids

## Front end (client)
Make sure you are under the folder of the project, then:

`npm install`

Construct the front-end module in the following way:

`npm start`

After this, you are ready to enjoy it at [http://localhost:3000](http://localhost:3000).

## Back end (server) 
**NOT REQUIRED** Since our server has been deployed on GCP, no action needed
in this section. The following commands are for reference only:

`pip3 install -r requirements.txt`

`python3 app.py`

## API key settings
You'll need to use your own Google Cloud Platform API key/ credentials (Google Map, Cloud Storage) and SMTP account for email notification.

`/src/components/Map.js` Line 55, Google Maps API key

`/project/email_notification.py` Line 44-45 & 57-60, SMTP account

`/project/blob.py` Line 3-4, GCP Cloud Storage json token
