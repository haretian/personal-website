// get all the posts 
let posts = []

class post {
    constructor(el) {
        this.domElement= el;
        this.borderHeight;
        this.borderWidth;
        this.canvas = el.querySelector("canvas")
        this.id = el.getAttribute("id");

        this.resizeCanvas();
    }

    resizeCanvas() {
        let innerElement = this.domElement.querySelector(".border"); // the container the canvas is in already is the same size as the computed size of the post with padding
        this.borderWidth = innerElement.offsetWidth;
        this.borderHeight = innerElement.offsetHeight;   

        // then just set the canvas size so it covers the whole post
        this.canvas.height = this.borderHeight;
        this.canvas.width = this.borderWidth
    }

    clearCanvas() {
        // this just clears everything on the canvas so if we redraw we don't layer stitches on stitches
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

document.querySelectorAll(".border-wrapper").forEach(el => {
    posts.push(new post(el))
})


function drawBorders(post) {
    // clear first
    post.clearCanvas()

    // consts for stitch gen

    const maxXOffset = 15;
    const minXOffset = 30;

    const yOffset = 2;

    const context = post.canvas.getContext("2d");

    // function to draw a line
    function drawStroke(ctx, x1, y1, x2, y2, color = "white") {
        ctx.beginPath();

        // place the cursor from the point the line should be started 
        ctx.moveTo(x1, y1);

        // draw a line from current cursor position to the provided x,y coordinate
        ctx.lineTo(x2, y2);

        // set strokecolor
        ctx.strokeStyle = color;

        // set lineWidth
        ctx.lineWidth = 3;

        // set lineCap
        ctx.lineCap = "round";

        // add stroke to the line 
        ctx.stroke();
    }


    // func for top bottom
    function drawLine(ctx, startX, startY, length, horizontal = true, first = false) {
        let cursorX = (horizontal ? startX : startY);
        let cursorY = horizontal ? startY : startX;

        let lastX = cursorX;
        let lastY = cursorY;

        while (lastX < length) {
            let xOffset = Math.floor(Math.random() * maxXOffset) + minXOffset;
            let randYOffset = Math.floor((Math.random() - 0.5) * yOffset);

            if (lastX + xOffset > length){
                break;
            }

            if(horizontal) {
                drawStroke(ctx, lastX, lastY, lastX + xOffset, cursorY + randYOffset)
            } else {
                drawStroke(ctx, lastY, lastX, cursorY + randYOffset, lastX + xOffset)
            }

            lastX = lastX + xOffset;
            lastY = cursorY + randYOffset;

        }
        
        if(horizontal) {
            drawStroke(ctx, lastX, lastY, length, cursorY);
        } else {
            drawStroke(ctx, lastY, lastX, cursorY, length);
        }
        // console.log("drawn")
    }

    const buffer = 10;
    const bufferedWidth = post.borderWidth - buffer;
    const bufferedHeight = post.borderHeight - buffer;
    drawLine(context, buffer , buffer, bufferedWidth)
    drawLine(context, buffer , bufferedHeight, bufferedWidth)
    drawLine(context, buffer , buffer, bufferedHeight, false)
    drawLine(context, bufferedWidth , buffer, bufferedHeight, false)
    console.log(post.domElement.id)
    if(post.domElement.matches(".popup-wrapper")) {
        drawLine(context, buffer, 40, bufferedWidth)
    }
}


posts.forEach(post => {
    post.resizeCanvas()
    drawBorders(post)
})
window.onload = async () => {
    // draw all the borders on the posts
    setInterval(() => {
        posts.forEach(post => {
            post.resizeCanvas()
            drawBorders(post)
        })
    }, 200) // for some reason this is the only way I could find to get the offsetHeight property to be accurate
}