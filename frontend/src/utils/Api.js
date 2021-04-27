class Api {
  constructor(baseUrl, { headers={}, ...others }={}) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._others = others;
  }

  fetchData({
    relativePathFromBase='',
    method='GET',
    headers={},
    body=null,
    ...others
  }) {
    const init = {
      method,
      headers: {
        ...this._headers,
        ...headers
      },
      ...this._others,
      ...others
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