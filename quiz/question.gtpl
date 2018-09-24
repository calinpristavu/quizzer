<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Question</title>
</head>
<body>
    <p>Quiz: {{.ID}}</p>
    <p>Questions:</p>
    <ul>
        {{range .Questions}}
            <li>{{.Text}}</li>
            <ul>
                {{range .Answers}}
                    <li>{{.Text}}</li>
                {{else}}
                    <li>No answers.</li>
                {{end}}
            </ul>
        {{else}}
            <li>No questions.</li>
        {{end}}
    </ul>
</body>
</html>