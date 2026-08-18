const SUPABASE_URL = "https://wzheavazneaybhmgfntn.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

const teams = [
    {
        name: "1M Academy",
        tag: "1MA",
        country: "Russia",
        status: "active",
        rank: 1,
        matches: 28,
        wins: 22,
        points: 2140,
        faceit: "https://www.faceit.com/",
        steam: "https://steamcommunity.com/",
        description: "Молодой состав 1Minute, который строится вокруг дисциплины и стабильной игры."
    }
];

let players = [];

const tournaments = [
    {
        name: "1Minute Championship #12",
        status: "Активный",
        teams: 128,
        prize: "$5,000",
        date: "18.08.2026 — 30.08.2026",
        description: "Главный открытый турнир 1Minute для соревновательных составов."
    },
    {
        name: "1Minute Pro League S4",
        status: "Скоро",
        teams: 32,
        prize: "$10,000",
        date: "05.09.2026 — 20.09.2026",
        description: "Профессиональная лига для сильнейших команд."
    },
    {
        name: "1Minute Cup Autumn",
        status: "Регистрация",
        teams: 64,
        prize: "$3,000",
        date: "01.09.2026 — 07.09.2026",
        description: "Осенний кубок с открытой регистрацией команд."
    }
];

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

async function supabaseRequest(endpoint, options = {}) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${endpoint}`,
        {
            ...options,
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Supabase error ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

async function loadPlayers() {
    try {
        const data = await supabaseRequest(
            "players?select=*&order=id.asc"
        );

        players = Array.isArray(data) ? data : [];

        renderCurrentTeam();

    } catch (error) {
        console.error("Ошибка загрузки игроков:", error);

        players = [];

        renderCurrentTeam();

        console.error(
            "Проверь SUPABASE_KEY и настройки таблицы players."
        );
    }
}

function getTeamPlayers() {
    return players;
}

function renderTeams(list = teams) {

    const grid = document.getElementById("grid");

    if (!grid) return;

    grid.innerHTML = list.map(team => `
        <article
            class="team-card"
            onclick="openTeam('${esc(team.name)}')">

            <div class="team-top">

                <div class="team-logo">
                    ${esc(team.tag)}
                </div>

                <div>

                    <div class="team-name">
                        ${esc(team.name)}
                    </div>

                    <div class="team-country">
                        ◉ ${esc(team.country)}
                    </div>

                </div>

            </div>

            <div class="team-bottom">

                <span>
                    #${team.rank} · ${team.points} ELO
                </span>

                <span class="status ${team.status}">
                    ${team.status === "active"
                        ? "ACTIVE"
                        : "INACTIVE"}
                </span>

            </div>

        </article>
    `).join("");
}

function filterTeams(type, button) {

    document
        .querySelectorAll(".filters button")
        .forEach(item => item.classList.remove("selected"));

    button.classList.add("selected");

    if (type === "all") {
        renderTeams(teams);
    } else {
        renderTeams(
            teams.filter(team => team.status === type)
        );
    }
}

function renderCurrentTeam() {

    const teamPage =
        document.getElementById("teamPage");

    if (!teamPage) return;

    if (
        !teamPage.classList.contains("hidden")
    ) {
        const hash =
            decodeURIComponent(
                location.hash.slice(1)
            );

        if (hash.startsWith("team/")) {
            openTeam(hash.slice(5));
        }
    }
}

function openTeam(name) {

    const team =
        teams.find(item => item.name === name);

    if (!team) return;

    document
        .querySelectorAll(".screen")
        .forEach(screen =>
            screen.classList.add("hidden")
        );

    document
        .getElementById("teamPage")
        .classList.remove("hidden");

    const teamPlayers =
        getTeamPlayers();

    const mainPlayers =
        teamPlayers.filter(
            player => player.status !== "substitute"
        );

    const substitutes =
        teamPlayers.filter(
            player => player.status === "substitute"
        );

    document.getElementById("teamProfile").innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">
                        ${esc(team.tag)}
                    </div>

                    <div>

                        <h1>
                            ${esc(team.name)}
                        </h1>

                        <div class="profile-country">
                            ◉ ${esc(team.country)}
                            · Активная команда
                        </div>

                        <div class="links">

                            <a
                                class="link"
                                target="_blank"
                                href="${esc(team.faceit)}">

                                FACEIT ↗

                            </a>

                            <a
                                class="link"
                                target="_blank"
                                href="${esc(team.steam)}">

                                Steam ↗

                            </a>

                        </div>

                    </div>

                </div>

                <div class="profile-stats">

                    <div class="stat">
                        <b>#${team.rank}</b>
                        <small>Место</small>
                    </div>

                    <div class="stat">
                        <b>${team.points}</b>
                        <small>ELO</small>
                    </div>

                    <div class="stat">
                        <b>${team.matches}</b>
                        <small>Матчей</small>
                    </div>

                    <div class="stat">
                        <b>
                            ${Math.round(
                                team.wins /
                                team.matches *
                                100
                            )}%
                        </b>
                        <small>Win rate</small>
                    </div>

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Основной состав
                    </h3>

                    ${
                        mainPlayers.length
                        ? mainPlayers.map(
                            playerCard
                        ).join("")
                        : `
                            <p style="color:#858c98">
                                Игроки пока не добавлены.
                            </p>
                        `
                    }

                </div>

                <div class="panel">

                    <h3>
                        Замены
                    </h3>

                    ${
                        substitutes.length
                        ? substitutes.map(
                            playerCard
                        ).join("")
                        : `
                            <p style="color:#858c98">
                                Замен пока нет.
                            </p>
                        `
                    }

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p
                        style="
                        color:#858c98;
                        line-height:1.7;
                        font-size:13px;
                        ">

                        ${esc(team.description)}

                    </p>

                    <div class="date">
                        Победы: ${team.wins}
                        ·
                        Поражения:
                        ${team.matches - team.wins}
                    </div>

                </div>

            </div>

        </div>
    `;

    location.hash =
        "team/" +
        encodeURIComponent(name);

    window.scrollTo(0, 0);
}

