"use strict";

// Motor independente da interface para permitir testes das regras.
class MinesGame {
    constructor(rows, columns, mines, random = Math.random) {
        if (!Number.isInteger(rows) || !Number.isInteger(columns) || !Number.isInteger(mines) || rows < 1 || columns < 1 || mines < 1 || mines >= rows * columns) throw new Error("Tabuleiro inválido");
        Object.assign(this, { rows, columns, mines, random, state: "ready", opened: 0, flags: 0, exploded: -1 });
        this.cells = Array.from({ length: rows * columns }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }));
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
    plant(first) {
        let excluded = new Set([first, ...this.neighbors(first)]);
        if (this.cells.length - excluded.size < this.mines) excluded = new Set([first]);
        const available = this.cells.map((_, i) => i).filter(i => !excluded.has(i));
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
        if (this.state === "ready") { this.plant(index); this.state = "playing"; }
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

if (typeof module !== "undefined" && module.exports) module.exports = { MinesGame };
if (typeof document !== "undefined") {
    const levels = { easy: [9, 9, 10], medium: [16, 16, 40], hard: [16, 30, 99] };
    const labels = { easy: "Fácil", medium: "Médio", hard: "Difícil" };
    const $ = id => document.getElementById(id);
    const board = $("board"), storageKey = "caversan.mines.ranking.v1";
    let game, level, buttons, elapsed = 0, startedAt = null, paused = false, flagMode = false, focusIndex = 0;
    let scores = [], storageAvailable = true;
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        if (Array.isArray(stored)) scores = stored.filter(s => s && Object.hasOwn(levels, s.level) && typeof s.name === "string" && Number.isFinite(s.seconds) && s.seconds >= 0);
    } catch { storageAvailable = false; }
    function seconds() { return Math.floor((elapsed + (startedAt === null ? 0 : performance.now() - startedAt)) / 1000); }
    function format(value) { return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`; }
    function stopClock() { if (startedAt !== null) { elapsed += performance.now() - startedAt; startedAt = null; } }
    function ranking() {
        $("ranking").replaceChildren();
        const best = scores.filter(s => s.level === level).sort((a, b) => a.seconds - b.seconds).slice(0, 10);
        for (const score of best) { const li = document.createElement("li"); li.textContent = `${score.name} — ${format(score.seconds)}`; $("ranking").append(li); }
        if (!best.length) { const li = document.createElement("li"); li.textContent = `Nenhuma vitória no nível ${labels[level]}.`; $("ranking").append(li); }
        $("storage-note").textContent = storageAvailable ? "Abra todas as casas seguras para registrar seu tempo." : "Armazenamento indisponível. O ranking será mantido apenas nesta sessão.";
    }
    function render() {
        const ended = ["won", "lost"].includes(game.state);
        buttons.forEach((button, i) => {
            const cell = game.cells[i], visible = !paused && (cell.revealed || (ended && cell.mine));
            button.className = "cell";
            button.textContent = "";
            button.removeAttribute("data-count");
            let description = "fechada";
            if (paused) description = "jogo pausado";
            else if (visible) {
                button.classList.add("revealed");
                if (cell.mine) { button.textContent = game.state === "won" ? "⚑" : "✹"; button.classList.add("mine"); description = "mina"; }
                else { button.textContent = cell.count || ""; button.dataset.count = cell.count; description = `${cell.count} minas vizinhas`; }
            } else if (cell.flagged) {
                button.textContent = ended ? "×" : "⚑";
                button.classList.add(ended ? "wrong" : "flagged"); description = ended ? "bandeira incorreta" : "bandeira";
            }
            if (!paused && i === game.exploded) button.classList.add("exploded");
            button.setAttribute("aria-label", `Linha ${Math.floor(i / game.columns) + 1}, coluna ${i % game.columns + 1}: ${description}`);
            button.setAttribute("aria-disabled", String(paused || ended || cell.revealed));
            button.tabIndex = i === focusIndex ? 0 : -1;
        });
        $("remaining").textContent = game.mines - game.flags;
        $("safe").textContent = `${game.opened} / ${game.cells.length - game.mines}`;
        $("timer").textContent = format(seconds());
        $("pause").disabled = game.state !== "playing";
        $("pause").textContent = paused ? "Continuar" : "Pausar";
        $("flag-mode").setAttribute("aria-pressed", String(flagMode));
        $("status").textContent = paused ? "Jogo pausado. Clique em Continuar para retomar." : game.state === "won" ? `Você venceu em ${format(seconds())}! Seu tempo entrou no ranking.` : game.state === "lost" ? "Você encontrou uma mina. Clique em Novo jogo para tentar novamente." : game.state === "ready" ? "Abra uma casa para começar. O primeiro clique é seguro." : "Observe os números e abra todas as casas seguras.";
    }
    function act(index, flag = false) {
        if (paused || ["won", "lost"].includes(game.state)) return;
        const before = game.state;
        if (flag) game.toggleFlag(index); else game.reveal(index);
        if (before === "ready" && game.state !== "ready") { startedAt = performance.now(); $("player").disabled = true; }
        if (["won", "lost"].includes(game.state)) {
            stopClock();
            if (game.state === "won") {
                scores.push({ name: $("player").value.trim().slice(0, 24) || "Visitante", level, seconds: seconds() });
                scores = Object.keys(levels).flatMap(key => scores.filter(s => s.level === key).sort((a, b) => a.seconds - b.seconds).slice(0, 10));
                try { localStorage.setItem(storageKey, JSON.stringify(scores)); } catch { storageAvailable = false; }
                ranking();
            }
        }
        render();
    }
    function newGame() {
        level = $("difficulty").value;
        game = new MinesGame(...levels[level]); elapsed = 0; startedAt = null; paused = false; flagMode = false; focusIndex = 0;
        $("player").disabled = false;
        board.style.setProperty("--columns", game.columns);
        document.querySelector("main").style.setProperty("--columns", game.columns);
        buttons = game.cells.map((_, i) => { const button = document.createElement("button"); button.type = "button"; button.dataset.index = i; return button; });
        board.replaceChildren(...buttons); render(); ranking();
    }
    const fullscreen = $("fullscreen");
    fullscreen.hidden = !document.fullscreenEnabled || typeof document.documentElement.requestFullscreen !== "function";
    fullscreen.addEventListener("click", async () => {
        $("fullscreen-status").textContent = "";
        try {
            if (document.fullscreenElement) { await document.exitFullscreen(); return; }
            await document.documentElement.requestFullscreen();
            if (typeof screen.orientation?.lock === "function") {
                try { await screen.orientation.lock("landscape"); }
                catch { $("fullscreen-status").textContent = "Tela cheia ativada. Se necessário, vire o celular manualmente."; }
            }
        } catch {
            $("fullscreen-status").textContent = "Este navegador não permitiu a tela cheia. Você pode continuar jogando normalmente.";
        }
    });
    document.addEventListener("fullscreenchange", () => {
        fullscreen.textContent = document.fullscreenElement ? "Sair da tela cheia" : "Jogar em tela cheia";
        if (!document.fullscreenElement) {
            $("fullscreen-status").textContent = "";
            if (typeof screen.orientation?.unlock === "function") screen.orientation.unlock();
        }
    });
    board.addEventListener("click", event => { const button = event.target.closest("button[data-index]"); if (button) act(Number(button.dataset.index), flagMode); });
    board.addEventListener("contextmenu", event => { const button = event.target.closest("button[data-index]"); if (button) { event.preventDefault(); act(Number(button.dataset.index), true); } });
    board.addEventListener("focusin", event => { if (!event.target.matches("button[data-index]")) return; buttons[focusIndex].tabIndex = -1; focusIndex = Number(event.target.dataset.index); buttons[focusIndex].tabIndex = 0; });
    board.addEventListener("keydown", event => {
        if (!event.target.matches("button[data-index]")) return;
        const index = Number(event.target.dataset.index), column = index % game.columns;
        const moves = { ArrowLeft: column > 0 ? index - 1 : index, ArrowRight: column < game.columns - 1 ? index + 1 : index, ArrowUp: Math.max(0, index - game.columns), ArrowDown: Math.min(buttons.length - 1, index + game.columns) };
        if (Object.hasOwn(moves, event.key)) { event.preventDefault(); buttons[moves[event.key]].focus(); }
        else if (event.key.toLowerCase() === "f") { event.preventDefault(); act(index, true); }
    });
    $("new-game").addEventListener("click", newGame);
    $("difficulty").addEventListener("change", newGame);
    $("flag-mode").addEventListener("click", () => { flagMode = !flagMode; render(); });
    $("pause").addEventListener("click", () => { if (game.state !== "playing") return; paused = !paused; if (paused) stopClock(); else startedAt = performance.now(); render(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden && game.state === "playing" && !paused) { paused = true; stopClock(); render(); } });
    setInterval(() => { $("timer").textContent = format(seconds()); }, 250);
    newGame();
}
