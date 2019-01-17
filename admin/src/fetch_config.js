import Noty from 'noty';
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

  return fetch(url, opts)
    .then(r => {
      if (r.status >= 400) {
        return Promise.reject(r)
      }

      return r.json()
    })
    .catch(err => {
      err.text()
        .then(msg => {
          new Noty({
            text: msg,
            type: 'error',
          }).show();
        });

      return err;
    })
    .catch(err => {
      if (err.status === 403) {
        localStorage.removeItem('token');

        window.location = '/';
      }

      return err;
    });
};
