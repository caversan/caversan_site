"use strict";

// Motor independente da interface para permitir testes das regras.
class MinesGame {
    constructor(rows, columns, mines, random = Math.random) {
        if (!Number.isInteger(rows) || !Number.isInteger(columns) || !Number.isInteger(mines) || rows < 1 || columns < 1 || mines < 1 || mines >= rows * columns) throw new Error("Tabuleiro inválido");
        Object.assign(this, { rows, columns, mines, random, state: "ready", opened: 0, flags: 0, exploded: -1 });
        this.cells = Array.from({ length: rows * columns }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }));
        this.plant();
    }
    neighbors(index) {
        const result = [], row = Math.floor(index / this.columns), column = index % this.columns;
        for (let y = Math.max(0, row - 1); y <= Math.min(this.rows - 1, row + 1); y++) {
            for (let x = Math.max(0, column - 1); x <= Math.min(this.columns - 1, column + 1); x++) {
                const next = y * this.columns + x;
                if (next !== index) result.push(next);
            }
        }
        return result;
    }
    plant() {
        const available = this.cells.map((_, i) => i);
        for (let i = 0; i < this.mines; i++) {
            const chosen = i + Math.floor(this.random() * (available.length - i));
            [available[i], available[chosen]] = [available[chosen], available[i]];
            this.cells[available[i]].mine = true;
        }
        this.cells.forEach((cell, i) => { cell.count = this.neighbors(i).filter(n => this.cells[n].mine).length; });
    }
    toggleFlag(index) {
        const cell = this.cells[index];
        if (!cell || cell.revealed || !["ready", "playing"].includes(this.state)) return;
        if (!cell.flagged && this.flags >= this.mines) return;
        cell.flagged = !cell.flagged;
        this.flags += cell.flagged ? 1 : -1;
    }
    reveal(index) {
        const cell = this.cells[index];
        if (!cell || cell.flagged || cell.revealed || !["ready", "playing"].includes(this.state)) return;
        if (this.state === "ready") this.state = "playing";
        if (cell.mine) { cell.revealed = true; this.exploded = index; this.state = "lost"; return; }
        const pending = [index];
        while (pending.length) {
            const current = pending.pop(), next = this.cells[current];
            if (next.revealed || next.flagged || next.mine) continue;
            next.revealed = true;
            this.opened++;
            if (next.count === 0) pending.push(...this.neighbors(current));
        }
        if (this.opened === this.cells.length - this.mines) this.state = "won";
    }
}

// Pick the orientation with the largest cells while keeping the entire field visible.
function boardLayout(rows, columns, width, height) {
    const gap = 2;
    const size = (r, c) => Math.floor(Math.min((width - (c - 1) * gap) / c, (height - (r - 1) * gap) / r, 44));
    const normal = size(rows, columns), turned = size(columns, rows);
    const rotated = turned > normal;
    return { rotated, rows: rotated ? columns : rows, columns: rotated ? rows : columns, size: Math.max(1, rotated ? turned : normal), gap };
}

