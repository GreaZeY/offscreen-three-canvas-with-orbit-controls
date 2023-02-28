
# A implementation of orbit controls in offscreen three canvas

## Problem
OrbitControls inside a offscreen canvas is not possible through simple means because inside worker thread there is no access to DOM API. 

## Solution
- We can achieve this by creating a fictitious element for worker and create proxy events for it to make it work. 
- Add event on main canvas and then pass all of event data to fictitious element's proxy events. 

#### Live [here](https://rmmucm-3000.preview.csb.app/)

### Run in local environment
* Clone the repository
* Install the dependencies `npm install`
* Run in development mode  `npm start`
