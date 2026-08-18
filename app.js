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


const defaultPlayers = {

    '1M Academy': [
        {
            name: 's1mple',
            country: 'Russia',
            role: 'Капитан',
            avatar: '',
            faceit: 'https://www.faceit.com/',
            steam: 'https://steamcommunity.com/'
        },
        {
            name: 'electroNic',
            country: 'Russia',
            role: 'Игрок',
            avatar: '',
            faceit: '',
            steam: ''
        },
        {
            name: 'b1t',
            country: 'Ukraine',
            role: 'Игрок',
            avatar: '',
            faceit: '',
            steam: ''
        },
        {
            name: 'Perfecto',
            country: 'Russia',
            role: 'Игрок',
            avatar: '',
            faceit: '',
            steam: ''
        },
        {
            name: 'Ax1Le',
            country: 'Russia',
            role: 'Игрок',
            avatar: '',
            faceit: '',
            steam: ''
        }
    ],

    'Velocity': [
        { name: 'm0NESY', country: 'Netherlands', role: 'Капитан', avatar: '', faceit: '', steam: '' },
        { name: 'NiKo', country: 'Netherlands', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'huNter-', country: 'Netherlands', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'jks', country: 'Netherlands', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'malbsMd', country: 'Netherlands', role: 'Игрок', avatar: '', faceit: '', steam: '' }
    ],

    'NightFox': [
        { name: 'donk', country: 'Germany', role: 'Капитан', avatar: '', faceit: '', steam: '' },
        { name: 'sh1ro', country: 'Germany', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'magixx', country: 'Germany', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'zont1x', country: 'Germany', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'chopper', country: 'Germany', role: 'Игрок', avatar: '', faceit: '', steam: '' }
    ],

    'Rebels': [
        { name: 'ZywOo', country: 'Poland', role: 'Капитан', avatar: '', faceit: '', steam: '' },
        { name: 'apEX', country: 'Poland', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'flameZ', country: 'Poland', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'mezii', country: 'Poland', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'ropz', country: 'Poland', role: 'Игрок', avatar: '', faceit: '', steam: '' }
    ],

    'Nova': [
        { name: 'rain', country: 'Sweden', role: 'Капитан', avatar: '', faceit: '', steam: '' },
        { name: 'broky', country: 'Sweden', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'karrigan', country: 'Sweden', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'frozen', country: 'Sweden', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'Jame', country: 'Sweden', role: 'Игрок', avatar: '', faceit: '', steam: '' }
    ],

    'United': [
        { name: 'device', country: 'France', role: 'Капитан', avatar: '', faceit: '', steam: '' },
        { name: 'stavn', country: 'France', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'jabbi', country: 'France', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'cadiaN', country: 'France', role: 'Игрок', avatar: '', faceit: '', steam: '' },
        { name: 'dupreeh', country: 'France', role: 'Игрок', avatar: '', faceit: '', steam: '' }
    ]
};


let teams =
    JSON.parse(localStorage.getItem('1minute-teams') || 'null')
    || defaultTeams;


let players =
    JSON.parse(localStorage.getItem('1minute-players') || 'null')
    || defaultPlayers;


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


function esc(value) {

    return String(value ?? '').replace(
        /[&<>"']/g,
        character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character])
    );

}


function logo(team, className = 'team-logo') {

    if (team.logo) {

        return `
            <div class="${className}">
                <img src="${esc(team.logo)}" alt="">
            </div>
        `;

    }

    return `
        <div class="${className}">
            ${esc(team.tag)}
        </div>
    `;

}


function playerAvatar(player) {

    if (player.avatar) {

        return `
            <div class="mini">
                <img src="${esc(player.avatar)}" alt="">
            </div>
        `;

    }

    return `
        <div class="mini">
            ${esc(player.name.substring(0, 2).toUpperCase())}
        </div>
    `;

}


function savePlayers() {

    localStorage.setItem(
        '1minute-players',
        JSON.stringify(players)
    );

}


function renderTeams(list) {

    const grid = document.getElementById('grid');

    if (!grid) return;


    grid.innerHTML = list.map(team => `

        <article
            class="team-card"
            onclick="openTeam('${esc(team.name)}')"
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

                <span class="status ${team.status}">
                    ${team.status === 'active'
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                </span>

            </div>

        </article>

    `).join('');

}


