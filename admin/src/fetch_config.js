const fetch = global.fetch;

global.fetch = function(url, opts) {
  if (url.substr(0, 4) !== 'http') {
    url = process.env.REACT_APP_API_BASE_URL + url
  }

  if (opts === undefined) {
    opts = {
      headers: new Headers({})
    }
  }

  if (opts.headers === undefined) {
    opts.headers = new Headers({})
  }

  if (!opts.headers.isPrototypeOf(Headers)) {
    opts.headers = new Headers(opts.headers)
  }
  opts.headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));

  const promise = fetch(url, opts)
    .then(r => {
      if (r.status === 403) {
        return Promise.reject('Unauthorized')
      }

      return r
    });

  promise.catch(err => {
    console.log('Logging out: ', err);
    localStorage.removeItem('token');

    window.location = '/';
  });

  return promise
};
