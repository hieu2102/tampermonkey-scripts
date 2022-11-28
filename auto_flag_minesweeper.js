// ==UserScript==
// @name         auto_flag_minesweeper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://minesweeper.online/game/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
            await new Promise(r => setTimeout(r, 5000));
    console.log("hello");
    const CLOSED_CELL = "hd_closed";
    const FLAGGED_CELL = "hd_flag";
    var cells = Array.from(document.getElementsByClassName("cell"));
    function getSurroundingClosedCells(cell) {
        var attributes = cell.attributes;
        var xRange;
        var yRange;
        var xAxis = Number(attributes.getNamedItem("data-x").value)
        var yAxis = Number(attributes.getNamedItem("data-y").value)
        var bombCount = Number(cell.classList[cell.classList.length - 1].replace("hd_type", ""))
        var closedCells = [];
        switch (xAxis) {
            case 0:
                xRange = [0, 1]
                break;
            case maxX:
                xRange = [-1, 0]
                break;
            default:
                xRange = [-1, 0, 1]
                break;
        }
        switch (yAxis) {
            case 0:
                yRange = [0, 1]
                break;
            case maxY:
                yRange = [-1, 0]
                break;
            default:
                yRange = [-1, 0, 1]
                break;
        }
        for (let i = 0; i < xRange.length; i++) {
            for (let j = 0; j < yRange.length; j++) {

                let targetX = xAxis + xRange[i]
                let targetY = (yAxis + yRange[j])
                var neighborCell = cells.filter(x => x.attributes.getNamedItem("data-x").value == targetX && x.attributes.getNamedItem("data-y").value == targetY)[0]
                if (neighborCell.classList.contains(CLOSED_CELL) || neighborCell.classList.contains(FLAGGED_CELL)) {
                    closedCells.push(neighborCell)
                }
            }
        }
        uncheckedCells = closedCells.filter(x => x.classList.contains(CLOSED_CELL));
        var flaggedCells = closedCells.filter(x => x.classList.contains(FLAGGED_CELL));
        if (closedCells.length == bombCount) {
            closedCells.forEach(x => {
                x.classList.add(FLAGGED_CELL)
                x.style.pointerEvents = "none"
            })
        }
        if (flaggedCells.length == bombCount) {
            uncheckedCells.forEach(x => {
                x.click()
            })
        }

    }
    var maxX = cells.filter(cell => cell.attributes.getNamedItem("data-y").value == 0).map(cell => cell.attributes.getNamedItem("data-x").value).length - 1
    var maxY = cells.filter(cell => cell.attributes.getNamedItem("data-x").value == 0).map(cell => cell.attributes.getNamedItem("data-y").value).length - 1
    var totalCells = (maxX + 1) * (maxY + 1)
    var uncheckedCells = cells.filter(cell => cell.classList.contains(CLOSED_CELL));
    while (uncheckedCells.length > 0) {
        if (uncheckedCells.length == totalCells) {
            cells.forEach(x => {
                x.style.pointerEvents = "auto"
            })
        }
        var openedCells = cells.filter(cell => !cell.classList.contains("hd_type0") && !cell.classList.contains(CLOSED_CELL) && !cell.classList.contains(FLAGGED_CELL))
        openedCells.forEach(cell => {
            cell.style.pointerEvents = "none"
            getSurroundingClosedCells(cell)
        })
        uncheckedCells = cells.filter(cell => cell.classList.contains(CLOSED_CELL));
        await new Promise(r => setTimeout(r, 500));
    }
})();