function filterTeams(type, button) {

    document
        .querySelectorAll('.filters button')
        .forEach(button => button.classList.remove('selected'));


    button.classList.add('selected');


    renderTeams(
        type === 'all'
            ? teams
            : teams.filter(team => team.status === type)
    );

}


function renderAll() {

    renderTeams(teams);


    document.getElementById('ratingRows').innerHTML =
        teams.map(team => `

            <tr>

                <td>
                    #${team.rank}
                </td>

                <td>
                    <b>${esc(team.name)}</b>
                </td>

                <td>
                    ${team.matches}
                </td>

                <td>
                    ${team.wins}
                </td>

                <td>
                    <b>${team.points}</b>
                </td>

            </tr>

        `).join('');


    document.getElementById('matchesList').innerHTML =
        matches.map(match => `

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


    document.getElementById('tournamentsGrid').innerHTML =
        tournaments.map(tournament => `

            <div class="tournament">

                <span class="status">
                    ${esc(tournament[1])}
                </span>

                <h3>
                    ${esc(tournament[0])}
                </h3>

                <p>
                    ${esc(tournament[2])} · 1Minute
                </p>

            </div>

        `).join('');

}


function hideScreens() {

    document
        .querySelectorAll('.screen')
        .forEach(screen => screen.classList.add('hidden'));

}


function showMain() {

    hideScreens();

    document
        .getElementById('teams')
        .classList.remove('hidden');

}


function openTeam(name) {

    const team = teams.find(
        item => item.name === name
    );

    if (!team) return;


    hideScreens();

    document
        .getElementById('teamPage')
        .classList.remove('hidden');


    const teamPlayerList =
        players[name] || [];


    document.getElementById('teamProfile').innerHTML = `

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

                            ${
                                team.faceit
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            rel="noopener"
                                            href="${esc(team.faceit)}"
                                        >
                                            FACEIT ↗
                                        </a>
                                    `
                                    : ''
                            }


                            ${
                                team.steam
                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            rel="noopener"
                                            href="${esc(team.steam)}"
                                        >
                                            Steam ↗
                                        </a>
                                    `
                                    : ''
                            }

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
                        <b>${Math.round(team.wins / team.matches * 100)}%</b>
                        <small>Win rate</small>
                    </div>

                </div>


                <div class="panel-actions">

                    <button
                        class="edit-btn"
                        onclick="openEditor('${esc(team.name)}')"
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
                        teamPlayerList.length
                            ? teamPlayerList.map(player => `

                                <div
                                    class="player"
                                    onclick="openPlayer(
                                        '${esc(team.name)}',
                                        '${esc(player.name)}'
                                    )"
                                    style="cursor:pointer"
                                >

                                    ${playerAvatar(player)}

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
                            : `
                                <p style="color:#858c98;font-size:13px">
                                    Игроки пока не добавлены.
                                </p>
                            `
                    }


                    <div class="panel-actions">

                        <button
                            class="edit-btn"
                            onclick="openPlayerCreator('${esc(team.name)}')"
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
                        ${esc(team.description)}
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


    location.hash =
        'team/' + encodeURIComponent(name);

    window.scrollTo(0, 0);

}


function openPlayer(teamName, playerName) {

    const list = players[teamName] || [];


    const player = list.find(
        item => item.name === playerName
    );


    if (!player) return;


    const team = teams.find(
        item => item.name === teamName
    );


    hideScreens();


    document
        .getElementById('playerPage')
        .classList.remove('hidden');


    document.getElementById('playerProfile').innerHTML = `

        <div class="profile">

            <div class="profile-hero">

                <div class="profile-top">


                    ${
                        player.avatar

                            ? `
                                <div class="profile-logo">
                                    <img
                                        src="${esc(player.avatar)}"
                                        alt=""
                                    >
                                </div>
                            `

                            : `
                                <div class="profile-logo">
                                    ${esc(
                                        player.name
                                            .substring(0, 2)
                                            .toUpperCase()
                                    )}
                                </div>
                            `
                    }


                    <div>

                        <h1>
                            ${esc(player.name)}
                        </h1>

                        <div class="profile-country">
                            ◉ ${esc(player.country || 'Не указана')}
                        </div>

                        <div
                            class="role"
                            style="margin-top:8px"
                        >
                            ${esc(player.role || 'Игрок')}
                        </div>


                        <div class="links">


                            ${
                                player.faceit

                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            rel="noopener"
                                            href="${esc(player.faceit)}"
                                        >
                                            FACEIT ↗
                                        </a>
                                    `

                                    : ''
                            }


                            ${
                                player.steam

                                    ? `
                                        <a
                                            class="link"
                                            target="_blank"
                                            rel="noopener"
                                            href="${esc(player.steam)}"
                                        >
                                            Steam ↗
                                        </a>
                                    `

                                    : ''
                            }


                        </div>

                    </div>

                </div>


                <div class="profile-stats">

                    <div class="stat">

                        <b>
                            ${esc(team ? team.name : '—')}
                        </b>

                        <small>
                            Команда
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(player.role || 'Игрок')}
                        </b>

                        <small>
                            Роль
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            ${esc(player.country || '—')}
                        </b>

                        <small>
                            Страна
                        </small>

                    </div>


                    <div class="stat">

                        <b>
                            CS2
                        </b>

                        <small>
                            Дисциплина
                        </small>

                    </div>

                </div>


                <div class="panel-actions">

                    <button
                        class="edit-btn"
                        onclick="openPlayerEditor(
                            '${esc(teamName)}',
                            '${esc(player.name)}'
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

                    <div class="player">

                        ${playerAvatar(player)}

                        <div>

                            <b>
                                ${esc(player.name)}
                            </b>

                            <div class="role">
                                ${esc(player.role || 'Игрок')}
                            </div>

                        </div>

                    </div>

                </div>


                <div class="panel">

                    <h3>
                        Команда
                    </h3>

                    ${
                        team

                            ? `
                                <p style="color:#858c98;line-height:1.7;font-size:13px">
                                    ${esc(team.name)}
                                    ·
                                    ${esc(team.country)}
                                </p>

                                <button
                                    class="edit-btn"
                                    onclick="openTeam('${esc(team.name)}')"
                                >
                                    Открыть команду →
                                </button>
                            `

                            : ''
                    }

                </div>


            </div>

        </div>

    `;


    location.hash =
        'player/'
        + encodeURIComponent(teamName)
        + '/'
        + encodeURIComponent(playerName);


    window.scrollTo(0, 0);

}


function openPlayerCreator(teamName) {

    document.getElementById(
        'playerEditOldName'
    ).value = '';


    document.getElementById(
        'playerEditTeam'
    ).value = teamName;


    document.getElementById(
        'playerEditName'
    ).value = '';


    document.getElementById(
        'playerEditCountry'
    ).value = '';


    document.getElementById(
        'playerEditAvatar'
    ).value = '';


    document.getElementById(
        'playerEditRole'
    ).value = 'Игрок';


    document.getElementById(
        'playerEditFaceit'
    ).value = '';


    document.getElementById(
        'playerEditSteam'
    ).value = '';


    document.getElementById(
        'playerEditModal'
    ).classList.remove('hidden');

}


function openPlayerEditor(teamName, playerName) {

    const list = players[teamName] || [];


    const player = list.find(
        item => item.name === playerName
    );


    if (!player) return;


    document.getElementById(
        'playerEditOldName'
    ).value = player.name;


    document.getElementById(
        'playerEditTeam'
    ).value = teamName;


    document.getElementById(
        'playerEditName'
    ).value = player.name;


    document.getElementById(
        'playerEditCountry'
    ).value = player.country || '';


    document.getElementById(
        'playerEditAvatar'
    ).value = player.avatar || '';


    document.getElementById(
        'playerEditRole'
    ).value = player.role || 'Игрок';


    document.getElementById(
        'playerEditFaceit'
    ).value = player.faceit || '';


    document.getElementById(
        'playerEditSteam'
    ).value = player.steam || '';


    document.getElementById(
        'playerEditModal'
    ).classList.remove('hidden');

}


function closePlayerEditor() {

    document.getElementById(
        'playerEditModal'
    ).classList.add('hidden');

}


function closeEditor() {

    document.getElementById(
        'editModal'
    ).classList.add('hidden');

}


function closePlayer() {

    showMain();

    location.hash = 'teams';

    window.scrollTo(0, 0);

}


function closeTeam() {

    showMain();

    location.hash = 'teams';

    window.scrollTo(0, 0);

}


/* СОХРАНЕНИЕ КОМАНДЫ */

document
    .getElementById('editForm')
    .addEventListener('submit', function(event) {

        event.preventDefault();


        const oldName =
            document.getElementById('editName').value;


        const team =
            teams.find(item => item.name === oldName);


        if (!team) return;


        const previousName = team.name;


        team.name =
            document.getElementById('editTitle')
            .value.trim();


        team.tag =
            document.getElementById('editTag')
            .value.trim()
            .toUpperCase();


        team.country =
            document.getElementById('editCountry')
            .value.trim();


        team.logo =
            document.getElementById('editLogo')
            .value.trim();


        team.faceit =
            document.getElementById('editFaceit')
            .value.trim();


        team.steam =
            document.getElementById('editSteam')
            .value.trim();


        team.description =
            document.getElementById('editDescription')
            .value.trim();


        if (
            previousName !== team.name &&
            players[previousName]
        ) {

            players[team.name] =
                players[previousName];

            delete players[previousName];

            savePlayers();

        }


        localStorage.setItem(
            '1minute-teams',
            JSON.stringify(teams)
        );


        closeEditor();

        renderAll();

        openTeam(team.name);

    });


/* СОХРАНЕНИЕ ИГРОКА */

document
    .getElementById('playerEditForm')
    .addEventListener('submit', function(event) {

        event.preventDefault();


        const teamName =
            document.getElementById(
                'playerEditTeam'
            ).value;


        const oldName =
            document.getElementById(
                'playerEditOldName'
            ).value;


        const newName =
            document.getElementById(
                'playerEditName'
            ).value.trim();


        if (!newName) return;


        if (!players[teamName]) {
            players[teamName] = [];
        }


        const list =
            players[teamName];


        if (oldName) {

            const player =
                list.find(
                    item => item.name === oldName
                );


            if (!player) return;


            player.name = newName;

            player.country =
                document.getElementById(
                    'playerEditCountry'
                ).value.trim();


            player.avatar =
                document.getElementById(
                    'playerEditAvatar'
                ).value.trim();


            player.role =
                document.getElementById(
                    'playerEditRole'
                ).value.trim()
                || 'Игрок';


            player.faceit =
                document.getElementById(
                    'playerEditFaceit'
                ).value.trim();


            player.steam =
                document.getElementById(
                    'playerEditSteam'
                ).value.trim();

        } else {

            if (
                list.some(
                    item =>
                        item.name.toLowerCase()
                        === newName.toLowerCase()
                )
            ) {

                alert(
                    'Игрок с таким никнеймом уже есть в команде.'
                );

                return;

            }


            list.push({

                name: newName,

                country:
                    document.getElementById(
                        'playerEditCountry'
                    ).value.trim(),

                avatar:
                    document.getElementById(
                        'playerEditAvatar'
                    ).value.trim(),

                role:
                    document.getElementById(
                        'playerEditRole'
                    ).value.trim()
                    || 'Игрок',

                faceit:
                    document.getElementById(
                        'playerEditFaceit'
                    ).value.trim(),

                steam:
                    document.getElementById(
                        'playerEditSteam'
                    ).value.trim()

            });

        }


        savePlayers();

        closePlayerEditor();

        openTeam(teamName);

    });


/* ОТКРЫТИЕ СТРАНИЦ ПО ССЫЛКЕ */

window.addEventListener('hashchange', function() {

    const hash =
        decodeURIComponent(
            location.hash.slice(1)
        );


    if (hash.startsWith('team/')) {

        openTeam(
            hash.slice(5)
        );

        return;

    }


    if (hash.startsWith('player/')) {

        const data =
            hash.slice(7).split('/');


        if (data.length >= 2) {

            openPlayer(
                data[0],
                data[1]
            );

        }

        return;

    }


    if (
        !hash ||
        hash === 'teams'
    ) {

        showMain();

    }

});


renderAll();