# Blogging API with EJS Views

A Simple Blogging Platform built with Node.js, Express, MongoDB, JWT authentication, and EJS-based views (if you move like that).
The platform allows users to register, login, create, publish, edit, and delete blog posts.

## Features

- User Authentication (Sign up, Login, Logout)
- JWT-based authentication with cookie storage
- Protected routes for blog creation, editing, publishing, and deletion
- Blog states: `draft` and `published`
- Public viewing of published blogs
- Pagination, filtering, sorting, and search capabilities
- EJS views for server-side rendered pages
- Rate limiting, helmet security, and basic error handling
- MongoDB and Mongoose ODM
- RESTful API routes (with Postman collection available)

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- EJS for templating
- bcrypt for password hashing
- dotenv for environment variables
- helmet & express-rate-limit for security
- Postman for API testing

## Getting Started

### 1 Clone the Repository

```bash
git clone https://github.com/your-username/blogging-api.git
cd blogging-api
```

### 2 Install dependencies

```npm install```

### 3 Setup environment variables

Create a .env file in the root directory:

``` env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blogging-api
JWT_SECRET=your-very-secure-secret
```

### 4 Run the application

`
npm start
`

The app should now be running on: `http://localhost:3000`

## API Documentation

The API is fully documented on Postman:
👉 [Postman Documentation Link](https://documenter.getpostman.com/view/23173920/2sB2x6kC9p)

## Available Routes

### Authentication

| METHOD | ENDPOINT              | DESCRIPTION   |
| ------ | --------------------- | ------------- |
| POST   | `/api/v1/auth/signup` | Register user |
| POST   | `/api/v1/auth/login`  | Login user    |
| POST   | `/logout`             | Logout user   |

### Blogs

| METHOD | ENDPOINT                   | DESCRIPTION                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/v1/blog/all`         | Get published blogs         |
| GET    | `/api/v1/blog/:id`         | Get single blog             |
| POST   | `/api/v1/blog`             | Create new blog (protected) |
| PUT    | `/api/v1/blog/:id/publish` | Publish blog (protected)    |
| PUT    | `/api/v1/blog/:id/edit`    | Edit blog (protected)       |
| DELETE | `/api/v1/blog/:id/delete`  | Delete blog (protected)     |
| GET    | `/api/v1/blog/my-blogs`    | View own blogs (protected)  |

## Tests

Test files are located in the `/tests` folder.

## License

MIT License

## Author

Built by [Jolomi Taiwo](https://github.com/JolomiTee) 💻
