const SUPABASE_URL = "https://wzheavazneaybhmgfntn.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK";

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

let players = [];

const team = {
    name: "1Minute",
    title: "1Minute",
    tag: "1M",
    country: "Russia",
    logo: "",
    faceit: "",
    steam: "",
    description: "Профили состава, матчи и статистика 1Minute — всё в одном месте."
};

async function supabase(path, options) {
    options = options || {};

    const headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json"
    };

    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const response = await fetch(
        SUPABASE_URL + "/rest/v1/" + path,
        {
            method: options.method || "GET",
            headers: headers,
            body: options.body
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error("Supabase error:", text);
        throw new Error(text);
    }

    const text = await response.text();

    if (!text) {
        return [];
    }

    return JSON.parse(text);
}

function normalize(value) {
    return String(value || "").trim().toLowerCase();
}

function escapeHTML(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function findPlayer(name) {
    const target = normalize(name);

    for (let i = 0; i < players.length; i++) {
        if (normalize(players[i].name) === target) {
            return players[i];
        }
    }

    return null;
}

function getPlayersByNames(names) {
    const result = [];

    for (let i = 0; i < names.length; i++) {
        const player = findPlayer(names[i]);

        if (player) {
            result.push(player);
        }
    }

    return result;
}

async function loadPlayers() {
    try {
        const data = await supabase(
            "players?select=*&order=id.asc"
        );

        players = Array.isArray(data) ? data : [];

        console.log("Игроки загружены:", players);
    } catch (error) {
        console.error("Ошибка загрузки игроков:", error);
        players = [];
    }
}

function renderTeams() {
    const grid = document.getElementById("grid");

    if (!grid) {
        return;
    }

    let html = "";

    html += '<div class="team-card" onclick="openTeam()">';

    html += '<div class="team-card-top">';

    html += '<div class="team-logo">';

    if (team.logo) {
        html += '<img src="' +
            escapeHTML(team.logo) +
            '" alt="1Minute">';
    } else {
        html += "<span>1</span>";
    }

    html += "</div>";

    html += "<div>";

    html += '<div class="team-name">' +
        escapeHTML(TEAM_NAME) +
        "</div>";

    html += '<div class="team-tag">1M</div>';

    html += "</div>";

    html += "</div>";

    html += '<div class="team-card-bottom">';

    html += "<span>Russia</span>";

    html += '<span class="status">● ACTIVE</span>';

    html += "</div>";

    html += "</div>";

    grid.innerHTML = html;
}

function playerCard(player, isSubstitute) {
    const name = player.name || "Player";
    const role = player.role || "Игрок";
    const avatar = player.avatar || "";

    let html = "";

    html += '<div class="player-card" onclick="openPlayerByName(' +
        "'" +
        escapeHTML(name).replace(/'/g, "\\'") +
        "'" +
        ')">';

    html += '<div class="player-avatar">';

    if (avatar) {
        html += '<img src="' +
            escapeHTML(avatar) +
            '" alt="' +
            escapeHTML(name) +
            '">';
    } else {
        html += "<span>" +
            escapeHTML(name.charAt(0).toUpperCase()) +
            "</span>";
    }

    html += "</div>";

    html += '<div class="player-info">';

    html += "<h3>" +
        escapeHTML(name) +
        "</h3>";

    html += "<span>" +
        escapeHTML(role) +
        "</span>";

    html += "</div>";

    if (isSubstitute) {
        html += '<div class="player-badge">ЗАМЕНА</div>';
    }

    html += "</div>";

    return html;
}

function openTeam() {
    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");

    if (teams) {
        teams.classList.add("hidden");
    }

    hideOtherPages();

    if (teamPage) {
        teamPage.classList.remove("hidden");
    }

    renderTeamProfile();

    window.location.hash = "teamPage";
}

function renderTeamProfile() {
    const container = document.getElementById("teamProfile");

    if (!container) {
        return;
    }

    const starters = getPlayersByNames(STARTERS);
    const substitutes = getPlayersByNames(SUBSTITUTES);

    let html = "";

    html += '<div class="team-profile">';

    html += '<div class="team-profile-header">';

    html += '<div class="team-profile-logo">';

    if (team.logo) {
        html += '<img src="' +
            escapeHTML(team.logo) +
            '" alt="1Minute">';
    } else {
        html += "<span>1</span>";
    }

    html += "</div>";

    html += "<div>";

    html += '<div class="eyebrow">TEAM</div>';

    html += "<h1>" +
        escapeHTML(TEAM_NAME) +
        "</h1>";

    html += "<p>" +
        escapeHTML(team.description) +
        "</p>";

    html += "</div>";

    html += "</div>";

    html += '<div class="roster">';

    html += '<div class="section-head">';

    html += "<div>";

    html += '<div class="eyebrow">ROSTER</div>';

    html += "<h2>Основной состав</h2>";

    html += "</div>";

    html += "</div>";

    html += '<div class="player-grid">';

    if (starters.length === 0) {
        html += '<div class="glass" style="padding:24px;">' +
            "Игроки пока не загружены." +
            "</div>";
    } else {
        for (let i = 0; i < starters.length; i++) {
            html += playerCard(starters[i], false);
        }
    }

    html += "</div>";

    html += '<div class="section-head">';

    html += "<div>";

    html += '<div class="eyebrow">SUBSTITUTES</div>';

    html += "<h2>Замены</h2>";

    html += "</div>";

    html += "</div>";

    html += '<div class="player-grid">';

    if (substitutes.length === 0) {
        html += '<div class="glass" style="padding:24px;">' +
            "Замены пока не загружены." +
            "</div>";
    } else {
        for (let i = 0; i < substitutes.length; i++) {
            html += playerCard(substitutes[i], true);
        }
    }

    html += "</div>";

    html += "</div>";
    html += "</div>";

    container.innerHTML = html;
}

function openPlayerByName(name) {
    const player = findPlayer(name);

    if (!player) {
        return;
    }

    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

    if (teams) {
        teams.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    hideOtherPages();

    if (playerPage) {
        playerPage.classList.remove("hidden");
    }

    renderPlayerProfile(player);

    window.location.hash = "playerPage";
}

function renderPlayerProfile(player) {
    const container = document.getElementById("playerProfile");

    if (!container) {
        return;
    }

    let html = "";

    html += '<div class="player-profile">';

    html += '<div class="player-profile-avatar">';

    if (player.avatar) {
        html += '<img src="' +
            escapeHTML(player.avatar) +
            '" alt="' +
            escapeHTML(player.name) +
            '">';
    } else {
        html += "<span>" +
            escapeHTML(
                String(player.name || "P").charAt(0).toUpperCase()
            ) +
            "</span>";
    }

    html += "</div>";

    html += '<div class="eyebrow">PLAYER</div>';

    html += "<h1>" +
        escapeHTML(player.name) +
        "</h1>";

    html += '<div class="player-role">' +
        escapeHTML(player.role || "Игрок") +
        "</div>";

    if (player.country) {
        html += "<p>" +
            escapeHTML(player.country) +
            "</p>";
    }

    html += '<div class="player-links">';

    if (player.faceit) {
        html += '<a class="secondary" href="' +
            escapeHTML(player.faceit) +
            '" target="_blank" rel="noopener noreferrer">' +
            "FACEIT →" +
            "</a>";
    }

    if (player.steam) {
        html += '<a class="secondary" href="' +
            escapeHTML(player.steam) +
            '" target="_blank" rel="noopener noreferrer">' +
            "Steam →" +
            "</a>";
    }

    html += "</div>";

    html += "</div>";

    container.innerHTML = html;
}

function hideOtherPages() {
    const pages = document.querySelectorAll(".page-section");

    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.add("hidden");
    }
}

function closeTeam() {
    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    if (teams) {
        teams.classList.remove("hidden");
    }

    hideOtherPages();

    window.location.hash = "teams";
}

function closePlayer() {
    const playerPage = document.getElementById("playerPage");
    const teamPage = document.getElementById("teamPage");

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.remove("hidden");
    }

    renderTeamProfile();

    window.location.hash = "teamPage";
}

function filterTeams() {
    renderTeams();
}

function renderRating() {
    const rows = document.getElementById("ratingRows");

    if (!rows) {
        return;
    }

    rows.innerHTML =
        "<tr>" +
        "<td>1</td>" +
        "<td><strong>" + escapeHTML(TEAM_NAME) + "</strong></td>" +
        "<td>0</td>" +
        "<td>0</td>" +
        "<td>—</td>" +
        "</tr>";
}

function renderMatches() {
    const container = document.getElementById("matchesList");

    if (!container) {
        return;
    }

    container.innerHTML =
        '<div class="glass" style="padding:24px;color:#858c98;">' +
        "Матчи 1Minute пока не добавлены." +
        "</div>";
}

function renderTournaments() {
    const container = document.getElementById("tournamentsGrid");

    if (!container) {
        return;
    }

    container.innerHTML =
        '<div class="glass" style="padding:24px;color:#858c98;">' +
        "Турниры 1Minute пока не добавлены." +
        "</div>";
}

function openPlayerEditor(name) {
    const player = findPlayer(name);

    if (!player) {
        return;
    }

    const oldName = document.getElementById("playerEditOldName");
    const teamInput = document.getElementById("playerEditTeam");
    const nameInput = document.getElementById("playerEditName");
    const countryInput = document.getElementById("playerEditCountry");
    const roleInput = document.getElementById("playerEditRole");
    const avatarInput = document.getElementById("playerEditAvatar");
    const faceitInput = document.getElementById("playerEditFaceit");
    const steamInput = document.getElementById("playerEditSteam");

    if (oldName) {
        oldName.value = player.name || "";
    }

    if (teamInput) {
        teamInput.value = TEAM_NAME;
    }

    if (nameInput) {
        nameInput.value = player.name || "";
    }

    if (countryInput) {
        countryInput.value = player.country || "";
    }

    if (roleInput) {
        roleInput.value = player.role || "Игрок";
    }

    if (avatarInput) {
        avatarInput.value = player.avatar || "";
    }

    if (faceitInput) {
        faceitInput.value = player.faceit || "";
    }

    if (steamInput) {
        steamInput.value = player.steam || "";
    }

    const modal = document.getElementById("playerEditModal");

    if (modal) {
        modal.classList.remove("hidden");
    }
}

function closePlayerEditor() {
    const modal = document.getElementById("playerEditModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

async function savePlayer(event) {
    event.preventDefault();

    const oldName = document.getElementById("playerEditOldName").value;
    const newName = document.getElementById("playerEditName").value.trim();
    const country = document.getElementById("playerEditCountry").value.trim();
    const role = document.getElementById("playerEditRole").value;
    const avatar = document.getElementById("playerEditAvatar").value.trim();
    const faceit = document.getElementById("playerEditFaceit").value.trim();
    const steam = document.getElementById("playerEditSteam").value.trim();

    const data = {
        name: newName,
        country: country,
        role: role,
        avatar: avatar,
        faceit: faceit,
        steam: steam
    };

    try {
        await supabase(
            "players?name=eq." + encodeURIComponent(oldName),
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
        renderTeamProfile();

        alert("Игрок успешно сохранён.");
    } catch (error) {
        console.error(error);

        alert(
            "Ошибка сохранения игрока. Проверь RLS в Supabase."
        );
    }
}

function openEditor() {
    const title = document.getElementById("editTitle");
    const tag = document.getElementById("editTag");
    const country = document.getElementById("editCountry");
    const logo = document.getElementById("editLogo");
    const faceit = document.getElementById("editFaceit");
    const steam = document.getElementById("editSteam");
    const description = document.getElementById("editDescription");

    if (title) {
        title.value = TEAM_NAME;
    }

    if (tag) {
        tag.value = "1M";
    }

    if (country) {
        country.value = "Russia";
    }

    if (logo) {
        logo.value = team.logo;
    }

    if (faceit) {
        faceit.value = team.faceit;
    }

    if (steam) {
        steam.value = team.steam;
    }

    if (description) {
        description.value = team.description;
    }

    const modal = document.getElementById("editModal");

    if (modal) {
        modal.classList.remove("hidden");
    }
}

function closeEditor() {
    const modal = document.getElementById("editModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

function showHashPage() {
    const hash = window.location.hash;

    const teams = document.getElementById("teams");
    const teamPage = document.getElementById("teamPage");
    const playerPage = document.getElementById("playerPage");

    if (teams) {
        teams.classList.add("hidden");
    }

    if (teamPage) {
        teamPage.classList.add("hidden");
    }

    if (playerPage) {
        playerPage.classList.add("hidden");
    }

    hideOtherPages();

    if (
        hash === "#rating" ||
        hash === "#matches" ||
        hash === "#tournaments"
    ) {
        const page = document.querySelector(hash);

        if (page) {
            page.classList.remove("hidden");
        }

        return;
    }

    if (hash === "#teamPage") {
        if (teamPage) {
            teamPage.classList.remove("hidden");
        }

        renderTeamProfile();

        return;
    }

    if (hash === "#playerPage") {
        if (playerPage) {
            playerPage.classList.remove("hidden");
        }

        return;
    }

    if (teams) {
        teams.classList.remove("hidden");
    }
}

async function init() {
    console.log("1Minute запускается...");

    await loadPlayers();

    renderTeams();
    renderRating();
    renderMatches();
    renderTournaments();
    showHashPage();

    console.log("1Minute готов.");
}

window.addEventListener(
    "hashchange",
    showHashPage
);

document.addEventListener(
    "DOMContentLoaded",
    function() {
        const form = document.getElementById("playerEditForm");

        if (form) {
            form.addEventListener(
                "submit",
                savePlayer
            );
        }

        init();
    }
);
