## COMP9900-H16A-last_bus



## How to run the back-end code

`git clone git@github.com:unsw-cse-capstone-project/capstone-project-comp9900-h16a-last_bus.git`

`cd capstone-project-comp9900-h16a-last_bus`

**Note: Make sure you always on the correct branch**

`git checkout back-end`

**Note: On daily basis, before you make some change on code, please run the next command first**

`git pull`

**Note: The next command only needs to run for the very first time**

`python3 -m venv venv`

**Note: The next command needs to run every time before you work on this project**

`source venv/bin/activate`

`pip install -r requirements.txt`

`python app.py`


## How to test

**Note: this is a temporary method for now**

[Download Postman](https://www.postman.com/downloads/) 

Once you successfully install Postman, login with your own account then import the file named

**9900.postman_collection.json**

You'll see the sample requests under 9900 collections, try yourself to test if your service works.

## How to submit

`git add *`

`git commit -m 'your own working log'`

`git push`

Then I will manually merge to the current branch

## How to run the front-end code
Make sure you have Node.js installed on your machine/
https://nodejs.org/en/download/

Afterwards...

`git checkout front-end`

`git pull`

Make sure you are in the 'front-end' directory.

`npm install`

Wait for all modules to install

`npm start`

Should start the program! Hosted on localhost:3000

