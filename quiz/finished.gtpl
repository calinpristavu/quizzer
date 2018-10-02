{{ template "header" .User }}

<div class="container">
    <h1>Congratz!!! you have finished quiz: {{.Quiz.ID}}</h1>
    <p>the questions were:</p>
    <table class="table">
        <thead>
            <tr>
                <th>Quesiton</th>
                <th>Answers</th>
            </tr>
        </thead>

        <tbody>
            {{range .Quiz.Answered}}
                <tr>
                    <td>{{.Question.Text}}</td>
                    <td>
                        <ul>
                            {{range .SelectedAnswers}}
                                <li>{{.Text}}</li>
                            {{end}}
                        </ul>
                    </td>
                </tr>
            {{end}}
        </tbody>
    </table>
    <div class="text-center">
        <form action="/finished" method="POST">
            <button type="submit" class="btn btn-success">Back home</button>
        </form>
    </div>
</div>
{{ template "footer" }}