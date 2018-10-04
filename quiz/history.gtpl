{{ template "header" .User }}

<div class="container">

    {{ template "account_nav" 2 }}

    <main role="main">
        <table class="table">
            <thead>
            <tr>
                <th>Quesiton</th>
                <th>Answers</th>
            </tr>
            </thead>

            <tbody>
            {{range .Quizzes}}
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
    </main>
</div>

{{ template "footer" }}