const SUPABASE_URL = "ВСТАВЬ_СЮДА_СВОЙ_SUPABASE_URL";
const SUPABASE_KEY = "ВСТАВЬ_СЮДА_СВОЙ_SUPABASE_KEY";

const TEAM_NAME = "1Minute";

const STARTERS = [
"XXXOLDAR",
"Hesoko",
"yoplo",
"k9yzo",
"jambo"
];

const SUBSTITUTES = [
"lqq69",
"ChapsTea"
];

let teams = [];
let players = [];

/* =========================
SUPABASE
========================= */

async function supabaseRequest(path, options = {}) {

```
const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${path}`,
    {
        ...options,
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": options.method === "POST"
                ? "return=representation"
                : undefined,
            ...(options.headers || {})
        }
    }
);

if (!response.ok) {

    const errorText = await response.text();

    console.error(
        "Supabase error:",
        errorText
    );

    throw new Error(errorText);
}

const text = await response.text();

return text ? JSON.parse(text) : [];
```

}

/* =========================
LOAD DATA
========================= */

async function loadPlayers() {

```
try {

    players = await supabaseRequest(
        "players?select=*&order=id.asc"
    );

    if (!Array.isArray(players)) {
        players = [];
    }

    console.log(
        "Players loaded:",
        players
    );

} catch (error) {

    console.error(
        "Не удалось загрузить игроков:",
        error
    );

    players = [];
}
```

}

async function loadTeams() {

```
/*
   Если таблица teams существует,
   пытаемся загрузить её.

   Если её нет — создаём локальную
   команду 1Minute.
*/

try {

    teams = await supabaseRequest(
        "teams?select=*"
    );

} catch {

    teams = [];
}


if (!teams.length) {

    teams = [
        {
            id: "1minute",
            name: TEAM_NAME,
            title: TEAM_NAME,
            tag: "1M",
            country: "Russia",
            logo: "",
            avatar: "",
            faceit: "",
            steam: "",
            description:
                "Профили состава, матчи и статистика 1Minute — всё в одном месте.",
            status: "active"
        }
    ];
}
```

}

/* =========================
HELPERS
========================= */

function normalizeName(name) {

```
return String(name || "")
    .trim()
    .toLowerCase();
```

}

function isSubstitute(player) {

```
const name = normalizeName(
    player.name
);

return SUBSTITUTES
    .map(normalizeName)
    .includes(name);
```

}

function getStarterPlayers() {

```
return players.filter(player => {

    const name =
        normalizeName(player.name);

    return STARTERS
        .map(normalizeName)
        .includes(name);

});
```

}

function getSubstitutePlayers() {

```
return players.filter(player =>
    isSubstitute(player)
);
```

}

function getTeam() {

```
return teams[0] || {

    id: "1minute",

    name: TEAM_NAME,

    title: TEAM_NAME,

    tag: "1M",

    country: "Russia",

    logo: "",

    faceit: "",

    steam: "",

    description:
        "Профили состава, матчи и статистика 1Minute — всё в одном месте.",

    status: "active"
};
```

}

/* =========================
RENDER TEAM
========================= */

function renderTeams() {

```
const grid =
    document.getElementById("grid");

if (!grid) return;

const team = getTeam();


grid.innerHTML = `

    <div
        class="team-card"
        onclick="openTeam('${escapeAttribute(team.name || TEAM_NAME)}')"
    >

        <div class="team-card-top">

            <div class="team-logo">

                ${
                    team.logo || team.avatar
                    ?
                    `<img
                        src="${escapeAttribute(team.logo || team.avatar)}"
                        alt="${escapeAttribute(team.name || TEAM_NAME)}"
                    >`
                    :
                    `<span>1</span>`
                }

            </div>


            <div>

                <div class="team-name">
                    ${escapeHTML(team.name || TEAM_NAME)}
                </div>

                <div class="team-tag">
                    ${escapeHTML(team.tag || "1M")}
                </div>

            </div>

        </div>


        <div class="team-card-bottom">

            <span>
                ${escapeHTML(team.country || "Russia")}
            </span>

            <span class="status">
                ● ACTIVE
            </span>

        </div>

    </div>

`;
```

}

/* =========================
TEAM PAGE
========================= */

function openTeam() {

```
const teamPage =
    document.getElementById("teamPage");

