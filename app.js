```css
/* =========================================================
   PLAYER PAGE — EFL STYLE
========================================================= */

.player-page-profile {
    padding: 40px 0 100px;
}

.player-page-main {
    display: flex;
    align-items: center;
    gap: 32px;

    padding: 32px;

    border: 1px solid #242730;
    border-radius: 16px;

    background:
        radial-gradient(
            circle at 80% 20%,
            rgba(139, 92, 246, .08),
            transparent 40%
        ),
        #0b0d11;

    box-shadow: 0 30px 100px rgba(0, 0, 0, .25);
}

.player-page-avatar {
    width: 150px;
    height: 150px;

    flex-shrink: 0;

    display: grid;
    place-items: center;

    overflow: hidden;

    border-radius: 18px;
    border: 1px solid #30343e;

    background: #15171d;

    font-size: 55px;
    font-weight: 900;
}

.player-page-avatar img {
    width: 100%;
    height: 100%;

    object-fit: cover;
}

.player-page-info {
    min-width: 0;
}

.player-page-info h1 {
    margin: 8px 0 5px;

    font-size: clamp(42px, 6vw, 72px);
    line-height: .95;

    letter-spacing: -3px;
    font-weight: 900;
}

.player-page-role {
    color: #8b5cf6;

    font-size: 14px;
    font-weight: 700;

    margin-top: 10px;
}

.player-page-meta {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-top: 12px;

    color: #707580;
    font-size: 11px;
}

.player-page-links {
    display: flex;
    gap: 8px;

    margin-top: 20px;

    flex-wrap: wrap;
}

.player-social {
    display: inline-flex;
    align-items: center;
    gap: 12px;

    padding: 9px 13px;

    border-radius: 7px;
    border: 1px solid #292d36;

    background: #0e1015;

    color: #d5d7dc;

    text-decoration: none;

    font-size: 10px;
    font-weight: 800;

    transition: .2s;
}

.player-social:hover {
    color: white;
    border-color: #8b5cf6;
    background: #15121f;
    transform: translateY(-2px);
}

.player-social b {
    color: #747985;
}


/* STATS */

.player-page-stats {
    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 8px;

    margin-top: 12px;
}

.player-stat {
    padding: 18px;

    border-radius: 10px;
    border: 1px solid #1e2128;

    background: #0b0d11;
}

.player-stat span {
    display: block;

    color: #626873;

    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.player-stat strong {
    display: block;

    margin-top: 8px;

    color: #f5f5f7;

    font-size: 15px;
}


/* TWO PANELS */

.player-page-grid {
    display: grid;

    grid-template-columns: 1.2fr .8fr;

    gap: 12px;

    margin-top: 12px;
}

.player-page-panel {
    padding: 24px;

    border-radius: 11px;
    border: 1px solid #1e2128;

    background: #0b0d11;
}

.player-page-panel h2 {
    margin: 8px 0 12px;

    font-size: 20px;

    letter-spacing: -.5px;
}

.player-page-panel p {
    margin: 0;

    color: #717681;

    line-height: 1.7;
    font-size: 12px;
}


/* TEAM MINI */

.player-team-mini {
    display: flex;
    align-items: center;
    gap: 12px;

    margin-top: 20px;

    padding: 12px;

    border-radius: 9px;

    background: #080a0e;
    border: 1px solid #1c1f25;
}

.player-team-logo {
    width: 44px;
    height: 44px;

    display: grid;
    place-items: center;

    overflow: hidden;

    border-radius: 9px;

    background: #15171d;
    border: 1px solid #292d36;

    font-weight: 900;
}

.player-team-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.player-team-mini strong {
    display: block;

    font-size: 12px;
}

.player-team-mini small {
    display: block;

    margin-top: 4px;

    color: #626873;

    font-size: 9px;
}


/* STATISTICS */

.player-page-history {
    margin-top: 12px;
}

.player-stat-grid {
    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 8px;

    margin-top: 18px;
}

.player-stat-grid > div {
    padding: 18px;

    border-radius: 9px;

    background: #080a0e;
    border: 1px solid #1c1f25;
}

.player-stat-grid strong {
    display: block;

    font-size: 25px;
    font-weight: 900;
}

.player-stat-grid span {
    display: block;

    margin-top: 5px;

    color: #626873;

    font-size: 9px;
}


/* ACTIONS */

.player-page-actions {
    display: flex;

    gap: 8px;

    margin-top: 14px;

    flex-wrap: wrap;
}


/* MOBILE */

@media (max-width: 800px) {

    .player-page-main {
        flex-direction: column;
        align-items: flex-start;

        padding: 24px;
    }

    .player-page-avatar {
        width: 110px;
        height: 110px;

        font-size: 40px;
    }

    .player-page-info h1 {
        font-size: 45px;
    }

    .player-page-stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .player-page-grid {
        grid-template-columns: 1fr;
    }

    .player-stat-grid {
        grid-template-columns: repeat(2, 1fr);
    }

}


@media (max-width: 480px) {

    .player-page-profile {
        padding-top: 20px;
    }

    .player-page-main {
        padding: 20px;
    }

    .player-page-info h1 {
        font-size: 38px;
        letter-spacing: -2px;
    }

    .player-page-stats {
        grid-template-columns: 1fr 1fr;
    }

    .player-stat {
        padding: 14px;
    }

    .player-stat-grid {
        grid-template-columns: 1fr 1fr;
    }

}
```
