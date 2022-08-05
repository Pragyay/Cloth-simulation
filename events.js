window.onload = function(){
    let tearing = false,
        dragging = false,
        moving = false,
        add = false,
        remove = false;

    let dragHandle;
    let offset = {
        x:0,
        y:0
    }

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
        if(RBremove.checked){
            remove = true;
        }
    });
    document.body.addEventListener("mousemove",function(event){
        let rect = canvas.getBoundingClientRect();

        mouse.x = (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
        mouse.y = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;

        if(tearing){
            for(let i=0;i<sticks.length;i++){
                if(mouse.x >= sticks[i].p1.x - 5
                    && mouse.x <= sticks[i].p1.x + 5
                    && mouse.y >= sticks[i].p1.y 
                    && mouse.y <= sticks[i].p2.y){
                    sticks.splice(i, 1);
                }
            }
        }
        if(dragging){
            for(let i=0;i<points.length;i++){
                if(mouse.x >= points[i].x - 8 && mouse.x <= points[i].x + 8
                    && mouse.y >= points[i].y - 8 && mouse.y <= points[i].y + 8){
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
                            points[i].color = "#90ee90";

                            document.body.addEventListener("mousemove",onMouseMove);
                            document.body.addEventListener("mouseup",onMouseUp);

                            dragHandle = points[i];
                            offset.x  = event.clientX - points[i].x;
                            offset.y  = event.clientY - points[i].y;
                    }
                }
            }
        }
        if(add){
            for(let i=0;i<points.length;i++){
                if(!points[i].pinned){
                    if(mouse.x >= points[i].x - 3 && mouse.x <= points[i].x + 3
                        && mouse.y >= points[i].y - 3 && mouse.y <= points[i].y + 3){
                            points[i].pinned = true;
                            
                    }
                }   
            }
        }
        if(remove){
            for(let i=0;i<points.length;i++){
                if(points[i].pinned){
                    if(mouse.x >= points[i].x - 5 && mouse.x <= points[i].x + 5
                        && mouse.y >= points[i].y - 5 && mouse.y <= points[i].y + 5){
                        points[i].pinned = false;       
                    }
                } 
            }
        }
        
    });
    document.body.addEventListener("mouseup",function(event){
        if(RBtear.checked){
            tearing = false;
            // console.log(tearing);
        }
        if(RBdrag.checked){
            dragging = false;
            // console.log(dragging);
        }
        if(RBmove.checked){
            moving = false;
        }
        if(RBadd.checked){
            add = false;
        }
        if(RBremove.checked){
            remove = false;
        }
    });

    // dragging pinned points
    function onMouseMove(event){
        dragHandle.x = event.clientX - offset.x;
        dragHandle.y = event.clientY - offset.y;
    }
    function onMouseUp(event){
        document.body.removeEventListener("mousemove",onMouseMove);
        document.body.removeEventListener("mouseup",onMouseUp);
        dragHandle.color = "red";
    }

    btn.addEventListener("click",function(){
        topPinned = !topPinned;
        // console.log(topPinned);
        ctx.clearRect(0,0, width,height);

        points = [];
        sticks = [];
        
        generatePoints(rows,cols,space);
        generateSticks(rows,cols,space);
        pinPoints();
        console.log(increment);
    })
}