const teamsPage =
    document.getElementById("teams");

if (!teamPage || !teamsPage)
    return;


teamsPage.classList.add("hidden");

document
    .querySelectorAll(".page-section")
    .forEach(section =>
        section.classList.add("hidden")
    );

teamPage.classList.remove("hidden");


renderTeamProfile();

window.location.hash =
    "teamPage";
```

}

function renderTeamProfile() {

```
const container =
    document.getElementById("teamProfile");

if (!container)
    return;


const team = getTeam();

const starters =
    getStarterPlayers();

const substitutes =
    getSubstitutePlayers();


container.innerHTML = `

    <div class="team-profile">

        <div class="team-profile-header">

            <div class="team-profile-logo">

                ${
                    team.logo || team.avatar
                    ?
                    `<img
                        src="${escapeAttribute(team.logo || team.avatar)}"
                        alt="1Minute"
                    >`
                    :
                    `<span>1</span>`
                }

            </div>


            <div>

                <div class="eyebrow">
                    TEAM
                </div>

                <h1>
                    ${escapeHTML(team.name || TEAM_NAME)}
                </h1>

                <p>
                    ${escapeHTML(
                        team.description ||
                        "Профили состава, матчи и статистика 1Minute — всё в одном месте."
                    )}
                </p>

            </div>

        </div>



        <div class="roster">

            <div class="section-head">

                <div>

                    <div class="eyebrow">
                        ROSTER
                    </div>

                    <h2>
                        Основной состав
                    </h2>

                </div>

            </div>


            <div class="player-grid">

                ${
                    starters.length
                    ?
                    starters
                        .map(player =>
                            playerCard(
                                player,
                                false
                            )
                        )
                        .join("")
                    :
                    emptyPlayers()
                }

            </div>



            <div class="section-head substitutes-title">

                <div>

                    <div class="eyebrow">
                        SUBSTITUTES
                    </div>

                    <h2>
                        Замены
                    </h2>

                </div>

            </div>


            <div class="player-grid">

                ${
                    substitutes.length
                    ?
                    substitutes
                        .map(player =>
                            playerCard(
                                player,
                                true
                            )
                        )
                        .join("")
                    :
                    emptyPlayers()
                }

            </div>

        </div>

    </div>

`;
```

}

/* =========================
PLAYER CARD
========================= */

function playerCard(player, substitute) {

```
const avatar =
    player.avatar ||
    player.photo ||
    "";

const name =
    player.name ||
    "Player";

const role =
    player.role ||
    "Игрок";


return `

    <div
        class="player-card"
        onclick="openPlayer('${escapeAttribute(name)}')"
    >

        <div class="player-avatar">

            ${
                avatar
                ?
                `<img
                    src="${escapeAttribute(avatar)}"
                    alt="${escapeAttribute(name)}"
                >`
                :
                `<span>
                    ${escapeHTML(
                        name.charAt(0).toUpperCase()
                    )}
                </span>`
            }

        </div>


        <div class="player-info">

            <h3>
                ${escapeHTML(name)}
            </h3>

            <span>
                ${escapeHTML(role)}
            </span>

        </div>


        ${
            substitute
            ?
            `<div class="player-badge">
                ЗАМЕНА
            </div>`
            :
            ""
        }

    </div>

`;
```

}

function emptyPlayers() {

```
return `
    <div class="glass" style="
        padding:24px;
        color:#858c98;
    ">
        Игроки пока не добавлены.
    </div>
`;
```

}

/* =========================
PLAYER PAGE
========================= */

function openPlayer(name) {

```
const player =
    players.find(
        p =>
            normalizeName(p.name) ===
            normalizeName(name)
    );


if (!player)
    return;


document
    .getElementById("teams")
    ?.classList.add("hidden");


document
    .getElementById("teamPage")
    ?.classList.add("hidden");


document
    .querySelectorAll(".page-section")
    .forEach(section =>
        section.classList.add("hidden")
    );


const page =
    document.getElementById("playerPage");


if (!page)
    return;


page.classList.remove("hidden");


renderPlayerProfile(player);


window.location.hash =
    "playerPage";
