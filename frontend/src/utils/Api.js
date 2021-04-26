/*
  Note: the name of the file is Api.js instead of api.js to reflect that the
  file will export a class and not an instance of a class like before.
*/
class Api {
  constructor({ baseUrl, headers={} }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  fetchData({ relativePathFromBase, method='GET', additionalHeaderProps={}, body=null}) {
    const init = {
      method,
      headers: {
        ...this._headers,
        ...additionalHeaderProps
      }
    };

    if(body !== null) {
      init.body = body;
    }

    const url = `${this._baseUrl}/${relativePathFromBase}`;

    return fetch(url, init).then((res) => {
      if(res.ok) return res.json();
      else return Promise.reject(res.status);
    });
  }
}

export default Api;