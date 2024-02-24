let dots = [];
let lastClickedDot = null;
let constellationLines = [];
let hideUnusedDots = false;

// Config

function setup() {
  let p5 = createCanvas(window.innerWidth - 100, window.innerHeight - 120);
  p5.parent("drawbox");
  generateDots(100);
  noLoop();
}

function generateDots(numDots) {
  for (let i = 0; i < numDots; i++) {
    let x = random(width);
    let y = random(height);
    dots.push(new Dot(x, y));
  }
}

function draw() {
  clear();
  for (let dot of dots) {
    if (hideUnusedDots == false || dot.isUsed == true) {
      dot.draw(isHighlighted = Object.is(dot, lastClickedDot));
    }
  }
  for (let line of constellationLines) {
    line.draw();
  }
}

function mousePressed() {
  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);
    if (d < 10) {
      if (lastClickedDot) {
        constellationLines.push(new Line(dot, lastClickedDot));
      }
      lastClickedDot = dot;
      dot.toggle();
      break;
    }
  }
  redraw()
}
/// UI Functions (Buttons)
function keyPressed() {
  if (keyCode == ESCAPE) {
    console.log("Escape pressed");
    lastClickedDot = null;
    redraw();
  }
}


function toggleHide() {
  let hideDiv = document.getElementById("hide");
  hideDiv.innerHTML = hideUnusedDots ? "Show Unused" : "Hide Unused";
  hideUnusedDots = !hideUnusedDots;
  console.log("OK SO")
  console.log(hideUnusedDots)
  redraw();
}

function confirmClear() {
  for (let dot of dots) {
    dot.isUsed = false;
  }
  constellationLines = [];
  lastClickedDot = null;
  toggleClearDialog();
  redraw();
}

function toggleClearDialog() {
  let clearDialogDiv = document.getElementById("clearDialogue");
  if (clearDialogDiv.classList.contains("invisible")) {
    clearDialogDiv.classList.remove("invisible");
  } else {
    clearDialogDiv.classList.add("invisible");
  }
}