```

}

function renderPlayerProfile(player) {

```
const container =
    document.getElementById("playerProfile");

if (!container)
    return;


const avatar =
    player.avatar ||
    player.photo ||
    "";


container.innerHTML = `

    <div class="player-profile">

        <div class="player-profile-avatar">

            ${
                avatar
                ?
                `<img
                    src="${escapeAttribute(avatar)}"
                    alt="${escapeAttribute(player.name)}"
                >`
                :
                `<span>
                    ${escapeHTML(
                        player.name
                            .charAt(0)
                            .toUpperCase()
                    )}
                </span>`
            }

        </div>


        <div class="eyebrow">
            PLAYER
        </div>


        <h1>
            ${escapeHTML(player.name)}
        </h1>


        <div class="player-role">

            ${escapeHTML(
                player.role || "Игрок"
            )}

        </div>


        ${
            player.country
            ?
            `<p>
                ${escapeHTML(player.country)}
            </p>`
            :
            ""
        }


        <div class="player-links">

            ${
                player.faceit
                ?
                `
                <a
                    class="secondary"
                    href="${escapeAttribute(player.faceit)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    FACEIT →
                </a>
                `
                :
                ""
            }


            ${
                player.steam
                ?
                `
                <a
                    class="secondary"
                    href="${escapeAttribute(player.steam)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Steam →
                </a>
                `
                :
                ""
            }

        </div>

    </div>

`;
```

}

/* =========================
CLOSE PAGES
========================= */

function closeTeam() {

```
document
    .getElementById("teamPage")
    ?.classList.add("hidden");


document
    .getElementById("playerPage")
    ?.classList.add("hidden");


document
    .getElementById("teams")
    ?.classList.remove("hidden");


window.location.hash =
    "teams";
```

}

function closePlayer() {

```
document
    .getElementById("playerPage")
    ?.classList.add("hidden");


document
    .getElementById("teamPage")
    ?.classList.remove("hidden");


renderTeamProfile();


window.location.hash =
    "teamPage";
```

}

/* =========================
FILTER
========================= */

/*
Старые категории больше не нужны.
Функция оставлена, чтобы старый HTML
не выдавал ошибку, если где-то остались
старые кнопки.
*/

function filterTeams() {

```
renderTeams();
```

}

/* =========================
RATING
========================= */

function renderRating() {

```
const rows =
    document.getElementById("ratingRows");

if (!rows)
    return;


const team =
    getTeam();


rows.innerHTML = `

    <tr>

        <td>
            1
        </td>

        <td>
            <strong>
                ${escapeHTML(
                    team.name || TEAM_NAME
                )}
            </strong>
        </td>

        <td>
            0
        </td>

        <td>
            0
        </td>

        <td>
            —
        </td>

    </tr>

`;
```

}

/* =========================
MATCHES
========================= */

function renderMatches() {

```
const container =
    document.getElementById("matchesList");

if (!container)
    return;


container.innerHTML = `

    <div
        class="glass"
        style="
            padding:24px;
            color:#858c98;
        "
    >
        Матчи 1Minute пока не добавлены.
    </div>

`;
```

}

/* =========================
TOURNAMENTS
========================= */

function renderTournaments() {

```
const container =
    document.getElementById(
        "tournamentsGrid"
    );

if (!container)
    return;


container.innerHTML = `

    <div
        class="glass"
        style="
            padding:24px;
            color:#858c98;
        "
    >
        Турниры 1Minute пока не добавлены.
    </div>

`;
```

}

/* =========================
EDIT PLAYER
========================= */

function openPlayerEditor(name) {

```
const player =
    players.find(
        p =>
            normalizeName(p.name) ===
            normalizeName(name)
    );


if (!player)
    return;


document.getElementById(
    "playerEditOldName"
).value = player.name || "";


document.getElementById(
    "playerEditTeam"
).value = TEAM_NAME;


document.getElementById(
    "playerEditName"
).value = player.name || "";


document.getElementById(
    "playerEditCountry"
).value = player.country || "";


document.getElementById(
    "playerEditRole"
).value = player.role || "Игрок";


document.getElementById(
    "playerEditAvatar"
).value = player.avatar || "";


document.getElementById(
    "playerEditFaceit"
).value = player.faceit || "";


