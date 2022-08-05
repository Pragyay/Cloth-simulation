let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth*60/100,
    height = canvas.height = window.innerHeight;

    // radio buttons
let RBdrag = document.getElementById('drag'),
    RBtear = document.getElementById('tear'),
    RBmove = document.getElementById('move'),
    RBadd = document.getElementById('add'),
    RBremove = document.getElementById('remove');

    // input ranges
let space = parseFloat(document.getElementById('spacing').value),
    rows = parseFloat(document.getElementById('rows').value),
    cols = parseFloat(document.getElementById('cols').value);

let btn = document.getElementById('changeCloth');
    
let points = []
    sticks = [],
    ball_radius = 10,
    bounce = 0.9,                     // reduce velocity after every bounce
    friction = 0.999,
    increment = 3;

let gravity;
let topPinned = false;

let mouse = {
    x: width/2,
    y: height/2
}

generatePoints(rows,cols,space);
generateSticks(rows,cols,space);

pinPoints();
// addVelocity();

update();

function update(){
    console.log(increment);
    for(let i=0; i<2;i++){
        updatePoints();
        updateSticks();
    }
    
    ctx.clearRect(0,0,width,height);

    renderSticks();
    renderPoints();

    requestAnimationFrame(update);
}

function distance(p1, p2){
    let dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return Math.sqrt(dx*dx + dy*dy);
}

// on change in range input
function resetSpacing(ele, value){

    ctx.clearRect(0,0, width,height);

    points = [];
    sticks = [];

    space = parseFloat(value);

    generatePoints(rows,cols,space);
    generateSticks(rows,cols,space);
    pinPoints();
}
function resetCols(ele, value){

    ctx.clearRect(0,0, width,height);

    points = [];
    sticks = [];

    cols = parseFloat(value);
    
    generatePoints(rows,cols,space);
    generateSticks(rows,cols,space);
    pinPoints();
}
function resetRows(ele, value){

    ctx.clearRect(0,0, width,height);

    points = [];
    sticks = [];

    rows = parseFloat(value);
    generatePoints(rows,cols,space);
    generateSticks(rows,cols,space);
    pinPoints();
}


function updatePoints(){
    for(let i = 0; i < points.length; i++){
        let p = points[i];

        if(!p.pinned){
            let vx = (p.x - p.oldx)*friction,
                vy = (p.y - p.oldy)*friction;

            p.oldx = p.x;
            p.oldy = p.y;

            p.x += vx;
            p.y += vy;
            p.y += gravity;
        

            //handling edges
            let rightEdge = (width - ball_radius),
                leftEdge = topEdge = ball_radius,
                bottomEdge = (height - ball_radius);

            if(p.x > rightEdge){
                p.x = rightEdge;
                p.oldx = p.x + vx*bounce;
            }

            else if(p.x < leftEdge){
                p.x = leftEdge;
                p.oldx = p.x + vx*bounce;
            }

            else if(p.y < topEdge){
                p.y = topEdge;
                p.oldy = p.y + vy*bounce;
            }

            else if(p.y > bottomEdge){
                p.y = bottomEdge;
                p.oldy = p.y + vy*bounce;
            }
        }

    }
}
function updateSticks(){
    for(let i=0; i < sticks.length; i++){
        let s = sticks[i];

        let dx = s.p2.x - s.p1.x,
            dy = s.p2.y - s.p1.y,
            distance = Math.sqrt(dx*dx + dy*dy),

            difference = distance - s.length,
            percent = difference / distance / 2,
            offsetX = dx * percent,
            offsetY = dy * percent;
        
        if(!s.p1.pinned){
            s.p1.x += offsetX/2;
            s.p1.y += offsetY/2;
        }

        if(!s.p2.pinned){
            s.p2.x -= offsetX/2;
            s.p2.y -= offsetY/2;    
        }
    }
}


function renderPoints(){
    for(let i = 0; i < points.length; i++){
        let p = points[i];

        if(p.pinned){
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, ball_radius, 0, Math.PI*2);
            ctx.fill();
        }
    }
}
function renderSticks(){
    ctx.beginPath();
    for(let i = 0; i < sticks.length; i++){
        let s = sticks[i];
        ctx.moveTo(s.p1.x, s.p1.y);
        ctx.lineTo(s.p2.x, s.p2.y);
    }
    ctx.strokeStyle = "#DDC6B6";
    ctx.strokeWidth = 0.1;
    ctx.stroke();
}
    

function generatePoints(rows, cols, value){
    let initial_x = (width - (cols*space))/2,
        initial_y = 20;
    for(let i=0; i<rows; i++){
        initial_y += value;

        for(let j=0; j<cols; j++){
            initial_x += value;
            let point = {
                x: initial_x,
                y: initial_y,
                oldx: initial_x - increment,
                oldy: initial_y,
                color: "red"
            }
            points.push(point);
        }

        initial_x = (width - (cols*space))/2;
    }
}
function generateSticks(rows, cols, value){
    // hzt sticks
    let initial_index = 0;
    for(let i=0;i<rows;i++){
        initial_index = cols*i;

        for(let j=0;j<cols-1;j++){
            let stick = {
                p1: points[initial_index + j],
                p2: points[initial_index + j + 1],
                length: distance(points[initial_index + j], points[initial_index + j + 1])
            }
            sticks.push(stick);
        }
    }

    initial_index = 0;

    // vrt sticks
    for(let i=0;i<rows-1;i++){
        initial_index = i*cols;
        for(let j=0;j<cols;j++){
            let stick = {
                p1: points[initial_index + j],
                p2: points[initial_index + cols + j],
                length: distance(points[initial_index + j], points[initial_index+cols+j])
            }
            sticks.push(stick);
        }
    }
}
function pinPoints(){

    if(topPinned){
        gravity = 0.06;
        ball_radius = 3;
        increment = 3;

        for(let i=0;i<cols;i++){
            points[i].pinned = true;
        }
    }
    else{
        gravity = 0.019;
        ball_radius = 10;
        increment = 3;

        points[0].pinned = true;
        points[(rows-1)*cols].pinned = true;
        // points[(rows-1)*cols/2].pinned = true;

        points[cols-1].pinned = true;
        points[rows*cols-1].pinned = true;
        // points[(rows+1)*cols/2 - 1].pinned = true;
    }
    
}

// function addVelocity(){
//     for(let i= 0; i<cols;i+=cols){
//         points[i].oldx = points[i].oldx - 20;
//     }
// }
