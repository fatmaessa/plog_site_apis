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
- Pagination
- Filtering and searching posts
- Sorting posts
- Proper validation and status codes

## Getting Started

1. Clone the project:
   ```
   git clone https://github.com/fatmaessa/plog_site_apis.git
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
| GET | `/users`    | YES | Get others users
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

## Posts Query Parameters

The `GET /posts` endpoint supports the following query parameters:

| Parameter | Description | Example |
|---|---|---|
| `limit` | Specifies the maximum number of posts to return per request. Default is 10, maximum is 50. | `limit=10` |
| `skip` | Specifies the number of posts to skip. Useful for pagination. Default is 0. | `skip=10` |
| `sortBy` | Sorts posts by `createdAt` or `title`, in ascending (`asc`) or descending (`desc`) order. Default is `createdAt:desc`. | `sortBy=createdAt:desc` |
| `author` | Filters posts by the author's ID. | `author=USER_ID` |
| `search` | Searches posts by title using case-insensitive partial matching. | `search=javascript` |

### Query Examples

Get the latest 10 posts:

```http
GET /posts?limit=10&sortBy=createdAt:desc
```

Get the next 10 posts:

```http
GET /posts?limit=10&skip=10
```

Get posts by a specific author:

```http
GET /posts?author=USER_ID
```

Search posts by title:

```http
GET /posts?search=javascript
```

Sort posts alphabetically by title:

```http
GET /posts?sortBy=title:asc
```

Combine multiple query parameters:

```http
GET /posts?limit=10&skip=0&sortBy=createdAt:desc&author=USER_ID&search=node
```

### My Posts Query Parameters

The `GET /posts/mine` endpoint supports additional filtering options:

| Parameter | Description | Example |
|---|---|---|
| `limit` | Specifies the maximum number of posts to return per request. Default is 10, maximum is 50. | `limit=10` |
| `skip` | Specifies the number of posts to skip. | `skip=10` |
| `sortBy` | Sorts posts by `createdAt` or `title`, in ascending or descending order. | `sortBy=title:asc` |
| `search` | Searches my posts by title using case-insensitive partial matching. | `search=javascript` |
| `published` | Filters my posts by their publication status. Accepts `true` or `false`. | `published=false` |

Example:

```http
GET /posts/mine?published=false&sortBy=createdAt:desc&limit=10
```
## Authentication

After logging in or signing up, you will receive a `token`. Include it in the header with every protected request:

```
Authorization: Bearer <token>
```