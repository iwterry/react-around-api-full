module.exports = (req, res, next) => { // middleware dealing with cross origin issues
  const { origin } = req.headers;
  const { method } = req;

  const allowedOrigins = [
    'https://practicum-iwterry.students.nomoreparties.site',
    'https://www.practicum-iwterry.students.nomoreparties.site',
    'http://practicum-iwterry.students.nomoreparties.site',
    'http://www.practicum-iwterry.students.nomoreparties.site',
    'http://localhost:3000',
  ];

  if (allowedOrigins.includes(origin)) {
    res.header('access-control-allow-origin', origin);
    res.header('access-control-allow-credentials', true);
    res.header('access-control-allow-headers', 'Content-Type, Authorization');
    res.header('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE');

    if (method === 'OPTIONS') res.send(); // deals with preflight used for CORS
    else next(); // deals with actual request and not preflight
  } else next(); // deals with origins not allowed
};
