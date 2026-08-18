<!doctype html>

<html lang="ru">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>1Minute — Teams</title>

<script src="https://cdn.tailwindcss.com"></script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link
href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
rel="stylesheet">

<link rel="stylesheet" href="style.css">
</head>

<body>

<div class="glow glow-a"></div>
<div class="glow glow-b"></div>

<header class="topbar">

<a class="brand" href="#teams">
<span>1</span>Minute
</a>

<nav>

<a class="active" href="#teams">
Команда
</a>

<a href="#rating">
Рейтинг
</a>

<a href="#matches">
Матчи
</a>

<a href="#tournaments">
Турниры
</a>

</nav>

<button
class="login"
onclick="openLoginModal()"

>

Войти </button>

<button
class="mobile-menu"
onclick="document.body.classList.toggle('menu-open')"

>

☰ </button>

</header>

<main>

<section
id="teams"
class="screen"
>

<div class="hero">

<div class="eyebrow">
1MINUTE
</div>

<h1>
Команда, которая<br>
<span>играет на победу.</span>
</h1>

<p>
Профили состава, матчи и статистика 1Minute — всё в одном месте.
</p>

<div class="hero-actions">

<a
href="#teams-list"
class="primary"

>

Смотреть команду <b>↓</b> </a>

<a
href="#rating"
class="secondary"

>

Рейтинг → </a>

</div>

</div>

<div
id="teams-list"
class="section-head"
>

<div>

<div class="eyebrow">
TEAM
</div>

<h2>
1Minute
</h2>

</div>

</div>

<div
id="grid"
class="team-grid"
></div>

</section>

<section
id="teamPage"
class="screen hidden"
>

<button
class="back"
onclick="closeTeam()"

>

← Команда </button>

<div id="teamProfile"></div>

</section>

<section
id="playerPage"
class="screen hidden"
>

<button
class="back"
onclick="closePlayer()"

>

← Команда </button>

<div id="playerProfile"></div>

</section>

<section
id="rating"
class="screen page-section"
>

<div class="section-head">

<div>

<div class="eyebrow">
RANKING
</div>

<h2>
Рейтинг
</h2>

</div>

</div>

<div class="glass table-wrap">

<table>

<thead>

<tr>

<th>#</th>

<th>
Команда
</th>

<th>
Матчи
</th>

<th>
Победы
</th>

<th>
ELO
</th>

</tr>

</thead>

<tbody id="ratingRows"></tbody>

</table>

</div>

</section>

<section
id="matches"
class="screen page-section"
>

<div class="section-head">

<div>

<div class="eyebrow">
MATCHES
</div>

<h2>
Матчи
</h2>

</div>

</div>

<div
id="matchesList"
class="matches"
></div>

</section>

<section
id="tournaments"
class="screen page-section"
>

<div class="section-head">

<div>

<div class="eyebrow">
TOURNAMENTS
</div>

<h2>
Турниры
</h2>

</div>

</div>

<div
id="tournamentsGrid"
class="tournament-grid"
></div>

</section>

</main>

<div
id="editModal"
class="modal hidden"
>

<div class="modal-card">

<button
class="modal-close"
onclick="closeEditor()"

>

× </button>

<div class="eyebrow">
TEAM EDITOR
</div>

<h2>
Редактировать команду
</h2>

<form id="editForm">

<input
type="hidden"
id="editName"

>

<label>
Название

<input
id="editTitle"
required

>

</label>

<label>
Тег

<input
id="editTag"
maxlength="5"
required

>

</label>

<label>
Страна

<input
id="editCountry"
required

>

</label>

<label>
Логотип URL

<input
id="editLogo"
placeholder="https://..."

>

</label>

<label>
FACEIT URL

<input
id="editFaceit"
placeholder="https://www.faceit.com/..."

>

</label>

<label>
Steam URL

<input
id="editSteam"
placeholder="https://steamcommunity.com/..."

>

</label>

<label>
Описание

<textarea
id="editDescription"
rows="3"
></textarea>

</label>

<button
class="primary save"
type="submit"

>

Сохранить изменения </button>

</form>

</div>

</div>

<div
id="playerEditModal"
class="modal hidden"
>

<div class="modal-card">

<button
class="modal-close"
onclick="closePlayerEditor()"

>

× </button>

<div class="eyebrow">
PLAYER EDITOR
</div>

<h2>
Профиль игрока
</h2>

<form id="playerEditForm">

<input
type="hidden"
id="playerEditOldName"

>

<input
type="hidden"
id="playerEditTeam"

>

<label>
Никнейм

<input
id="playerEditName"
required
placeholder="Например: XXXOLDAR"

>

</label>

<label>
Страна

<input
id="playerEditCountry"
placeholder="Russia"

>

</label>

<label>
Роль

<select id="playerEditRole">

<option>
Игрок
</option>

<option>
Капитан
</option>

<option>
AWPer
</option>

<option>
Sniper
</option>

<option>
Rifler
</option>

<option>
Rifle
</option>

<option>
Entry
</option>

<option>
Anchor
</option>

<option>
Support
</option>

<option>
IGL
</option>

<option>
IGL + support
</option>

</select>

</label>

<label>
Аватар URL

<input
id="playerEditAvatar"
placeholder="https://..."

>

</label>

<label>
FACEIT URL

<input
id="playerEditFaceit"
placeholder="https://www.faceit.com/..."

>

</label>

<label>
Steam URL

<input
id="playerEditSteam"
placeholder="https://steamcommunity.com/..."

>

</label>

<button
class="primary save"
type="submit"

>

Сохранить игрока </button>

</form>

</div>

</div>

<div
id="loginModal"
class="modal hidden"
onclick="if(event.target===this)closeLoginModal()"
>

<div class="modal-card login-card">

<button
class="modal-close"
onclick="closeLoginModal()"

>

× </button>

<div class="eyebrow">
1MINUTE ACCOUNT
</div>

<div class="login-icon">
1
</div>

<h2>
Авторизация будет позже
</h2>

<p style="
color:#858c98;
line-height:1.7;
font-size:14px;
margin:10px 0 22px
">
Система авторизации пока находится в разработке.
Скоро здесь можно будет войти в аккаунт и управлять
своим профилем.
</p>

<button
class="primary save"
type="button"
onclick="closeLoginModal()"

>

Понятно </button>

</div>

</div>

<footer>
© 2026 1Minute · Teams database
</footer>

<script src="app.js"></script>

<script>

function openLoginModal(){

const modal =
document.getElementById("loginModal");

if(!modal) return;

modal.classList.remove("hidden");

document.body.style.overflow =
"hidden";

}


function closeLoginModal(){

const modal =
document.getElementById("loginModal");

if(!modal) return;

modal.classList.add("hidden");

document.body.style.overflow =
"";

}

</script>

</body>

</html>
