{{ template "header" .User }}

<div class="container">
    <main role="main">
        <form action="/me" method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input
                    id="username"
                    class="form-control {{- if index .Errors "username" }} is-invalid{{end}}"
                    type="text"
                    name="username"
                    value="{{.User.Username}}">
                {{if index .Errors "username"}}
                    <small id="emailHelp" class="form-text text-muted text-red">
                        {{index .Errors "username"}}
                    </small>
                {{end}}
            </div>
            <button type="submit" name="save" value="1" class="btn btn-primary">Save</button>
        </form>
    </main>
</div>

{{ template "footer" }}