const SUPABASE_URL = 'https://wzheavazneaybhmgfntn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ZsTLAQNw2ILBetxcMTGY2A_rhMO_hkK';

let teams = [];
let players = [];

const matches = [
    ['1M Academy', 'Velocity', '16 : 12', 'Сегодня'],
    ['NightFox', 'Rebels', '13 : 16', 'Вчера'],
    ['Nova', 'United', '10 : 16', '16.08.2026'],
    ['Velocity', 'NightFox', '16 : 14', '15.08.2026']
];

const tournaments = [
    ['1Minute Championship #12', 'Активный', '128 команд'],
    ['1Minute Pro League S4', 'Активный', '32 команды'],
    ['1Minute Cup Summer', 'Завершён', '64 команды']
];

const defaultTeams = [
    {
        name: '1M Academy',
        tag: '1MA',
        country: 'Russia',
        status: 'active',
        rank: 1,
        matches: 28,
        wins: 22,
        points: 2140,
        logo: '',
        faceit: 'https://www.faceit.com/',
        steam: 'https://steamcommunity.com/',
        description: 'Молодой состав 1Minute, который строится вокруг дисциплины и стабильной игры.'
    },
    {
        name: 'Velocity',
        tag: 'VL',
        country: 'Netherlands',
        status: 'active',
        rank: 2,
        matches: 27,
        wins: 20,
        points: 2070,
        logo: '',
        faceit: 'https://www.faceit.com/',
        steam: 'https://steamcommunity.com/',
        description: 'Состав с агрессивным стилем и быстрым темпом.'
    },
    {
        name: 'NightFox',
        tag: 'NF',
        country: 'Germany',
        status: 'active',
        rank: 3,
        matches: 30,
        wins: 19,
        points: 1985,
        logo: '',
        faceit: 'https://www.faceit.com/',
        steam: 'https://steamcommunity.com/',
        description: 'Тактическая команда с упором на командную игру.'
    },
    {
        name: 'Rebels',
        tag: 'RB',
        country: 'Poland',
        status: 'active',
        rank: 4,
        matches: 25,
        wins: 17,
        points: 1910,
        logo: '',
        faceit: 'https://www.faceit.com/',
        steam: 'https://steamcommunity.com/',
        description: 'Молодой конкурентоспособный состав.'
    },
    {
        name: 'Nova',
        tag: 'NV',
        country: 'Sweden',
        status: 'inactive',
        rank: 5,
        matches: 22,
        wins: 12,
        points: 1760,
        logo: '',
        faceit: '',
        steam: '',
        description: 'Команда временно неактивна.'
    },
    {
        name: 'United',
        tag: 'UN',
        country: 'France',
        status: 'inactive',
        rank: 6,
        matches: 20,
        wins: 9,
        points: 1640,
        logo: '',
        faceit: '',
        steam: '',
        description: 'Состав находится на перерыве.'
    }
];

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

