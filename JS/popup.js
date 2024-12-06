let x;
let y;

// Allow popup animation
document.querySelectorAll(".popup-wrapper").forEach(el => {
    el.classList.remove("hidden");
    setTimeout(function(){
        el.style.transition = "scale 300ms cubic-bezier(0,-0.1,.41,-0.28)";
    }, 300);
})

// Add listener to each div
document.querySelectorAll(".popup-tab").forEach(el => {
    el.addEventListener("mousedown", mdown, false);
    el.addEventListener("touchstart", mdown, false);
})

function mdown(e) {

    let event;
    let parent = this.parentNode;

    // Add class to selected popup
    parent.classList.add("dragged");

    // Account for touchscreen
    if(e.type === "mousedown") {
        event = e;
    } else {
        event = e.changedTouches[0];
    }

    // Find offset
    x = event.pageX - parent.offsetLeft;
    y = event.pageY - parent.offsetTop;

    document.body.addEventListener("mousemove", mmove, false);
    document.body.addEventListener("touchmove", mmove, false);
}

function mmove(e) {

    let drag = document.getElementsByClassName("dragged")[0];

    // Touch or mouse drag
    if(e.type === "mousemove") {
        var event = e;
    } else {
        var event = e.changedTouches[0];
    }
    
    // Ignore default behavior
    event.preventDefault();

    drag.style.top = event.pageY - y + "px";
    drag.style.left = event.pageX - x + "px";

    drag.addEventListener("mouseup", mup, false);
    document.body.addEventListener("mouseleave", mup, false);
    drag.addEventListener("touchend", mup, false);
    document.body.addEventListener("touchleave", mup, false);

}

function mup(e) {

    let drag = document.getElementsByClassName("dragged")[0];

    // Remove event listeners
    document.body.removeEventListener("mousemove", mmove, false);
    if (drag) {
        drag.removeEventListener("mouseup", mup, false);
    }
    document.body.removeEventListener("touchmove", mmove, false);
    if (drag) {
        drag.removeEventListener("touchend", mup, false);
    }

    if(drag) {
        drag.classList.remove("dragged")
    }
}

document.querySelectorAll(".popup-close").forEach(el => {
    el.addEventListener("click", close, false);
})

function close(e) {
    mup();
    let tab = this.parentNode;
    tab.parentNode.classList.add("hidden");
    tab.removeEventListener('mousedown', mdown, false);
    tab.removeEventListener('touchstart', mdown, false);
    tab.style.cursor = "inherit";
}