# Rephrase AI README

Welcome to the Rephrase AI README! This repository hosts a JavaScript-based application with ESLint configured for code linting and testing.

## Prerequisites

Before you get started, ensure that you have Node.js installed on your system. If not, you can download and install it from [nodejs.org](https://nodejs.org/).

## Installation

1. Clone the Repository:

    bash
    git clone https://github.com/BlazikenTech/RephraseAI-backend.git

    cd RephraseAI-backend


2. Install Dependencies:

    bash
    npm install


## Usage

- Running the Application:

    To launch the app, execute the following command:

    bash
    npm start


    This will initiate the development server and open the app in your default web browser.

- Running Tests:

    To run tests, use this command:

    bash
    npm test


- Linting with ESLint:

    To perform code linting using ESLint, use the following command:

    bash
    npm run lint


    This will analyze your code for linting errors and warnings.

## Configuration

The configuration for ESLint can be found in the `.eslintrc.js` file. You can modify this file to adapt linting rules according to your project's specific needs.

## Folder Structure

- `src/`: Contains the source code of the application.
- `tests/`: Holds the test files.
- `public/`: Stores static assets served by the development server.

## Contributing

Contributions are encouraged! If you wish to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-new-feature`.
3. Apply your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-new-feature`.
5. Open a pull request.

Kindly adhere to the coding style, ensure that tests pass, and keep linting errors to a minimum.

## Adding Your .env File

To add your own `.env` file for sensitive data, follow these steps:

1. Create a file named `.env` in the root directory of the project.
2. Inside the `.env` file, define your environment variables like this:


       JWT_SECRET='secretKey'
       OPENAI_API_KEY = '<Your_OPEN_API_KEY>'
       ROLLBAR_TOKEN = '<Your_ROLLBAR_TOKEN>'
       GOOGLE_CLIENT_ID = '<Your_GOOGLE_CLIENT_ID>'
       PORT='6000'
       NODE_ENV='test'
       DB_URL='postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName'
       TEST_DB_URL='postgres://YourUserName:YourPassword@YourHostname:5432/YourTESTDatabaseName'



4. Make sure to replace the placeholders with your actual database credentials.
5. Remember not to commit your `.env` file to version control by adding it to the `.gitignore` file.

## Setup Database

1. Run command "npm i"

2. for MAC : Run the command in terminal

       psql -h ${HostName} -d ${DatabaseName} -U ${UserName}

   for Windows : open SQL Shell, Write password and hit enter

3. Run command in terminal

       db-migrate up

5. Creation of new migration

       db-migrate create ${migration_name}



## Run Unit test cases

1. Run migrations on your test DB
    npm run migrate_test

2. Run command in Terminal


       npm run test



## License

This project is licensed under the terms of the [MIT License](LICENSE).
