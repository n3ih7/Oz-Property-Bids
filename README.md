# capstone-project-comp9900-h16a-last_bus

## Environment Setup
All the following commands should be run from the CSE system command line.

`unzip h16a-last_bus_FinalSoftwareQuality.zip`

`cd h16a-last_bus_FinalSoftwareQuality`

## Front end (client)
The system is built by Node.JS, CSE machine already has it. Make sure you are under the
folder of the project, then:

`cd front-end`

`npm install`

Construct the front-end module in the following way:

`npm start`

If you see a message like 'port has been taken', please enter 'Y' to confirm to use the 
new port number. After this, you are ready to enjoy our service at http://localhost:3000
by default or at http://localhost:\<newportnumber\>.

## Back end (server) 
**NOT REQUIRED ON CSE MACHINE.** Since our server has been deployed on GCP, no action needed
in this section. The following commands are for reference only. Make sure you are under
the folder of the project:

`cd back-end`

`pip3 install -r requirements.txt`

`python3 app.py`