async function api(table, query = '', options = {}) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${table}${query}`,
        {
            ...options,
            headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        }
    );

    const text = await response.text();

    if (!response.ok) {
        console.error('Supabase error:', text);
        throw new Error(text);
    }

    return text ? JSON.parse(text) : [];
}

function logo(team, cls = 'team-logo') {
    if (team.logo) {
        return `
            <div class="${cls}">
                <img src="${esc(team.logo)}" alt="">
            </div>
        `;
    }

    return `
        <div class="${cls}">
            ${esc(team.tag || '1M')}
        </div>
    `;
}

function renderTeams(list = teams) {
    const grid = document.getElementById('grid');

    if (!grid) return;

    grid.innerHTML = list.map(team => `
        <article
            class="team-card"
            onclick="openTeam(${JSON.stringify(team.name)})"
        >

            <div class="team-top">

                ${logo(team)}

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

                <span class="status ${esc(team.status)}">
                    ${team.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                </span>

            </div>

        </article>
    `).join('');
}

function filterTeams(type, button) {
    document
        .querySelectorAll('.filters button')
        .forEach(btn => btn.classList.remove('selected'));

    button.classList.add('selected');

    if (type === 'all') {
        renderTeams(teams);
    } else {
        renderTeams(
            teams.filter(team => team.status === type)
        );
    }
}

function renderRating() {
    const rows = document.getElementById('ratingRows');

    if (!rows) return;

    rows.innerHTML = teams.map(team => `
        <tr>
            <td>#${team.rank}</td>
            <td><b>${esc(team.name)}</b></td>
            <td>${team.matches}</td>
            <td>${team.wins}</td>
            <td><b>${team.points}</b></td>
        </tr>
    `).join('');
}

function renderMatches() {
    const box = document.getElementById('matchesList');

    if (!box) return;

    box.innerHTML = matches.map(match => `
        <div class="match">

            <div>

                <div class="match-name">
                    ${esc(match[0])} — ${esc(match[1])}
                </div>

                <div class="date">
                    ${esc(match[3])}
                </div>

            </div>

            <div class="score">
                ${esc(match[2])}
            </div>

        </div>
    `).join('');
}

function renderTournaments() {
    const box = document.getElementById('tournamentsGrid');

    if (!box) return;

    box.innerHTML = tournaments.map(item => `
        <div class="tournament">

            <span class="status">
                ${esc(item[1])}
            </span>

            <h3>
                ${esc(item[0])}
            </h3>

            <p>
                ${esc(item[2])} · 1Minute
            </p>

        </div>
    `).join('');
}

function renderAll() {
    renderTeams();
    renderRating();
    renderMatches();
    renderTournaments();
}

async function loadData() {
    try {
        teams = await api(
            'teams',
            '?select=*&order=rank.asc'
        );

        players = await api(
            'players',
            '?select=*&order=id.asc'
        );

        if (!teams.length) {
            teams = await api(
                'teams',
                '',
                {
                    method: 'POST',
                    headers: {
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify(defaultTeams)
                }
            );
        }

        renderAll();

        console.log('Supabase подключён.');
        console.log('Команд:', teams.length);
        console.log('Игроков:', players.length);

    } catch (error) {

        console.error(error);

        /*
         * Если база пока не отвечает,
         * показываем команды локально,
         * чтобы сайт не был пустым.
         */

        teams = defaultTeams;
        players = [];

        renderAll();

        console.warn(
            'База Supabase пока недоступна. Используются временные данные.'
        );
    }
}

function openTeam(name) {
    const team = teams.find(item => item.name === name);

    if (!team) {
        console.error('Команда не найдена:', name);
        return;
    }

    document
        .querySelectorAll('.screen')
        .forEach(screen => screen.classList.add('hidden'));

    document
        .getElementById('teamPage')
        .classList.remove('hidden');

    const teamPlayers = players.filter(
        player => Number(player.team_id) === Number(team.id)
    );

    const profile = document.getElementById('teamProfile');

    profile.innerHTML = `
        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    ${logo(team, 'profile-logo')}

                    <div>

                        <h1>
                            ${esc(team.name)}
                        </h1>

                        <div class="profile-country">
                            ◉ ${esc(team.country)}
                            ·
                            ${team.status === 'active'
                                ? 'Активная команда'
                                : 'Неактивная команда'}
                        </div>

                        <div class="links">

                            ${team.faceit ? `
                                <a
                                    class="link"
                                    href="${esc(team.faceit)}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    FACEIT ↗
                                </a>
                            ` : ''}

                            ${team.steam ? `
                                <a
                                    class="link"
                                    href="${esc(team.steam)}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    Steam ↗
                                </a>
                            ` : ''}

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
                            ${team.matches
                                ? Math.round(team.wins / team.matches * 100)
                                : 0}%
                        </b>
                        <small>Win rate</small>
                    </div>

                </div>

                <div class="panel-actions">

                    <button
                        class="edit-btn"
                        onclick="openEditor(${JSON.stringify(team.name)})"
                    >
                        ✎ Редактировать команду
                    </button>

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Состав
                    </h3>

                    ${
                        teamPlayers.length
                        ?
                        teamPlayers.map(player => `
                            <div
                                class="player"
                                onclick="openPlayer(
                                    ${JSON.stringify(team.name)},
                                    ${JSON.stringify(player.name)}
                                )"
                                style="cursor:pointer"
                            >

                                <div class="mini">
                                    ${esc(
                                        player.name
                                            .substring(0, 2)
                                            .toUpperCase()
                                    )}
                                </div>

                                <div>

                                    <b>
                                        ${esc(player.name)}
                                    </b>

                                    <div class="role">
                                        ${esc(player.role || 'Игрок')}
                                    </div>

                                </div>

                            </div>
                        `).join('')
                        :
                        `
                            <p style="color:#858c98">
                                Игроков пока нет.
                            </p>
                        `
                    }

                    <div class="panel-actions">

                        <button
                            class="edit-btn"
                            onclick="openPlayerCreator(${JSON.stringify(team.name)})"
                        >
                            ＋ Добавить игрока
                        </button>

                    </div>

                </div>

                <div class="panel">

                    <h3>
                        О команде
                    </h3>

                    <p style="color:#858c98;line-height:1.7;font-size:13px">
                        ${esc(team.description || '')}
                    </p>

                    <div class="date">
                        Победы: ${team.wins}
                        ·
                        Поражения: ${team.matches - team.wins}
                    </div>

                </div>

            </div>

        </div>
    `;

    location.hash = 'team/' + encodeURIComponent(name);

    window.scrollTo(0, 0);
}

function closeTeam() {
    document
        .querySelectorAll('.screen')
        .forEach(screen => screen.classList.add('hidden'));

    document
        .getElementById('teams')
        .classList.remove('hidden');

    location.hash = 'teams';

    window.scrollTo(0, 0);
}

function openPlayer(teamName, playerName) {
    const team = teams.find(item => item.name === teamName);

    const player = players.find(
        item =>
            Number(item.team_id) === Number(team.id) &&
            item.name === playerName
    );

    if (!team || !player) {
        console.error('Игрок не найден.');
        return;
    }

    document
        .querySelectorAll('.screen')
        .forEach(screen => screen.classList.add('hidden'));

    document
        .getElementById('playerPage')
        .classList.remove('hidden');

    document.getElementById('playerProfile').innerHTML = `
        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">

                    <div class="profile-logo">
                        ${
                            player.avatar
                            ? `<img src="${esc(player.avatar)}" alt="">`
                            : esc(
                                player.name
                                    .substring(0, 2)
                                    .toUpperCase()
                            )
                        }
                    </div>

                    <div>

                        <h1>
                            ${esc(player.name)}
                        </h1>

                        <div class="profile-country">
                            ◉ ${esc(player.country || 'Страна не указана')}
                        </div>

                        <div class="role">
                            ${esc(player.role || 'Игрок')}
                        </div>

                        <div class="links">

                            ${player.faceit ? `
                                <a
                                    class="link"
                                    href="${esc(player.faceit)}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    FACEIT ↗
                                </a>
                            ` : ''}

                            ${player.steam ? `
                                <a
                                    class="link"
                                    href="${esc(player.steam)}"
                                    target="_blank"
                                    rel="noopener"
                                >
                                    Steam ↗
                                </a>
                            ` : ''}

                        </div>

                    </div>

                </div>

                <div class="profile-stats">

                    <div class="stat">
                        <b>${esc(team.name)}</b>
                        <small>Команда</small>
                    </div>

                    <div class="stat">
                        <b>${esc(player.role || 'Игрок')}</b>
                        <small>Роль</small>
                    </div>

                    <div class="stat">
                        <b>${esc(player.country || '—')}</b>
                        <small>Страна</small>
                    </div>

                    <div class="stat">
                        <b>CS2</b>
                        <small>Дисциплина</small>
                    </div>

                </div>

                <div class="panel-actions">

                    <button
                        class="edit-btn"
                        onclick="openPlayerEditor(
                            ${JSON.stringify(teamName)},
                            ${JSON.stringify(playerName)}
                        )"
                    >
                        ✎ Редактировать профиль
                    </button>

                </div>

            </div>

            <div class="profile-grid">

                <div class="panel">

                    <h3>
                        Профиль игрока
                    </h3>

                    <p style="color:#858c98;line-height:1.7;font-size:13px">
                        Никнейм:
                        <b>${esc(player.name)}</b>
                        <br>
                        Роль:
                        <b>${esc(player.role || 'Игрок')}</b>
                        <br>
                        Страна:
                        <b>${esc(player.country || '—')}</b>
                    </p>

                </div>

                <div class="panel">

                    <h3>
                        Команда
                    </h3>

                    <p style="color:#858c98;line-height:1.7;font-size:13px">
                        ${esc(team.name)}
                        ·
                        ${esc(team.country)}
                    </p>

                    <button
                        class="edit-btn"
                        onclick="openTeam(${JSON.stringify(team.name)})"
                    >
                        Открыть команду →
                    </button>

                </div>

            </div>

        </div>
    `;

    location.hash =
        'player/' +
        encodeURIComponent(teamName) +
        '/' +
        encodeURIComponent(playerName);

    window.scrollTo(0, 0);
}

function closePlayer() {
    const hash = location.hash;

    if (hash.startsWith('#player/')) {
        const data = decodeURIComponent(hash.substring(8)).split('/');

        if (data[0]) {
            openTeam(data[0]);
            return;
        }
    }

    closeTeam();
}

function openPlayerCreator(teamName) {
    document.getElementById('playerEditOldName').value = '';
    document.getElementById('playerEditTeam').value = teamName;
    document.getElementById('playerEditName').value = '';
    document.getElementById('playerEditCountry').value = '';
    document.getElementById('playerEditRole').value = 'Игрок';
    document.getElementById('playerEditAvatar').value = '';
    document.getElementById('playerEditFaceit').value = '';
    document.getElementById('playerEditSteam').value = '';

    document
        .getElementById('playerEditModal')
        .classList.remove('hidden');
}

function openPlayerEditor(teamName, playerName) {
    const team = teams.find(item => item.name === teamName);

    if (!team) return;

    const player = players.find(
        item =>
            Number(item.team_id) === Number(team.id) &&
            item.name === playerName
    );

    if (!player) return;

    document.getElementById('playerEditOldName').value = player.name;
    document.getElementById('playerEditTeam').value = teamName;
    document.getElementById('playerEditName').value = player.name;
    document.getElementById('playerEditCountry').value = player.country || '';
    document.getElementById('playerEditRole').value = player.role || 'Игрок';
    document.getElementById('playerEditAvatar').value = player.avatar || '';
    document.getElementById('playerEditFaceit').value = player.faceit || '';
    document.getElementById('playerEditSteam').value = player.steam || '';

    document
        .getElementById('playerEditModal')
        .classList.remove('hidden');
}

function closePlayerEditor() {
    document
        .getElementById('playerEditModal')
        .classList.add('hidden');
}

function openEditor(name) {
    const team = teams.find(item => item.name === name);

    if (!team) return;

    document.getElementById('editName').value = team.name;
    document.getElementById('editTitle').value = team.name;
    document.getElementById('editTag').value = team.tag;
    document.getElementById('editCountry').value = team.country;
    document.getElementById('editLogo').value = team.logo || '';
    document.getElementById('editFaceit').value = team.faceit || '';
    document.getElementById('editSteam').value = team.steam || '';
    document.getElementById('editDescription').value =
        team.description || '';

    document
        .getElementById('editModal')
        .classList.remove('hidden');
}

function closeEditor() {
    document
        .getElementById('editModal')
        .classList.add('hidden');
}

document
    .getElementById('editForm')
    .addEventListener('submit', async event => {

        event.preventDefault();

        const oldName =
            document.getElementById('editName').value;

        const team =
            teams.find(item => item.name === oldName);

        if (!team) return;

        const updated = {
            name: document.getElementById('editTitle').value.trim(),
            tag: document.getElementById('editTag').value.trim().toUpperCase(),
            country: document.getElementById('editCountry').value.trim(),
            logo: document.getElementById('editLogo').value.trim(),
            faceit: document.getElementById('editFaceit').value.trim(),
            steam: document.getElementById('editSteam').value.trim(),
            description: document.getElementById('editDescription').value.trim()
        };

        try {

            await api(
                'teams',
                `?id=eq.${team.id}`,
                {
                    method: 'PATCH',
                    body: JSON.stringify(updated)
                }
            );

            Object.assign(team, updated);

            closeEditor();

            renderAll();

            openTeam(team.name);

        } catch (error) {

            console.error(error);

            alert(
                'Ошибка сохранения команды. Проверь консоль браузера.'
            );
        }
    });

document
    .getElementById('playerEditForm')
    .addEventListener('submit', async event => {

        event.preventDefault();

        const teamName =
            document.getElementById('playerEditTeam').value;

        const oldName =
            document.getElementById('playerEditOldName').value;

        const team =
            teams.find(item => item.name === teamName);

        if (!team) return;

        const data = {
            name: document.getElementById('playerEditName').value.trim(),
            country: document.getElementById('playerEditCountry').value.trim(),
            role: document.getElementById('playerEditRole').value,
            avatar: document.getElementById('playerEditAvatar').value.trim(),
            faceit: document.getElementById('playerEditFaceit').value.trim(),
            steam: document.getElementById('playerEditSteam').value.trim()
        };

        if (!data.name) {
            alert('Введите никнейм игрока.');
            return;
        }

        try {

            if (oldName) {

                const player =
                    players.find(
                        item =>
                            Number(item.team_id) === Number(team.id) &&
                            item.name === oldName
                    );

                if (!player) return;

                await api(
                    'players',
                    `?id=eq.${player.id}`,
                    {
                        method: 'PATCH',
                        body: JSON.stringify(data)
                    }
                );

                Object.assign(player, data);

            } else {

                const created =
                    await api(
                        'players',
                        '',
                        {
                            method: 'POST',
                            headers: {
                                Prefer: 'return=representation'
                            },
                            body: JSON.stringify({
                                team_id: team.id,
                                ...data
                            })
                        }
                    );

                if (created && created[0]) {
                    players.push(created[0]);
                }
            }

            closePlayerEditor();

            openPlayer(
                teamName,
                data.name
            );

        } catch (error) {

            console.error(error);

            alert(
                'Ошибка сохранения игрока. Проверь консоль браузера.'
            );
        }
    });

window.addEventListener('hashchange', () => {

    const hash =
        decodeURIComponent(location.hash.substring(1));

    if (hash.startsWith('team/')) {

        openTeam(hash.substring(5));

        return;
    }

    if (hash.startsWith('player/')) {

        const data =
            hash.substring(7).split('/');

        if (data.length >= 2) {
            openPlayer(data[0], data[1]);
        }

        return;
    }

    if (!hash || hash === 'teams') {
        document
            .querySelectorAll('.screen')
            .forEach(screen => screen.classList.add('hidden'));

        document
            .getElementById('teams')
            .classList.remove('hidden');
    }
});

loadData();
