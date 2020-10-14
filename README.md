## COMP9900-H16A-last_bus

### back-end development schedule 

#### User and Basic Serarch Function - till 14 Oct night

Weicheng: user login FINISHED!

Tianzeng: user logout FINISHED!

Weicheng: user authentication FINISHED!

Weicheng: user registration FINISHED!

Linwei: user profile update FINISHED! by Weicheng

Shurong: property search by postcode FINISHED! by Shurong & Weicheng not fully integrated yet

## How to run the code

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
