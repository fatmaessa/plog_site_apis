# Blog API

A REST API for a blog where users can write posts and comment on each other's posts. It includes JWT-based authentication, and each user can only edit or delete their own content.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## Features

- Sign up / Login / Logout (from a single device or all devices)
- Password hashing
- Ownership: Users cannot modify or delete data belonging to others
- Automatic deletion of a user's posts and comments upon account deletion
- Proper validation and status codes

## Getting Started

1. Clone the project:
   ```
   git clone https://github.com/YOUR-USERNAME/blog-api.git
   cd blog-api
   ```
2. Install the dependencies:
   ```
   npm install
   ```
3. Create a `.env` file (copy it from `.env.example`) and add the required values:
   ```
   JWT_SECRET=your_secret_here
   MONGODB_URL=your_connection_string_here
   ```
4. Run the project:
   ```
   node --env-file=.env app.js
   ```

## API Endpoints

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users` | NO | Sign up |
| POST | `/login` | NO | Log in |
| DELETE | `/logout` | YES | Log out from the current device |
| DELETE | `/logoutall` | YES | Log out from all devices |
| GET | `/users/me` | YES | Get my profile data |
| PATCH | `/users/me` | YES | Update my profile data |
| DELETE | `/users/me` | YES | Delete my account |

### Posts
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/posts` | YES | Create a post |
| GET | `/posts` | NO | Get all published posts |
| GET | `/posts/mine` | YES | Get my posts |
| GET | `/posts/:id` | YES | Get a single post |
| PATCH | `/posts/:id` | YES | Update a post (owner only) |
| DELETE | `/posts/:id` | YES | Delete a post (owner only) |

### Comments
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/posts/:id/comments` | YES | Add a comment |
| GET | `/posts/:id/comments` | YES | Get comments for a post |
| GET | `/comments/:id` | YES | Get a single comment |
| PATCH | `/comments/:id` | YES | Update a comment (owner only) |
| DELETE | `/comments/:id` | YES | Delete a comment (owner only) |

## Authentication

After logging in or signing up, you will receive a `token`. Include it in the header with every protected request:

```
Authorization: Bearer <token>
```