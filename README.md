# <center> Day Trips Optimization 🗺️📍🛣️🧳</center>

### <center> Bangkit Academy Company Capstone Project </center>

#### <center> 👻 Developed by CC Members of `C242-DT01` Team 👻 </center>

<br>

This repository contains the code to develop an API service for our Day Trips Optimization application.

Day Trips Optimization aims to assist users with creating their itineraries efficiently through the prediction generated by our machine learning model. This API helps to bridge the communication between the model developed by our ML members and the android application developed by our MD members. Additionally, we provide users with general information of their desired travel destinations by leveraging Places API by Google Maps Platform.

## Tech Stack

- Node.js, Express
- Firebase, Firestore
- Maps Platform Places API
- Google Cloud Storage

## Requirements

To run this project locally, you need to create `.env` file by referencing to the template in the `.env.sample` file. The services required to fill in the information in .env file include Firebase, Google Cloud Storage, and Places API.

## Usage

1. Clone the repository

```bash
git clone https://github.com/2angela/daytrip-bizzagi-API.git
```

2. Go to the project directory

```bash
cd /daytrip-bizzagi-API
```

3. Install dependencies

```bash
npm ci
```

4. Start the server

```bash
npm run dev
```

## Documentation

Full documentation for this API is available in this [link](https://docs.google.com/document/d/1ecmBLTRjJBAzvh5SqJnowpJjhykrgn1_vNsF2gCmXjk/edit?usp=sharing)

## API Endpoints

| Endpoint                      | Method   | Description                                                            |
| :---------------------------- | :------- | :--------------------------------------------------------------------- |
| /auth/login                   | `POST`   | Authenticates a user with email and password, returning a token        |
| /auth/signup                  | `POST`   | Registers a new user with name, email, and password, returning a token |
| /auth/plans/create            | `POST`   | Creates a new itinerary using optimization                             |
| /auth/plans/list/:id          | `GET`    | Retrieves an itinerary for a specific user                             |
| /auth/plans/list              | `GET`    | Retrieves a list of itinerary for a specific user                      |
| /auth/plans/update/:id        | `PUT`    | Updates an existing itinerary                                          |
| /auth/plans/delete/:id        | `DELETE` | Deletes an existing itinerary                                          |
| /auth/destinations/create/:id | `POST`   | Creates a new destination data                                         |
| /auth/destinations/list/:id   | `GET`    | Retrieves a destination data                                           |
| /auth/destinations/list       | `GET`    | Retrieves a list of destination data                                   |
