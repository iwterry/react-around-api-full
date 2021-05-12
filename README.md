# react-around-api-full
The API of "Around the U.S." with authorization and registration handled by the back-end server.

This repository contains the full API of "Around the U.S." project that features user authorization and user registration and handles cards and users. Please add to this readme:
* a link to repository with the complete React application which uses this API;
  * The frontend directory at https://github.com/iwterry/react-around-api-full/ has the full React app.
* a link to the website that hosts your API
  * IP address: 52.168.48.152
  * Frontend: https://practicum-iwterry.students.nomoreparties.site
  * Backend: https://api.practicum-iwterry.students.nomoreparties.site
  * Used Microsoft Azure for hosting.
  * UPDATE: The URLs and the IP address given for the frontend and backend are no longer valid, as I have turned off the virtual machine from Azure that was being used. So the links willl not work.

About this fullstack app:
* Whenever the frontend app mounts, it will send a request to the backend to see if the user is signed in. A user is considered signed in if the backend receives a valid JWT (JSON Web Token) from a cookie. When the frontend makes this request to the backend, a cookie will be sent if there is one.
* This approach is safe from CSRF (Cross-Site Request Forgery) because this request has no side effects, and the response from the backend provides the JWT, which will need to be placed in the Authorization header in order to make any other requests that requires authentication.
* Signing out is done with a request using Authorization header, and then the cookie is cleared.
* When a user signs in, the user will receive the JWT in the form of a httpOnly cookie (which cannot be used by JS on the frontend) and in the response body (in order to place the JWT in the header for future requests).
* In order for this backend and frontend to communicate with cookies with domains, the cookies needed to be SameSite='none' and secure. Thus, using https is required, and the use of backend authenticating using Authorization header deals with CSRF.
* This app allows for the following:
  * Signing up, signing in, and signing out.
  * Creating, liking / unliking, selecting, and deleting cards.
  * Editing profile name, description, and avatar.
