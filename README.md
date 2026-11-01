# Lab 1: Node.js and Express Server

## Student Details

- **Name:** K.V. Sai Priyanka
- **Registration Number:** 252U1R6109
- **Section:** AIML IIB
- **Course:** Backend Development Fundamentals
- **Lab Number:** 01

## Live Link

Not deployed yet. The application can be run locally using `http://localhost:3000`.

## Objective

To create a basic HTTP server using Node.js and an Express server with multiple routes, HTTP status codes, and JSON responses.

## Technologies Used

- Node.js
- Express.js
- JavaScript
- npm
- Visual Studio Code

## Project Structure

```text
lab-01/
├── screenshots/
│   ├── home.png
│   ├── about.png
│   ├── time.png
│   └── not-found.png
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── plain-server.js
└── server.js
```

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Visual Studio Code or another code editor

### Steps to Run

1. Open the `lab-01` folder in your terminal.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the Express server:

   ```bash
   npm start
   ```

4. Open your browser and visit:

   `http://localhost:3000`

### Run the Basic HTTP Server

To run the server implemented using Node.js's built-in HTTP module:

```bash
node plain-server.js
```

The basic HTTP server uses port 3000, so stop the Express server first by pressing `Ctrl + C` before starting it.

## Endpoints

| Method | Endpoint | Description | Expected Status |
|---|---|---|---|
| GET | `/` | Returns a welcome message | 200 OK |
| GET | `/about` | Returns the student's name and section as JSON | 200 OK |
| GET | `/time` | Returns the current date and time | 200 OK |
| GET | `/anything` | Demonstrates the response for an unknown route | 404 Not Found |

Other undefined paths should also return a 404 response.

## Screenshots

1. Home Route

Displays the welcome message returned by the home route.



2. About Route

Displays the student's name and section in JSON format.



3. Time Route

Displays the current date and time.



4. 404 Not Found

Displays the response for an unknown route.



## HTTP Status Codes

- **200 OK:** The request was successful.
- **404 Not Found:** The requested route does not exist.

## Viva Questions

### 1. What is the difference between `package.json` and `node_modules`?

`package.json` stores project metadata, scripts, and dependency information. The `node_modules` directory contains the installed packages required by the project.

### 2. What does `app.listen()` do?

`app.listen()` starts the Express server and makes it listen for incoming requests on a specified port.

### 3. What do `request` and `response` represent?

The `request` object contains information about the incoming HTTP request. The `response` object is used to send data and status codes back to the client.

## Problems Faced and Solutions

If the server does not start because port 3000 is already in use, stop the other running server using `Ctrl + C` and restart the application.

## Git and Repository Notes

- The `.gitignore` file excludes `node_modules/` and `.env`.
- The `node_modules/` directory should not be committed to GitHub.
- Screenshots are stored in the `screenshots/` directory.
- The project should be submitted through the course GitHub repository.