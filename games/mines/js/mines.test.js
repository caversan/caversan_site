"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { MinesGame } = require("./mines.js");
function random(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
test("distribuição, vizinhança e primeiro clique seguro em todos os níveis", () => {
    for (const [rows, columns, mines] of [[9, 9, 10], [16, 16, 40], [16, 30, 99]]) {
        for (let seed = 1; seed <= 30; seed++) {
            const game = new MinesGame(rows, columns, mines, random(seed));
            const first = seed * 13 % game.cells.length;
            game.reveal(first);
            assert.equal(game.cells.filter(c => c.mine).length, mines);
            assert.equal(game.cells[first].mine, false);
            assert.equal(game.cells[first].count, 0);
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
    game.toggleFlag(0); game.reveal(0);
    assert.equal(game.cells[0].revealed, true);
    assert.equal(game.cells[1].revealed, false);
    const flags = game.flags; game.toggleFlag(0); assert.equal(game.flags, flags);
});
test("abrir todas as casas seguras vence e bloqueia novas ações", () => {
    const game = new MinesGame(9, 9, 10, random(2));
    game.reveal(40);
    game.cells.forEach((cell, i) => { if (!cell.mine) game.reveal(i); });
    assert.equal(game.state, "won"); assert.equal(game.opened, 71);
    game.reveal(game.cells.findIndex(c => c.mine)); assert.equal(game.state, "won");
});
test("mina encerra partida e impede novas aberturas", () => {
    const game = new MinesGame(16, 16, 40, random(3)); game.reveal(0);
    const mine = game.cells.findIndex(c => c.mine); game.reveal(mine);
    assert.equal(game.state, "lost"); assert.equal(game.exploded, mine);
    const opened = game.opened; game.cells.forEach((_, i) => game.reveal(i)); assert.equal(game.opened, opened);
});
test("tabuleiro denso mantém primeiro clique seguro e valida dimensões", () => {
    const game = new MinesGame(2, 2, 3, random(1)); game.reveal(0); assert.equal(game.state, "won");
    assert.throws(() => new MinesGame(0, 2, 1)); assert.throws(() => new MinesGame(2, 2, 4));
});
