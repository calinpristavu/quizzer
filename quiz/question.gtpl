{{ template "header" .User }}

<div class="container">
    <p>{{.Question.Text}}</p>
    <form action="/question" method="POST">
        {{range .Question.Answers}}
            <div class="form-group form-check">
                <input
                    id="answer-{{.ID}}"
                    class="form-check-input"
                    type="checkbox"
                    name="answer[]"
                    value="{{.ID}}">
                <label
                    for="answer-{{.ID}}"
                    class="form-check-label">
                    {{.Text}}
                </label>
            </div>
        {{else}}
            <p>No answers.</p>
        {{end}}
        <button type="submit" class="btn btn-primary">Next ></button>
    </form>
    <ul>
    </ul>
</div>
{{ template "footer" }}