function playerCard(player) {

    const safeTeam = encodeURIComponent(
        "1M Academy"
    );

    const safePlayer = encodeURIComponent(
        player.name
    );

    return `

        <div
            class="player"
            onclick="openPlayer('${safeTeam}','${safePlayer}')"
            style="cursor:pointer">

            <div class="mini">

                ${
                    player.avatar
                    ? `
                        <img
                            src="${esc(player.avatar)}"
                            style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            border-radius:8px;
                            "
                        >
                    `
                    : esc(
                        player.name
                            .slice(0, 2)
                            .toUpperCase()
                    )
                }

            </div>

            <div>

                <b>
                    ${esc(player.name)}
                </b>

                <div class="role">
                    ${esc(player.role)}
                </div>

            </div>

        </div>
    `;
}

function closeTeam() {

    document
        .querySelectorAll(".screen")
        .forEach(screen =>
            screen.classList.add("hidden")
        );

    document
        .getElementById("teams")
        .classList.remove("hidden");

    location.hash = "teams";

    window.scrollTo(0, 0);
}

function openPlayer(
    teamName,
    playerName
) {

    teamName =
        decodeURIComponent(teamName);

    playerName =
        decodeURIComponent(playerName);

    const team =
        teams.find(item =>
            item.name === teamName
        );

    const player =
        players.find(item =>
            item.name === playerName
        );

    if (!team || !player) {
        console.error(
            "Игрок не найден:",
            playerName
        );
        return;
    }

    document
        .querySelectorAll(".screen")
        .forEach(screen =>
            screen.classList.add("hidden")
        );

    document
        .getElementById("playerPage")
        .classList.remove("hidden");

    document.getElementById(
        "playerProfile"
    ).innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">

                        ${
                            player.avatar
                            ? `
                                <img
                                    src="${esc(player.avatar)}"
                                    style="
                                    width:100%;
                                    height:100%;
                                    object-fit:cover;
                                    border-radius:16px;
                                    "
                                >
                            `
                            : esc(
                                player.name
                                    .slice(0, 2)
                                    .toUpperCase()
                            )
                        }

                    </div>

                    <div>

                        <h1>
                            ${esc(player.name)}
                        </h1>

                        <div class="profile-country">
                            ◉
                            ${
                                esc(
                                    player.country ||
                                    "Страна не указана"
                                )
                            }
                        </div>

                        <div class="role">
                            ${esc(player.role)}
                        </div>

                        <div class="links">

                            ${
                                player.faceit
                                ? `
                                    <a
                                        class="link"
                                        target="_blank"
                                        href="${esc(player.faceit)}">

                                        FACEIT ↗

                                    </a>
                                `
                                : ""
                            }

                            ${
                                player.steam
                                ? `
                                    <a
                                        class="link"
                                        target="_blank"
                                        href="${esc(player.steam)}">

                                        Steam ↗

                                    </a>
                                `
                                : ""
                            }

                        </div>

                        <div
                            style="
                            margin-top:16px;
                            ">

                            <button
                                class="edit-btn"
                                onclick="openPlayerEditor(
                                    '${esc(team.name)}',
                                    '${esc(player.name)}'
                                )">

                                ✎ Редактировать профиль

                            </button>

                        </div>

                    </div>

                </div>

                <div class="profile-stats">

                    <div class="stat">
                        <b>${esc(team.name)}</b>
                        <small>Команда</small>
                    </div>

                    <div class="stat">
                        <b>${esc(player.role)}</b>
                        <small>Роль</small>
                    </div>

                    <div class="stat">
                        <b>
                            ${esc(
                                player.country ||
                                "—"
                            )}
                        </b>
                        <small>Страна</small>
                    </div>

                    <div class="stat">
                        <b>CS2</b>
                        <small>Дисциплина</small>
                    </div>

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Профиль игрока
                    </h3>

                    <p
                        style="
                        color:#858c98;
                        line-height:1.8;
                        font-size:13px;
                        ">

                        Никнейм:
                        <b>
                            ${esc(player.name)}
                        </b>

                        <br>

                        Роль:
                        <b>
                            ${esc(player.role)}
                        </b>

                        <br>

                        Страна:
                        <b>
                            ${esc(
                                player.country ||
                                "Не указана"
                            )}
                        </b>

                    </p>

                </div>

                <div class="panel">

                    <h3>
                        Команда
                    </h3>

                    <p
                        style="
                        color:#858c98;
                        line-height:1.8;
                        font-size:13px;
                        ">

                        ${esc(team.name)}

                        <br>

                        ${esc(team.country)}

                    </p>

                    <button
                        class="edit-btn"
                        onclick="openTeam('${esc(team.name)}')">

                        ← Открыть команду

                    </button>

                </div>

            </div>

        </div>
    `;

    location.hash =
        "player/" +
        encodeURIComponent(teamName) +
        "/" +
        encodeURIComponent(playerName);

    window.scrollTo(0, 0);
}

function openPlayerEditor(
    teamName,
    playerName
) {

    const player =
        players.find(item =>
            item.name === playerName
        );

    if (!player) return;

    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (!modal) return;

    document.getElementById(
        "playerEditOldName"
    ).value = player.name;

    document.getElementById(
        "playerEditTeam"
    ).value = teamName;

    document.getElementById(
        "playerEditName"
    ).value = player.name || "";

    document.getElementById(
        "playerEditCountry"
    ).value = player.country || "";

    const roleSelect =
        document.getElementById(
            "playerEditRole"
        );

    const existingRole =
        player.role || "Игрок";

    if (
        !Array.from(
            roleSelect.options
        ).some(
            option =>
                option.value === existingRole
        )
    ) {

        const option =
            document.createElement("option");

        option.value = existingRole;
        option.textContent = existingRole;

        roleSelect.appendChild(option);
    }

    roleSelect.value = existingRole;

    document.getElementById(
        "playerEditAvatar"
    ).value = player.avatar || "";

    document.getElementById(
        "playerEditFaceit"
    ).value = player.faceit || "";

    document.getElementById(
        "playerEditSteam"
    ).value = player.steam || "";

    modal.classList.remove("hidden");

    document.body.style.overflow = "hidden";
}

function closePlayerEditor() {

    const modal =
        document.getElementById(
            "playerEditModal"
        );

    if (modal) {
        modal.classList.add("hidden");
    }

    document.body.style.overflow = "";
}

async function savePlayer(event) {

    event.preventDefault();

    const oldName =
        document.getElementById(
            "playerEditOldName"
        ).value;

    const teamName =
        document.getElementById(
            "playerEditTeam"
        ).value;

    const player =
        players.find(item =>
            item.name === oldName
        );

    if (!player) {
        alert("Игрок не найден.");
        return;
    }

    const newName =
        document.getElementById(
            "playerEditName"
        ).value.trim();

    const country =
        document.getElementById(
            "playerEditCountry"
        ).value.trim();

    const role =
        document.getElementById(
            "playerEditRole"
        ).value.trim();

    const avatar =
        document.getElementById(
            "playerEditAvatar"
        ).value.trim();

    const faceit =
        document.getElementById(
            "playerEditFaceit"
        ).value.trim();

    const steam =
        document.getElementById(
            "playerEditSteam"
        ).value.trim();

    if (!newName) {
        alert("Введите ник игрока.");
        return;
    }

    try {

        const updated = {
            name: newName,
            country: country,
            role: role,
            avatar: avatar,
            faceit: faceit,
            steam: steam
        };

        await supabaseRequest(
            `players?id=eq.${player.id}`,
            {
                method: "PATCH",
                headers: {
                    "Prefer": "return=representation"
                },
                body: JSON.stringify(updated)
            }
        );

        player.name = newName;
        player.country = country;
        player.role = role;
        player.avatar = avatar;
        player.faceit = faceit;
        player.steam = steam;

        closePlayerEditor();

        openPlayer(
            teamName,
            newName
        );

    } catch (error) {

        console.error(
            "Ошибка сохранения игрока:",
            error
        );

        alert(
            "Не удалось сохранить изменения в Supabase."
        );
    }
}

function closePlayer() {

    const hash =
        decodeURIComponent(
            location.hash.slice(1)
        );

    if (hash.startsWith("player/")) {

        const parts =
            hash.slice(7).split("/");

        if (parts[0]) {
            openTeam(parts[0]);
            return;
        }
    }

    closeTeam();
}

function renderRating() {

    const rows =
        document.getElementById(
            "ratingRows"
        );

    if (!rows) return;

    rows.innerHTML =
        teams.map(team => `
            <tr>

                <td>
                    #${team.rank}
                </td>

                <td>
                    <b>
                        ${esc(team.name)}
                    </b>
                </td>

                <td>
                    ${team.matches}
                </td>

                <td>
                    ${team.wins}
                </td>

                <td>
                    <b>
                        ${team.points}
                    </b>
                </td>

            </tr>
        `).join("");
}

function renderMatches() {

    const container =
        document.getElementById(
            "matchesList"
        );

    if (!container) return;

    container.innerHTML = `

        <div class="match">

            <div>

                <div class="match-name">
                    1M Academy
                </div>

                <div class="date">
                    Следующий матч будет объявлен
                </div>

            </div>

            <div class="score">
                —
            </div>

        </div>
    `;
}

function renderTournaments() {

    const container =
        document.getElementById(
            "tournamentsGrid"
        );

    if (!container) return;

    container.innerHTML =
        tournaments.map(tournament => `

            <article
                class="tournament"
                style="
                padding:26px;
                border:1px solid rgba(255,255,255,.07);
                border-radius:18px;
                background:rgba(255,255,255,.025);
                ">

                <div
                    style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                    margin-bottom:18px;
                    ">

                    <span class="status">
                        ${esc(
                            tournament.status
                        )}
                    </span>

                    <span
                        style="
                        color:#858c98;
                        font-size:12px;
                        ">

                        ${esc(
                            tournament.date
                        )}

                    </span>

                </div>

                <h3>
                    ${esc(
                        tournament.name
                    )}
                </h3>

                <p
                    style="
                    color:#858c98;
                    line-height:1.7;
                    font-size:13px;
                    ">

                    ${esc(
                        tournament.description
                    )}

                </p>

                <div
                    style="
                    display:flex;
                    gap:25px;
                    margin-top:20px;
                    color:#fff;
                    font-size:13px;
                    ">

                    <span>
                        👥
                        ${tournament.teams}
                        команд
                    </span>

                    <span>
                        🏆
                        ${esc(
                            tournament.prize
                        )}
                    </span>

                </div>

            </article>

        `).join("");
}

function handleHash() {

    const hash =
        decodeURIComponent(
            location.hash.slice(1)
        );

    if (hash.startsWith("player/")) {

        const parts =
            hash.slice(7).split("/");

        if (parts.length >= 2) {

            openPlayer(
                parts[0],
                parts[1]
            );
        }

        return;
    }

    if (hash.startsWith("team/")) {

        openTeam(
            hash.slice(5)
        );

        return;
    }
}

const playerForm =
    document.getElementById(
        "playerEditForm"
    );

if (playerForm) {

    playerForm.addEventListener(
        "submit",
        savePlayer
    );
}

renderTeams();
renderRating();
renderMatches();
renderTournaments();

loadPlayers();

window.addEventListener(
    "hashchange",
    handleHash
);

if (location.hash) {
    setTimeout(
        handleHash,
        100
    );
}
