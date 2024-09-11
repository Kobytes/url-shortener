# URL Shortener

A simple URL shortener API built with Node.js, Express, and TypeScript.

## Features

- Shorten long URLs
- Redirect to original URLs
- SQLite database for storage
- Basic error handling and input validation

## Prerequisites

- Node.js (v14 or later)
- npm

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/Kobytes/url-shortener.git
   cd url-shortener
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up the database:
   ```
   npx prisma migrate dev --name init
   ```

## Usage

1. Start the server:

   ```
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

3. Use the API:
   - To shorten a URL:
     ```
     curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.example.com"}' http://localhost:3000/shorten
     ```
   - To access a shortened URL:
     ```
     curl -i http://localhost:3000/{slug}
     ```

## API Endpoints

- `POST /shorten`: Create a short URL
- `GET /{slug}`: Redirect to the original URL

## Running Tests

```
npm test
```