if (typeof module !== "undefined" && module.exports) module.exports = { MinesGame, boardLayout };
if (typeof document !== "undefined") {
    const levels = { easy: [9, 9, 10], medium: [16, 16, 40], hard: [16, 30, 99] };
    const labels = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
    const $ = id => document.getElementById(id);
    const board = $("board"), stage = $("board-stage");
    // Keep scores from the former safe-first-click rules separate.
    const storageKey = "caversan.mines.ranking.v2";
    let game, buttons = [], level = "easy", playerName = "Visitante", scene = "setup";
    let elapsed = 0, startedAt = null, paused = false, flagMode = false, focusIndex = 0, layout, resizeFrame = 0;
    let scores = [], storageAvailable = true, fullscreenMessage = "";
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (Array.isArray(stored)) scores = stored.filter(s => s && Object.hasOwn(levels, s.level) && typeof s.name === "string" && Number.isFinite(s.seconds) && s.seconds >= 0);
    } catch { storageAvailable = false; }
    const seconds = () => Math.floor((elapsed + (startedAt === null ? 0 : performance.now() - startedAt)) / 1000);
    const format = value => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
    function stopClock() { if (startedAt !== null) { elapsed += performance.now() - startedAt; startedAt = null; } }
    function showScene(next) {
        scene = next;
        $("setup-scene").hidden = next !== "setup";
        $("play-scene").hidden = next === "setup";
        const result = $("result-scene");
        result.hidden = next !== "result";
        if (next === "result" && !result.open) result.showModal();
        else if (next !== "result" && result.open) result.close();
        $("show-result").classList.toggle("result-return", next === "play" && ["won", "lost"].includes(game?.state));
        window.scrollTo(0, 0);
        if (next === "play") { fitBoard(); buttons[focusIndex]?.focus({ preventScroll: true }); }
        else if (next === "result") { fitBoard(); $("result-title").focus({ preventScroll: true }); }
        else $("player").focus({ preventScroll: true });
    }
    function fitBoard() {
        if (!game || scene === "setup") return;
        const width = Math.max(1, stage.clientWidth - 8), height = Math.max(1, stage.clientHeight - 8);
        layout = boardLayout(game.rows, game.columns, width, height);
        board.style.setProperty("--display-columns", layout.columns);
        board.style.setProperty("--display-rows", layout.rows);
        board.style.setProperty("--cell-size", `${layout.size}px`);
        board.style.setProperty("--cell-gap", `${layout.gap}px`);
        buttons.forEach((button, i) => {
            const row = Math.floor(i / game.columns), col = i % game.columns;
            // Rotate cell positions clockwise; glyphs remain upright and readable.
            button.style.gridRow = String((layout.rotated ? col : row) + 1);
            button.style.gridColumn = String((layout.rotated ? game.rows - 1 - row : col) + 1);
        });
    }
    function scheduleFit() {
        if (!resizeFrame) resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; fitBoard(); });
    }
    new ResizeObserver(scheduleFit).observe(stage);
    window.addEventListener("resize", scheduleFit, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleFit);

    function ranking() {
        $("ranking").replaceChildren();
        $("ranking-level").textContent = labels[level];
        const best = scores.filter(s => s.level === level).sort((a, b) => {
            const aWon = a.outcome !== "lost", bWon = b.outcome !== "lost";
            if (aWon !== bWon) return aWon ? -1 : 1;
            if (!aWon && (a.opened || 0) !== (b.opened || 0)) return (b.opened || 0) - (a.opened || 0);
            return a.seconds - b.seconds;
        });
        for (const score of best) {
            const li = document.createElement("li"), lost = score.outcome === "lost";
            li.className = lost ? "ranking-loss" : "ranking-win";
            li.textContent = `${score.name} — ${lost ? "Derrota" : "Vitória"} · ${format(score.seconds)}${lost ? ` · ${score.opened || 0} casas` : ""}`;
            $("ranking").append(li);
        }
        $("ranking").hidden = !best.length;
        $("ranking-empty").hidden = Boolean(best.length);
        $("ranking-empty").textContent = "Ainda não há partidas nesta dificuldade.";
        $("storage-note").textContent = storageAvailable ? "" : "Não foi possível salvar o ranking neste navegador.";
    }
    function render() {
        const ended = ["won", "lost"].includes(game.state);
        buttons.forEach((button, i) => {
            const cell = game.cells[i], visible = !paused && (cell.revealed || (ended && cell.mine));
            button.className = "cell"; button.textContent = ""; button.removeAttribute("data-count");
            let description = "fechada";
            if (paused) description = "jogo pausado";
            else if (visible) {
                button.classList.add("revealed");
                if (cell.mine) { button.textContent = "✹"; button.classList.add("mine"); description = "mina"; }
                else { button.textContent = cell.count || ""; button.dataset.count = cell.count; description = `${cell.count} minas próximas`; }
            } else if (cell.flagged) { button.textContent = "⚑"; button.classList.add("flagged"); description = "bandeira"; }
            if (!paused && i === game.exploded) button.classList.add("exploded");
            if (!paused && ended && cell.flagged && !cell.mine) button.classList.add("wrong");
            button.tabIndex = i === focusIndex ? 0 : -1;
            button.setAttribute("aria-label", `Linha ${Math.floor(i / game.columns) + 1}, coluna ${i % game.columns + 1}: ${description}`);
        });
        $("remaining").textContent = game.mines - game.flags;
        $("safe").textContent = `${game.opened}/${game.cells.length - game.mines}`;
        $("timer").textContent = format(seconds());
        $("pause").disabled = game.state !== "playing";
        const pauseLabel = paused ? "Continuar" : "Pausar";
        $("pause").setAttribute("aria-label", pauseLabel); $("pause").title = pauseLabel;
        $("pause-symbol").setAttribute("href", paused ? "#i-play" : "#i-pause");
        $("flag-mode").setAttribute("aria-pressed", String(flagMode));
        $("flag-mode").disabled = ended;
        $("pause-overlay").hidden = !paused;
        $("show-result").hidden = !ended;
        $("status").textContent = fullscreenMessage || (paused ? "Partida pausada." : ended ? "Partida encerrada. Veja o resultado no ícone do troféu." : flagMode ? "Modo bandeira: toque para marcar ou desmarcar." : "Abra uma casa. Use a bandeira para marcar uma suspeita.");
    }
    function finish() {
        stopClock();
        scores.push({ name: playerName, level, seconds: seconds(), outcome: game.state, opened: game.opened });
        try { localStorage.setItem(storageKey, JSON.stringify(scores)); } catch { storageAvailable = false; }
        $("result-title").textContent = game.state === "won" ? "Você venceu!" : "Você encontrou uma mina.";
        $("result-summary").textContent = `${playerName} · ${labels[level]} · ${format(seconds())} · ${game.opened} casas seguras abertas.`;
        ranking(); showScene("result");
    }
    function act(index, flag = false) {
        if (scene !== "play" || paused || ["won", "lost"].includes(game.state)) return;
        const before = game.state;
        if (flag) game.toggleFlag(index); else game.reveal(index);
        if (before === "ready" && game.state !== "ready") startedAt = performance.now();
        render();
        if (["won", "lost"].includes(game.state)) finish();
    }
    function newGame() {
        level = $("difficulty").value;
        playerName = $("player").value.trim().slice(0, 24) || "Visitante";
        game = new MinesGame(...levels[level]); elapsed = 0; startedAt = null; paused = false; flagMode = false; focusIndex = 0; fullscreenMessage = "";
        buttons = game.cells.map((_, i) => { const button = document.createElement("button"); button.type = "button"; button.dataset.index = i; return button; });
        board.replaceChildren(...buttons); render(); showScene("play");
    }
    function setup() { stopClock(); paused = false; fullscreenMessage = ""; showScene("setup"); }
    board.addEventListener("click", event => { const button = event.target.closest("button[data-index]"); if (button) act(Number(button.dataset.index), flagMode); });
    board.addEventListener("contextmenu", event => { const button = event.target.closest("button[data-index]"); if (button) { event.preventDefault(); act(Number(button.dataset.index), true); } });
    board.addEventListener("focusin", event => {
        if (!event.target.matches("button[data-index]")) return;
        buttons[focusIndex].tabIndex = -1; focusIndex = Number(event.target.dataset.index); buttons[focusIndex].tabIndex = 0;
    });
    board.addEventListener("keydown", event => {
        if (!event.target.matches("button[data-index]")) return;
        const index = Number(event.target.dataset.index), row = Math.floor(index / game.columns), col = index % game.columns;
        const normal = { ArrowLeft: col > 0 ? index - 1 : index, ArrowRight: col < game.columns - 1 ? index + 1 : index, ArrowUp: row > 0 ? index - game.columns : index, ArrowDown: row < game.rows - 1 ? index + game.columns : index };
        const rotated = { ArrowLeft: normal.ArrowDown, ArrowRight: normal.ArrowUp, ArrowUp: normal.ArrowLeft, ArrowDown: normal.ArrowRight };
        const moves = layout?.rotated ? rotated : normal;
        if (Object.hasOwn(moves, event.key)) { event.preventDefault(); buttons[moves[event.key]].focus({ preventScroll: true }); }
        else if (event.key.toLowerCase() === "f") { event.preventDefault(); act(index, true); }
    });
    $("setup-form").addEventListener("submit", event => { event.preventDefault(); newGame(); });
    for (const id of ["restart", "play-again"]) $(id).addEventListener("click", newGame);
    for (const id of ["settings", "result-settings"]) $(id).addEventListener("click", setup);
    $("review-board").addEventListener("click", () => showScene("play"));
    $("show-result").addEventListener("click", () => showScene("result"));
    $("result-scene").addEventListener("cancel", event => { event.preventDefault(); showScene("play"); });
    $("result-scene").addEventListener("close", () => { if (scene === "result") showScene("play"); });
    $("flag-mode").addEventListener("click", () => { flagMode = !flagMode; fullscreenMessage = ""; render(); });
    $("pause").addEventListener("click", () => {
        if (game.state !== "playing") return;
        paused = !paused; if (paused) stopClock(); else startedAt = performance.now();
        fullscreenMessage = ""; render();
    });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && scene === "play" && game.state === "playing" && !paused) { paused = true; stopClock(); render(); }
    });
    const fullscreen = $("fullscreen");
    fullscreen.hidden = !document.fullscreenEnabled || typeof document.documentElement.requestFullscreen !== "function";
    fullscreen.addEventListener("click", async () => {
        fullscreenMessage = "";
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else {
                await document.documentElement.requestFullscreen();
                if (typeof screen.orientation?.lock === "function") {
                    try { await screen.orientation.lock("landscape"); } catch { /* The board itself adapts to orientation. */ }
                }
            }
        } catch { fullscreenMessage = "Tela cheia indisponível. O campo se ajusta à sua tela."; }
        render(); scheduleFit();
    });
    document.addEventListener("fullscreenchange", () => {
        const label = document.fullscreenElement ? "Sair da tela cheia" : "Jogar em tela cheia";
        fullscreen.title = label; fullscreen.setAttribute("aria-label", label);
        if (!document.fullscreenElement && typeof screen.orientation?.unlock === "function") screen.orientation.unlock();
        scheduleFit();
    });
    const exitModal = $("exit-modal");
    let resumeAfterExitDialog = false;
    for (const id of ["exit-setup", "exit-play"]) $(id).addEventListener("click", event => {
        event.preventDefault();
        resumeAfterExitDialog = scene === "play" && game?.state === "playing" && !paused;
        if (resumeAfterExitDialog) { paused = true; stopClock(); render(); }
        exitModal.hidden = false;
        exitModal.showModal();
    });
    $("exit-cancel").addEventListener("click", () => exitModal.close());
    exitModal.addEventListener("close", () => {
        exitModal.hidden = true;
        if (resumeAfterExitDialog) { paused = false; startedAt = performance.now(); render(); }
        resumeAfterExitDialog = false;
    });
    $("exit-confirm").addEventListener("click", () => {
        resumeAfterExitDialog = false;
        stopClock();
        window.location.assign("../../");
    });
    setInterval(() => { if (game) $("timer").textContent = format(seconds()); }, 250);
}