document.getElementById(
    "playerEditSteam"
).value = player.steam || "";


document
    .getElementById("playerEditModal")
    ?.classList.remove("hidden");
```

}

function closePlayerEditor() {

```
document
    .getElementById("playerEditModal")
    ?.classList.add("hidden");
```

}

async function savePlayer(event) {

```
event.preventDefault();


const oldName =
    document.getElementById(
        "playerEditOldName"
    ).value;


const data = {

    name:
        document.getElementById(
            "playerEditName"
        ).value.trim(),

    country:
        document.getElementById(
            "playerEditCountry"
        ).value.trim(),

    role:
        document.getElementById(
            "playerEditRole"
        ).value,

    avatar:
        document.getElementById(
            "playerEditAvatar"
        ).value.trim(),

    faceit:
        document.getElementById(
            "playerEditFaceit"
        ).value.trim(),

    steam:
        document.getElementById(
            "playerEditSteam"
        ).value.trim()

};


try {

    await supabaseRequest(
        `players?name=eq.${encodeURIComponent(oldName)}`,
        {
            method: "PATCH",
            headers: {
                "Prefer": "return=representation"
            },
            body: JSON.stringify(data)
        }
    );


    await loadPlayers();

    closePlayerEditor();

    renderTeams();


    if (
        !document
            .getElementById("teamPage")
            ?.classList.contains("hidden")
    ) {

        renderTeamProfile();

    }


    alert(
        "Игрок успешно сохранён."
    );


} catch (error) {

    console.error(error);

    alert(
        "Не удалось сохранить игрока."
    );

}
```

}

/* =========================
EDIT TEAM
========================= */

function closeEditor() {

```
document
    .getElementById("editModal")
    ?.classList.add("hidden");
```

}

function openEditor() {

```
const team =
    getTeam();


const fields = {

    editName:
        team.name || TEAM_NAME,

    editTitle:
        team.title ||
        team.name ||
        TEAM_NAME,

    editTag:
        team.tag || "1M",

    editCountry:
        team.country || "Russia",

    editLogo:
        team.logo ||
        team.avatar ||
        "",

    editFaceit:
        team.faceit || "",

    editSteam:
        team.steam || "",

    editDescription:
        team.description || ""

};


Object.entries(fields)
    .forEach(([id, value]) => {

        const element =
            document.getElementById(id);

        if (element)
            element.value = value;

    });


document
    .getElementById("editModal")
    ?.classList.remove("hidden");
```

}

/* =========================
ESCAPE
========================= */

function escapeHTML(value) {

```
return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
```

}

function escapeAttribute(value) {

```
return escapeHTML(value);
```

}

/* =========================
NAVIGATION
========================= */

function showSectionFromHash() {

```
const hash =
    window.location.hash;


if (
    hash === "#rating" ||
    hash === "#matches" ||
    hash === "#tournaments"
) {

    document
        .getElementById("teams")
        ?.classList.add("hidden");


    document
        .getElementById("teamPage")
        ?.classList.add("hidden");


    document
        .getElementById("playerPage")
        ?.classList.add("hidden");


    const target =
        document.querySelector(hash);


    if (target)
        target.classList.remove("hidden");


    return;
}


if (hash === "#teamPage") {

    openTeam();

    return;
}


if (hash === "#playerPage") {

    return;
}


document
    .getElementById("teams")
    ?.classList.remove("hidden");


document
    .getElementById("teamPage")
    ?.classList.add("hidden");


document
    .getElementById("playerPage")
    ?.classList.add("hidden");


document
    .querySelectorAll(".page-section")
    .forEach(section =>
        section.classList.add("hidden")
    );
```

}

/* =========================
START
========================= */

async function init() {

```
console.log(
    "1Minute app starting..."
);


await loadPlayers();

await loadTeams();


renderTeams();

renderRating();

renderMatches();

renderTournaments();


showSectionFromHash();


console.log(
    "1Minute app ready."
);
```

}

window.addEventListener(
"hashchange",
showSectionFromHash
);

document.addEventListener(
"DOMContentLoaded",
() => {

```
    const form =
        document.getElementById(
            "playerEditForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            savePlayer
        );

    }


    init();

}
```

);
