{{ define "account_nav" }}

<style>
    .wrapper {
        display: flex;
        align-items: stretch;
        position: absolute;
    }

    #sidebar {
        min-width: 250px;
        max-width: 250px;
        min-height: 100vh;

        background: #7386D5;
        color: #fff;
        transition: all 0.3s;
    }

    #sidebar ul.components {
        padding: 20px 0;
        border-bottom: 1px solid #47748b;
    }
    #sidebar ul li a {
        padding: 10px;
        font-size: 1.1em;
        display: block;
        color: white;
        text-decoration: none;
    }
    #sidebar ul li:hover a {
        color: #7386D5;
        background: #fff;
        cursor: pointer;
    }
    #sidebar ul li.active > a {
        color: #fff;
        background: #6d7fcc;
    }
</style>

<div class="wrapper">
    <nav id="sidebar">
        <div class="sidebar-header">
            <h3>My account</h3>
        </div>

        <ul class="list-unstyled components">
            <li class="active">
                <a href="/me">User info</a>
            </li>
            <li>
                <a href="/quiz-history">Quiz history</a>
            </li>
        </ul>
    </nav>
</div>

{{end}}