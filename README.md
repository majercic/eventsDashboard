# events7
## 1. Introduction
For this applicaton is build in nest.js (backend) and vue3 (frontend). MongoDB is used for the database.

## 2. Installation
### 2.1. Database
- install and start mongo db service with `mongod`

### 2.2. Backend
- provide the .env file in the backend folder with the following content:
    API_URI=https://us-central1-o7tools.cloudfunctions.net/fun7-ad-partner
    API_USERNAME=[your username]
    API_PASSWORD=[your password]
- install dependencies with `npm install`
- start the backend with `npm start`

#### 2.2.1. Production

### 2.3. Frontend   
- provide the .env file in the frontend folder with the following content:
    VUE_APP_API_URL=http://localhost:3000
- install dependencies with `npm install`
- start the frontend with `npm run serve`

#### 2.3.1. Production



## 3. Extra information
- Accees for a specific office is dependent on the user ip address and country code is appended to the custom header in the request. This type of access control is not secure, since request headers can be easily updated. Authorization should be managed in the backend with the appropriate user authentication.
- It was required to add unique id for every event. I wasn't sure if this is id of some external system or just a primary key of the event. There are two ids in this case, one is object id of the mongo document and the other is the id of the event, which can be defined by the user and it should be unique. 
