"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { MinesGame, boardLayout } = require("./mines.js");
function random(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
test("distribuição e vizinhança prontas antes do primeiro clique em todos os níveis", () => {
    for (const [rows, columns, mines] of [[9, 9, 10], [16, 16, 40], [16, 30, 99]]) {
        for (let seed = 1; seed <= 30; seed++) {
            const game = new MinesGame(rows, columns, mines, random(seed));
            assert.equal(game.state, "ready");
            assert.equal(game.cells.filter(c => c.mine).length, mines);
            game.cells.forEach((cell, index) => {
                const row = Math.floor(index / columns), col = index % columns;
                const expected = game.cells.filter((c, j) => c.mine && j !== index && Math.abs(Math.floor(j / columns) - row) <= 1 && Math.abs(j % columns - col) <= 1).length;
                assert.equal(cell.count, expected);
            });
        }
    }
});
test("bandeiras bloqueiam abertura e respeitam o total de minas", () => {
    const game = new MinesGame(9, 9, 10, random(1));
    for (let i = 0; i < 11; i++) game.toggleFlag(i);
    assert.equal(game.flags, 10);
    game.reveal(0); assert.equal(game.state, "ready");
    game.toggleFlag(0);
    const safe = game.cells.findIndex(c => !c.mine && !c.flagged); game.reveal(safe);
    assert.equal(game.cells[safe].revealed, true);
    assert.equal(game.cells[1].revealed, false);
    const flags = game.flags; game.toggleFlag(0); assert.equal(game.flags, flags);
});
test("abrir todas as casas seguras vence e bloqueia novas ações", () => {
    const game = new MinesGame(9, 9, 10, random(2));
    game.reveal(game.cells.findIndex(c => !c.mine));
    game.cells.forEach((cell, i) => { if (!cell.mine) game.reveal(i); });
    assert.equal(game.state, "won"); assert.equal(game.opened, 71);
    game.reveal(game.cells.findIndex(c => c.mine)); assert.equal(game.state, "won");
});
test("mina encerra partida e impede novas aberturas", () => {
    const game = new MinesGame(16, 16, 40, random(3)); game.reveal(game.cells.findIndex(c => !c.mine));
    const mine = game.cells.findIndex(c => c.mine); game.reveal(mine);
    assert.equal(game.state, "lost"); assert.equal(game.exploded, mine);
    const opened = game.opened; game.cells.forEach((_, i) => game.reveal(i)); assert.equal(game.opened, opened);
});
test("primeiro clique em mina explode, inclusive em tabuleiro denso", () => {
    const game = new MinesGame(2, 2, 3, random(1));
    const mine = game.cells.findIndex(c => c.mine); game.reveal(mine);
    assert.equal(game.state, "lost"); assert.equal(game.opened, 0); assert.equal(game.exploded, mine);
    assert.throws(() => new MinesGame(0, 2, 1)); assert.throws(() => new MinesGame(2, 2, 4));
});

test("todas as células cabem sem rolagem nas orientações móvel e desktop", () => {
    for (const [rows, columns] of [[9, 9], [16, 16], [16, 30]]) {
        for (const [width, height] of [[296, 500], [350, 650], [700, 220], [1000, 650], [280, 180]]) {
            const layout = boardLayout(rows, columns, width, height);
            assert(layout.columns * layout.size + (layout.columns - 1) * layout.gap <= width);
            assert(layout.rows * layout.size + (layout.rows - 1) * layout.gap <= height);
            const places = new Set();
            for (let r = 0; r < rows; r++) for (let c = 0; c < columns; c++) {
                const y = layout.rotated ? c : r, x = layout.rotated ? rows - 1 - r : c;
                assert(x >= 0 && x < layout.columns && y >= 0 && y < layout.rows);
                places.add(`${x},${y}`);
            }
            assert.equal(places.size, rows * columns);
        }
    }
    assert.equal(boardLayout(16, 30, 350, 650).rotated, true);
    assert.equal(boardLayout(16, 30, 1000, 500).rotated, false);
});
