var canvas = document.getElementById("workspace"),
    ctx = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;
ctx.beginPath();
ctx.arc(15, 17, 10, 0, Math.PI*2, true);
ctx.closePath();
ctx.fill();
var buff = 100;
var rows = 30,
    cols = 30;
var mazeGrid = [];
var marked = false;
for(var row = 0; row < rows; row++){
    var mazeRow = [];
    var odd = (row % 2 === 1);
    var even = !odd;
    for(var col = 0; col < cols; col++){
        mazeRow.push({
            visited: false,
            tl: (row === 0 || (even && col === 0)) ? "bounds" : "wall",
            tr: (row === 0 || (odd && col === cols-1)) ? "bounds" : "wall",
            l: (col === 0) ? "bounds" : "wall",
            r: (col === cols-1) ? "bounds" : "wall",
            bl: (row === rows-1 || (even && col === 0)) ? "bounds" : "wall",
            br: (row === rows-1 || (odd && col === cols-1)) ? "bounds" : "wall",
            x: col,
            y: row
        });
    }
    mazeGrid.push(mazeRow)
}
var currentCell = {};
var cellsToVisit = [];

var visitCell = function(cell){
    currentCell = cell;
    currentCell.visited = true;
    if(cellsToVisit.length === 170+buff && marked === false){
        odd = (cell.y % 2 === 1) * 15;
        ctx.beginPath();
        ctx.arc(cell.x*30 + 15 + odd, cell.y*26 + 17, 10, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        marked = true;
    }
};

var grabCell = function(cell, wall){
    offset = cell.y % 2;
    switch (wall) {
        case  "tl":
            return mazeGrid[cell.y-1][cell.x-1 + offset];
            break;
        case  "tr":
            return mazeGrid[cell.y-1][cell.x + offset];
            break;
        case  "l":
            return mazeGrid[cell.y][cell.x-1];
            break;
        case  "r":
            return mazeGrid[cell.y][cell.x+1];
            break;
        case  "bl":
            return mazeGrid[cell.y+1][cell.x-1 + offset];
            break;
        case  "br":
            return mazeGrid[cell.y+1][cell.x + offset];
            break;

    }
};

var pickFrom = function(cell){
    var options = [];
    var picked;
    if(cell.tl === "wall" && grabCell(cell, "tl").visited === false){
        options.push("tl");
    }
    if(cell.tr === "wall" && grabCell(cell, "tr").visited === false){
        options.push("tr");
    }
    if(cell.l === "wall" && grabCell(cell, "l").visited === false){
        options.push("l");
    }
    if(cell.r === "wall" && grabCell(cell, "r").visited === false){
        options.push("r");
    }
    if(cell.bl === "wall" && grabCell(cell, "bl").visited === false){
        options.push("bl");
    }
    if(cell.br === "wall" && grabCell(cell, "br").visited === false){
        options.push("br");
    }
    if(options.length !== 0) {
        picked = options[Math.floor(Math.random() * options.length)];
        someFound = true;
        return grabCell(cell, picked);
    } else {
        someFound = false;
        return null;
    }
};
var openUp = function(cell1, cell2){
    var dy = cell1.y - cell2.y;
    var dx = cell1.x - cell2.x;
    if(dy === 0) {
        if (dx >= 0) {
            cell1.l = "open";
            cell2.r = "open";
        } else {
            cell1.r = "open";
            cell2.l = "open";
        }
        ;
    }
    if(cell1.y % 2 === 1) {
        if (dy > 0) {
            if (dx >= 0) {
                cell1.tl = "open";
                cell2.br = "open";
            } else {
                cell1.tr = "open";
                cell2.bl = "open";
            }
            ;
        } else if (dy < 0) {
            if (dx >= 0) {
                cell1.bl = "open";
                cell2.tr = "open";
            } else {
                cell1.br = "open";
                cell2.tl = "open";
            }
            ;
        }
    } else {
        if (dy > 0) {
            if (dx > 0) {
                cell1.tl = "open";
                cell2.br = "open";
            } else {
                cell1.tr = "open";
                cell2.bl = "open";
            }
            ;
        } else if (dy < 0) {
            if (dx > 0) {
                cell1.bl = "open";
                cell2.tr = "open";
            } else {
                cell1.br = "open";
                cell2.tl = "open";
            }
            ;
        }
    }
};

cellsToVisit.push(mazeGrid[0][0]);
visitCell(cellsToVisit.pop());
var someFound = true;
while(cellsToVisit.length !== 0  || someFound){
    var newCell = pickFrom(currentCell);
    var oldCell;
    if(newCell !== null){
        openUp(currentCell, newCell);

        cellsToVisit.push(currentCell);
        visitCell(newCell);
    } else {
        oldCell = cellsToVisit.pop();
        if(oldCell === undefined){
            break;
        } else {
            visitCell(oldCell);
        }
    }
}

for(row = 0; row < rows; row++){
    odd = (row % 2 === 1) * 15;
    ctx.beginPath();
    for(col = 0; col < cols; col++){
        cell = mazeGrid[row][col];

        if(cell.bl === "wall"){
            ctx.moveTo(col*30 + odd, row*26+26);
            ctx.lineTo(col*30+15 + odd, row*26+34);
        }
        if(cell.br === "wall"){
            ctx.moveTo(col*30+15 + odd, row*26+34);
            ctx.lineTo(col*30+30 + odd, row*26+26);
        }
        if(cell.r === "wall"){
            ctx.moveTo(col*30+30 + odd, row*26+26);
            ctx.lineTo(col*30+30 + odd, row*26+8);
        }

    }
    ctx.strokeStyle="black";
    ctx.stroke();
    ctx.closePath();
}

for(row = 0; row < rows; row++){
    var bcell;
    odd = (row % 2 === 1) * 15;
    for(col = 0; col < cols; col++){
        bcell = mazeGrid[row][col];
        ctx.beginPath();
            if(bcell.tl === "bounds"){
                ctx.moveTo(col*30 + odd, row*26+8);
                ctx.lineTo(col*30+15 + odd, row*26);

            }
            if(bcell.tr === "bounds"){
                ctx.moveTo(col*30+15 + odd, row*26);
                ctx.lineTo(col*30+30 + odd, row*26+8);
            }
            if(bcell.l === "bounds"){
                ctx.moveTo(col*30 + odd, row*26+26);
                ctx.lineTo(col*30 + odd, row*26+8);
            }
            if(bcell.bl === "bounds"){
                ctx.moveTo(col*30 + odd, row*26+26);
                ctx.lineTo(col*30+15 + odd, row*26+34);
            }
            if(bcell.br === "bounds"){
                ctx.moveTo(col*30+15 + odd, row*26+34);
                ctx.lineTo(col*30+30 + odd, row*26+26);
            }
            if(bcell.r === "bounds"){
                ctx.moveTo(col*30+30 + odd, row*26+26);
                ctx.lineTo(col*30+30 + odd, row*26+8);

            }
        ctx.strokeStyle="green";
        ctx.closePath();

        ctx.stroke();
        }

}
