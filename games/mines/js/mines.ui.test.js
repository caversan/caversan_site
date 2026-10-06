"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function interfaceHarness(savedScores = []) {
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const nodes = new Map(), events = {}, values = new Map();
    if (savedScores.length) values.set("caversan.mines.ranking.v2", JSON.stringify(savedScores));
    let now = 0;
    class Element {
        constructor() {
            this.handlers = {}; this.children = []; this.dataset = {}; this.attributes = {};
            this.style = { setProperty: (key, value) => { this.attributes[key] = value; } };
            this.classes = new Set();
            this.classList = { add: value => this.classes.add(value), toggle: (value, enabled) => enabled ? this.classes.add(value) : this.classes.delete(value) };
            this.hidden = false; this.value = "";
            this.clientWidth = 344; this.clientHeight = 620;
        }
        addEventListener(type, listener) { this.handlers[type] = listener; }
        setAttribute(key, value) { this.attributes[key] = value; }
        removeAttribute(key) { delete this.attributes[key]; }
        replaceChildren(...children) { this.children = children; }
        append(child) { this.children.push(child); }
        focus() { this.focused = true; }
        showModal() { this.open = true; }
        close() { this.open = false; this.handlers.close?.(); }
        matches() { return this.dataset.index !== undefined; }
        closest() { return this.matches() ? this : null; }
    }
    for (const match of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)) {
        const node = new Element(); node.hidden = /\bhidden\b/.test(match[0]); nodes.set(match[1], node);
    }
    const get = id => { assert(nodes.has(id), `Missing HTML element: ${id}`); return nodes.get(id); };
    get("difficulty").value = "easy"; get("player").value = "Tester";
    const document = { getElementById: get, createElement: () => new Element(), addEventListener: (key, fn) => events[key] = fn, documentElement: new Element(), fullscreenEnabled: false };
    const navigation = [];
    const window = { scrollTo() {}, addEventListener() {}, location: { assign: url => navigation.push(url) } };
    const math = Object.create(Math); math.random = () => 0;
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, "mines.js"), "utf8"), {
        document, window, Math: math, performance: { now: () => now },
        localStorage: { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) },
        ResizeObserver: class { observe() {} }, requestAnimationFrame() {}, setInterval() {}, screen: {},
    });
    const click = id => get(id).handlers.click({ preventDefault() {} });
    const submit = () => get("setup-form").handlers.submit({ preventDefault() {} });
    const cell = (index, key) => {
        const target = get("board").children[index];
        get("board").handlers[key ? "keydown" : "click"]({ target, key, preventDefault() {} });
    };
    return { get, click, submit, cell, values, navigation, advance: milliseconds => now += milliseconds };
}

test("configuration opens first; first-click mine switches to result; review and replay work", () => {
    const ui = interfaceHarness();
    assert(!ui.get("setup-scene").hidden); assert(ui.get("play-scene").hidden);
    assert.equal(ui.get("board").children.length, 0);
    ui.submit(); assert(ui.get("setup-scene").hidden); assert(!ui.get("play-scene").hidden);
    assert.equal(ui.get("board").children.length, 81);
    ui.cell(0); assert(!ui.get("result-scene").hidden); assert(!ui.get("play-scene").hidden);
    assert(ui.get("result-scene").open);
    assert(!ui.get("show-result").classes.has("result-return"));
    assert(ui.get("result-title").textContent.includes("mina"));
    const attempts = JSON.parse(ui.values.get("caversan.mines.ranking.v2"));
    assert.equal(attempts[0].outcome, "lost"); assert.equal(attempts[0].opened, 0);
    ui.click("review-board"); assert(!ui.get("play-scene").hidden); assert(!ui.get("show-result").hidden);
    assert(!ui.get("result-scene").open);
    assert(ui.get("show-result").classes.has("result-return"));
    assert(ui.get("flag-mode").disabled);
    ui.click("show-result"); ui.click("play-again"); assert(!ui.get("play-scene").hidden);
    assert(!ui.get("show-result").classes.has("result-return"));
    assert(!ui.get("flag-mode").disabled);
    ui.click("settings"); assert(!ui.get("setup-scene").hidden);
});

