# events7

## 1. Introduction
This application is built using Nest.js (backend) and Vue 3 (frontend). MongoDB is used as the database.

## 2. Installation

### 2.1. Database
- Install and start the MongoDB service with `mongod`.

### 2.2. Backend
- Provide the `.env` file in the backend folder with the following content:
    ```
    API_URI=[URL to the fun7-ad-partner API]
    API_USERNAME=[your username]
    API_PASSWORD=[your password]
    ```
- Install dependencies with `npm install`.
- Start the backend with `npm start`.

#### 2.2.1. Production
- Run the backend in production mode with `npm run start:prod`.

### 2.3. Frontend   
- Provide the `.env` file in the frontend folder with the following content:
    ```
    VUE_APP_API_URL=[backend URL from step 2]
    ```
- Install dependencies with `npm install`.
- Start the frontend with `npm run serve`.

#### 2.3.1. Production
- Build the app for production with `npm run build`.
- Serve the app with `serve -s dist` or copy the contents of the `dist` folder to the server.

## 3. Extra information
- The fun7-ad-partner API is a bit buggy, as it returns different responses when called with the same parameters. It also occasionally returns a 500 error, which is handled with a retry mechanism in the backend.
- Access for a specific office is dependent on the user's IP address, and the country code is appended to a custom header in the request. This type of access control is not secure, as request headers can be easily manipulated. In a real-world scenario, authentication should be managed in the backend with an appropriate authentication service.
- It was required to add a unique ID for every event. I wasn't sure if this ID referred to an external system or just a primary key for the event. There are two IDs in this case: one is the ObjectId of the MongoDB document, and the other is the event ID, which can be defined by the user and should be unique.
- A document-based database is used primarily because of the simplicity and flexibility of the schema. In a real-world scenario, a relational database would be more appropriate.