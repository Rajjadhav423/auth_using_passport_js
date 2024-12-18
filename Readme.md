# Authentication and Authorization with Passport.js

This document provides a comprehensive guide to the authentication and authorization mechanisms implemented in our application using Express and Passport.js. It includes required packages, their purposes, and a detailed explanation of routes and functionality.

## Overview

The application uses Passport.js to handle authentication. Passport.js is a flexible and modular middleware for Node.js that simplifies the process of authenticating requests. In this implementation, the `passport-local` strategy is used to authenticate users with a username and password.

---

## Clone and Use This Project


To use this project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Rajjadhav423/auth_using_passport_js.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd auth_using_passport_js
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

---


## Required Packages

Below are the packages used in this application, along with their purposes:

1. **cookie-parser**
   - **Purpose**: Parses cookies attached to client requests, allowing server-side code to easily read and manipulate them.
   - **Installation**: `npm install cookie-parser`

2. **debug**
   - **Purpose**: Provides a flexible debugging utility for Node.js applications.
   - **Installation**: `npm install debug`

3. **ejs**
   - **Purpose**: A template engine for rendering HTML pages with embedded JavaScript.
   - **Installation**: `npm install ejs`

4. **express**
   - **Purpose**: Provides a robust framework for building web applications.
   - **Installation**: `npm install express`

5. **express-session**
   - **Purpose**: Manages user sessions by storing session data on the server and associating it with a client-side cookie.
   - **Installation**: `npm install express-session`

6. **http-errors**
   - **Purpose**: Simplifies the creation of HTTP errors with descriptive status codes and messages.
   - **Installation**: `npm install http-errors`

7. **mongoose**
   - **Purpose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
   - **Installation**: `npm install mongoose`

8. **morgan**
   - **Purpose**: A logging middleware that captures HTTP requests and logs them for debugging and monitoring.
   - **Installation**: `npm install morgan`

9. **nodemon**
   - **Purpose**: Automatically restarts your Node.js application whenever file changes are detected.
   - **Installation**: `npm install nodemon`

10. **passport**
    - **Purpose**: Middleware for authenticating requests in your Node.js application.
    - **Installation**: `npm install passport`

11. **passport-local**
    - **Purpose**: A Passport.js strategy for authenticating users via a username and password.
    - **Installation**: `npm install passport-local`

12. **passport-local-mongoose**
    - **Purpose**: Simplifies Passport.js integration with Mongoose by adding user authentication methods directly to the model.
    - **Installation**: `npm install passport-local-mongoose`

---

## Authentication Workflow

### Passport Configuration

1. **Initialize Passport**:
   Passport is initialized and configured to use sessions.

   ```javascript
   const passport = require('passport');
   const LocalStrategy = require('passport-local').Strategy;
   const userModel = require('./users');

   passport.use(new LocalStrategy(userModel.authenticate()));

   passport.serializeUser(userModel.serializeUser());
   passport.deserializeUser(userModel.deserializeUser());
   ```

2. **Session Setup**:
   Express sessions are used to store user information across requests.

   ```javascript
   const session = require('express-session');

   app.use(session({
     secret: 'your_secret_key',
     resave: false,
     saveUninitialized: false,
   }));

   app.use(passport.initialize());
   app.use(passport.session());
   ```

---

## Authentication Routes

### Register

**Endpoint**: `/register`  
**Method**: POST  
**Description**: Registers a new user with a username, age, email, and password.

```javascript
router.post('/register', (req, res) => {
  const newUser = new userModel({
    username: req.body.username,
    age: req.body.age,
    email: req.body.email,
  });

  userModel.register(newUser, req.body.password)
    .then((registeredUser) => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile');
      });
    })
    .catch((error) => {
      console.error('Registration error:', error);
      res.status(500).send('Registration failed. Please try again.');
    });
});
```

---

### Login

**Endpoint**: `/login`  
**Method**: POST  
**Description**: Authenticates a user using their username and password.

```javascript
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true, // Optional: Enable error messages
}));
```

---

### Logout

**Endpoint**: `/logout`  
**Method**: GET  
**Description**: Logs out the current user and redirects to the home page.

```javascript
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send('Logout failed.');
    }
    res.redirect('/');
  });
});
```

---

### Profile

**Endpoint**: `/profile`  
**Method**: GET  
**Description**: Displays the authenticated user's profile.

```javascript
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ username: req.user.username });
    res.render('profile', { user: loggedInUser });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).send('Unable to fetch profile.');
  }
});
```

---


## Additional Considerations

### Error Handling
- Ensure proper error handling during registration and login to provide meaningful feedback to users.

### Security
- Use HTTPS to protect user credentials during transmission.
- Store session secrets securely.

### Scalability
- Configure session storage to use a database like Redis for scalable session management in production environments.

---

This documentation ensures a clear understanding of the implemented authentication system and provides step-by-step guidance for setup and usage.

