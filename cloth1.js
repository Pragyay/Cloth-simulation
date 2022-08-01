let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth*70/100,
    height = canvas.height = window.innerHeight;

let RBdrag = document.getElementById('drag'),
    RBtear = document.getElementById('tear'),
    RBmove = document.getElementById('move'),
    RBadd = document.getElementById('add');

let points = []
    sticks = [],
    ball_radius = 1.5,
    bounce = 0.9,                     // reduce velocity after every bounce
    gravity = 0.07,
    friction = 1;

let mouse = {
    x: width/2,
    y: height/2
}

function distance(p1, p2){
    let dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return Math.sqrt(dx*dx + dy*dy);
}

let rows = 50,
    cols = 70;

generatePoints(rows,cols);
generateSticks(rows,cols);

pinPoints();
// addVelocity();

update();

function update(){
    for(let i=0; i<2;i++){
        updatePoints();
        updateSticks();
    }

    ctx.clearRect(0,0,width,height);

    renderSticks();
    renderPoints();

    requestAnimationFrame(update);
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
                // p.y = bottomEdge;
                // p.oldy = p.y + vy*bounce;
                points.splice(i, 1);
            }
        }

    }
}

function renderPoints(){
    for(let i = 0; i < points.length; i++){
        let p = points[i];

        if(p.pinned){
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(p.x, p.y, ball_radius, 0, Math.PI*2);
            ctx.fill();
        }
        // ctx.beginPath();
        // ctx.fillStyle = "gray";
        // ctx.arc(p.x, p.y, ball_radius, 0, Math.PI*2);
        // ctx.fill();
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
            s.p1.x += offsetX;
            s.p1.y += offsetY;
        }

        if(!s.p2.pinned){
            s.p2.x -= offsetX;
            s.p2.y -= offsetY;    
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
    ctx.strokeStyle = "white";
    ctx.strokeWidth = 0.1;
    ctx.stroke();
}

let tearing = false,
    dragging = false,
    moving = false,
    add = false;

document.body.addEventListener("mousedown",function(event){
    if(RBtear.checked){
        tearing = true;
        // console.log(tearing);
    }
    if(RBdrag.checked){
        dragging = true;
        // console.log(dragging);
    }
    if(RBmove.checked){
        moving = true;
    }
    if(RBadd.checked){
        add = true;
    }
});

document.body.addEventListener("mousemove",function(event){
    let rect = canvas.getBoundingClientRect();

    mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

    if(tearing){
        for(let i=0;i<sticks.length;i++){
            if(mouse.x + 10 >= sticks[i].p1.x
                && mouse.x - 10 <= sticks[i].p1.x 
                && mouse.y >= sticks[i].p1.y 
                && mouse.y <= sticks[i].p2.y){
                sticks.splice(i, 1);
            }
        }
    }
    if(dragging){
        for(let i=0;i<points.length;i++){
            if(mouse.x >= points[i].x - 15 && mouse.x <= points[i].x + 15
                 && mouse.y >= points[i].y - 15 && mouse.y <= points[i].y + 15){
                if(!points[i].pinned){
                    points[i].x = mouse.x;
                    points[i].y = mouse.y;
                }
            }
        }
    }
    if(moving){
        for(let i=0;i<points.length;i++){
            if(points[i].pinned){
                if(mouse.x >= points[i].x - 5 && mouse.x <= points[i].x + 5
                    && mouse.y >= points[i].y - 5 && mouse.y <= points[i].y + 5){
                    
                    points[i].pinned = false;
                    points[i].x = mouse.x;
                    points[i].y = mouse.y;
                    points[i].pinned = true;
                }
            }
        }
    }
    if(add){
        for(let i=0;i<points.length;i++){
            if(mouse.x >= points[i].x - 5 && mouse.x <= points[i].x + 5
                 && mouse.y >= points[i].y - 5 && mouse.y <= points[i].y + 5){
                points[i].pinned = !points[i].pinned;
            }
        }
    }
});

document.body.addEventListener("mouseup",function(event){
    if(RBtear.checked){
        tearing = false;
        console.log(tearing);
    }
    if(RBdrag.checked){
        dragging = false;
        console.log(dragging);
    }
    if(RBmove.checked){
        moving = false;
    }
    if(RBadd.checked){
        add = false;
    }
});


    
function generatePoints(rows, cols){
    let initial_x = 170,
        initial_y = 0;
    for(let i=0; i<rows; i++){
        initial_y += 7;

        for(let j=0; j<cols; j++){
            initial_x += 7;
            let point = {
                x: initial_x,
                y: initial_y,
                oldx: initial_x - 2,
                oldy: initial_y
            }
            points.push(point);
        }

        initial_x = 170;
    }
}

function generateSticks(rows, cols){
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
    for(let i=0;i<cols;i++){
        points[i].pinned = true;
    }
}

// function addVelocity(){
//     for(let i= 0; i<cols;i+=cols){
//         points[i].oldx = points[i].oldx - 20;
//     }
// }