test("saved victories appear after a loss, with no redundant ranking footer", () => {
    const ui = interfaceHarness([{ name: "Winner", level: "easy", seconds: 42 }, { name: "Other level", level: "hard", seconds: 100 }]);
    ui.submit(); ui.cell(0);
    assert.equal(ui.get("ranking").children.length, 2);
    assert(ui.get("ranking").children[0].textContent.includes("Winner"));
    assert(!ui.get("ranking").hidden); assert(ui.get("ranking-empty").hidden);
    assert.equal(ui.get("storage-note").textContent, "");
    const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
    const modal = html.slice(html.indexOf('<dialog id="result-scene"'));
    assert(!modal.includes("CAVERSAN / GAMES / CAMPO MINADO"));
});

test("flags, pause and victory preserve clock and record a new-rule score", () => {
    const ui = interfaceHarness(); ui.submit();
    ui.click("flag-mode"); ui.cell(0); assert.equal(ui.get("remaining").textContent, 9);
    ui.click("flag-mode"); ui.cell(10); ui.advance(2000); ui.click("pause");
    assert(!ui.get("pause-overlay").hidden);
    ui.cell(0); assert(ui.get("result-scene").hidden);
    ui.advance(5000); ui.click("pause"); assert(ui.get("pause-overlay").hidden);
    for (let index = 10; index < 81; index++) ui.cell(index);
    assert(!ui.get("result-scene").hidden);
    const scores = JSON.parse(ui.values.get("caversan.mines.ranking.v2"));
    assert.equal(scores[0].name, "Tester"); assert.equal(scores[0].seconds, 2);
    assert.equal(scores.length, 1);
});

test("portrait hard field uses rotated positions and stays in the stage", () => {
    const ui = interfaceHarness(); ui.get("difficulty").value = "hard"; ui.submit();
    const board = ui.get("board"), size = parseInt(board.attributes["--cell-size"], 10);
    assert.equal(board.attributes["--display-columns"], 16);
    assert.equal(board.attributes["--display-rows"], 30);
    assert(16 * size + 15 * 2 <= 336); assert(30 * size + 29 * 2 <= 612);
    assert.equal(board.children[0].style.gridColumn, "16");
    assert.equal(board.children[0].style.gridRow, "1");
});

test("all attempts are retained, ranked by outcome and progress, without mixing levels", () => {
    const saved = Array.from({ length: 12 }, (_, i) => ({ name: `Attempt ${i}`, level: "easy", seconds: 40 + i, outcome: "lost", opened: i }));
    saved.push({ name: "Fast win", level: "easy", seconds: 10, outcome: "won", opened: 71 });
    saved.push({ name: "Other difficulty", level: "medium", seconds: 1, outcome: "won", opened: 216 });
    const ui = interfaceHarness(saved); ui.submit(); ui.cell(0);
    const rows = ui.get("ranking").children;
    assert.equal(rows.length, 14);
    assert(rows[0].textContent.includes("Fast win"));
    assert(rows[1].textContent.includes("Attempt 11"));
    assert(!rows.some(row => row.textContent.includes("Other difficulty")));
    assert.equal(JSON.parse(ui.values.get("caversan.mines.ranking.v2")).length, 15);
    ui.click("review-board"); ui.click("show-result");
    assert.equal(JSON.parse(ui.values.get("caversan.mines.ranking.v2")).length, 15);
});

test("Caversan navigation asks before exiting; cancellation resumes the paused game", () => {
    const ui = interfaceHarness();
    ui.click("exit-setup"); assert(ui.get("exit-modal").open); assert.equal(ui.navigation.length, 0);
    ui.click("exit-cancel"); assert(!ui.get("exit-modal").open);
    ui.submit(); ui.cell(10); ui.advance(2000);
    ui.click("exit-play"); assert(ui.get("exit-modal").open); assert(!ui.get("pause-overlay").hidden);
    ui.advance(5000); ui.click("exit-cancel"); assert(ui.get("pause-overlay").hidden);
    ui.advance(1000); ui.cell(0);
    const scores = JSON.parse(ui.values.get("caversan.mines.ranking.v2"));
    assert.equal(scores[0].seconds, 3);
    ui.click("review-board"); ui.click("exit-play");
    assert.equal(ui.navigation.length, 0);
    ui.click("exit-confirm"); assert.deepEqual(ui.navigation, ["../../"]);
});
