# Image Processing API
An image processing REST API built in Node.js and Express.

## Installation
```
$ npm install
```

## Building & Running for Development (using nodemon)
The server runs on http://localhost:8086 by default.

```
$ npm run dev
```

## Building & Running for Production
The server runs on http://localhost:8086 by default.
```
$ npm run build
$ npm run start
```

## Testing (Jasmine)
```
$ npm run test
```

## Linting and formatting (eslint & prettier)
```
$ npm run lint
$ npm run prettier
```

## API Documentation
### GET /api
Currently, this is the only endpoint in the project.

#### Query parameters:
- **filename**: string for the filename of the image (e.g., fjord.jpg)
- **width**: integer, width of the resized image
- **height**: integer, height of the resized image

#### Example:
```
GET /api?filename=fjord.jpg&width=400&height=400
```
