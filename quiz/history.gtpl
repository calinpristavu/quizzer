{{ template "header" .User }}

<style>
    #quiz-nav {
    }

    #quiz-nav a {
        display: block;
        padding: 10px;
        background: cornflowerblue;

        text-decoration: none;
        color: white;
        cursor: pointer;
    }
    #quiz-nav a:hover {
        background: white;
        color: cornflowerblue;
    }
    #quiz-nav a.active {
        background: darkblue;
    }
</style>

<div class="container">
    {{ template "account_nav" 2 }}
</div>

<div class="container-fluid">
    <div class="row">
        <div class="col-3" id="quiz-nav">
            {{range .Quizzes}}
                 <a href="/quiz-history/{{.ID}}">{{.UpdatedAt}}</a>
            {{end}}
        </div>
        <div class="col-9">
            {{if .Current}}
                {{range .Current.Answered}}
                    <div class="question">
                        <p class="text-center">{{.Question.Text}}</p>
                        {{$qID := 1}}
                        {{range .Question.Answers}}
                            <div class="form-group form-check">
                                <input
                                    id="q-{{$qID}}-a-{{.ID}}"
                                    class="form-check-input"
                                    type="checkbox"
                                    value="{{.ID}}">
                                <label
                                    for="q-{{$qID}}-a-{{.ID}}"
                                    class="form-check-label">
                                {{.Text}}
                                </label>
                            </div>
                        {{end}}
                    </div>
                    <hr>
                {{end}}
            {{end}}
        </div>
    </div>
</div>

{{ template "footer" }}