## Technological stack

- golang 1.11.4+
- npm 6.1.0+
- react 16.6.3
- mysql 8


## Install locally


- Follow the official instructions to install [Go](https://golang.org/doc/install).

- Follow the official instruction to install [npm](https://www.npmjs.com/get-npm).

- Follow the official instructions to install [MySQL 8](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
> Notice: Use Legacy Authentication Method

- Get the Golang project dependencies running `go get` command.

- Get the React project dependencies
```
    cd admin
    npm install
```

- Create your .env file and add the database connection details (host, user, password)
```
cp .env.dist .env

```

- Generate public and private key for JWT

```
    cd jwt
    openssl genrsa -out webapp 1024
    openssl rsa -in webapp -pubout > webapp.pub

```

- You're ready now :rocket: Run the following
```
go build
cd admin && npm run start
```
and the magic will happen :tada:
