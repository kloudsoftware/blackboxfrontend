import p5 from "p5"
import {renderPlayground, revealBeam} from "blackboxjs_backend"

const ARR_LEN = 10;
const BOX_LEN = 100;
const CANVAS_LEN = 10 * BOX_LEN;

const COLORS = {
    0: 0xff,
    1: '#aa0033',
    2: '#bbaaff',
    3: '#00ff00'
}

function c2idx(c) {
    return Math.max(0, Math.floor(c/BOX_LEN));
}

function draw_box(p, x, y, color) {
    p.fill(color);
    p.rect(x,y,BOX_LEN,BOX_LEN);
    p.fill(COLORS[0]);
}

function iterate_over_playground(p, playground, cb) {
    for (let x = 0; x <= CANVAS_LEN - BOX_LEN; x+= BOX_LEN) {
        for (let y = 0; y <= CANVAS_LEN - BOX_LEN; y+= BOX_LEN) {
            cb(p, playground, x, y);
        }
    }
}

function init_playground(p, playground, playground_edges) {
    playground[0] = new Array(ARR_LEN).fill(2);
    playground[9] = new Array(ARR_LEN).fill(2);
    for (let i = 0; i < ARR_LEN; i++) {
        playground[i][0] = 2;
        playground[i][9] = 2;
    }
    for (let x = 0; x < ARR_LEN; x++) {
        for (let y = 0; y < ARR_LEN; y++) {
            if (playground[x][y] == 2) {
                playground_edges[x][y] = 1;
            }
        }
    }
    p.draw();
}

const sketch = function( p ) {
    const x = 100; 
    const y = 100;
    let i = 0;
    let playground; 
    let playground_edges;
    let atoms_left = 5;
    let atoms_counter;

    p.setup = function() {
        atoms_counter = document.querySelector('#pAtomsLeft');
        playground = new Array(ARR_LEN).fill(0).map(() => new Array(ARR_LEN).fill(0));
        playground_edges = new Array(ARR_LEN).fill(0).map(() => new Array(ARR_LEN).fill(0));
        p.createCanvas(CANVAS_LEN + 10, CANVAS_LEN + 10);
        init_playground(p, playground, playground_edges);
    };

    p.mouseReleased = function() {
        let mx = c2idx(p.mouseX);
        let my = c2idx(p.mouseY);
        // clicked on edge
        if (playground_edges[mx][my] == 1) {
            if (mx == 0) {
                mx = 1;
            }
            if (mx == 9) {
                mx = 7;
            }
            if (my == 0) {
                my = 1;
            }
            if (my == 9) {
                my = 7;
            }
            revealBeam(mx,my);
            const rays = renderPlayground();
            rays.forEach(ray => {
                playground[ray.startX +2 ][ray.startY] = 3;
            });
            console.log(rays);
            return;
        }

        switch (playground[mx][my]) {
            case 0:
                if (atoms_left == 0) {
                    return;
                }
                atoms_left--;
                playground[mx][my] = 1;
                break;
            case 1:
                playground[mx][my] = 0;
                atoms_left++;
                break;
        }
        atoms_counter.innerHTML = atoms_left;
    }

    p.draw = function() {
        iterate_over_playground(p, playground, (p, playground, x, y) => {
                const xi = Math.max(0, (x/100));
                const yi = Math.max(0, (y/100));
                draw_box(p, x, y, COLORS[playground[xi][yi]]);
        });
    };
 };

const myp5 = new p5(sketch);
