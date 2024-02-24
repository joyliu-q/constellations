// Config
let hideUnusedDots = false;

// Constellation Related Info
let dots = [];
let constellationLines = [];
let lastClickedDot = null;
let placeholderLine = null;

// Animation
let time = 0;

function setup() {
  let p5 = createCanvas(window.innerWidth - 100, window.innerHeight - 150);
  p5.parent("drawbox");

  generateDots(150);
}

function generateDots(numDots) {
  let url = new URL(window.location.href);
  seed = url.searchParams.get("seed");
  if (seed) {
    randomSeed(seed);
  } else {
    seed = random(1000000);
    url.searchParams.set("seed", seed);
    window.history.pushState({}, '', url);
    randomSeed(seed);
  }

  for (let i = 0; i < numDots; i++) {
    let x = random(width);
    let y = random(height);
    dots.push(new Dot(x, y));
  }
}

function draw() {
  clear();
  time += 1;
  for (let dot of dots) {
    if (hideUnusedDots == false || dot.isUsed == true) {
      dot.draw(time, isHighlighted = Object.is(dot, lastClickedDot));
    }
  }
  for (let line of constellationLines) {
    line.draw();
  }
  if (placeholderLine != null) {
    placeholderLine.draw();
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
}

function mouseDragged() {
  let foundDot = false;
  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);
    if (d < 10) {
      if (lastClickedDot) {
        placeholderLine = new Line(lastClickedDot, dot, type = "placeholder");
        foundDot = true;
      }
      break;
    }
  }
  if (!foundDot) {
    placeholderLine = new Line(lastClickedDot, new Dot(mouseX, mouseY), type="invalid");
  }
}

function mouseReleased() {
  if (placeholderLine.type != "placeholder") {
    placeholderLine = null;
    return;
  }
  constellationLines.push(placeholderLine);
  lastClickedDot = placeholderLine.dot2;
  lastClickedDot.toggle(true);
  placeholderLine.dot1.toggle(true);
  placeholderLine = null;
}

/// UI Functions (Buttons)
function keyPressed() {
  if (keyCode == ESCAPE) {
    console.log("Escape pressed");
    lastClickedDot = null;
  }
  if (keyCode == SHIFT) {
    toggleHide();  
  }
}

function keyReleased() {
  if (keyCode == SHIFT) {
    toggleHide();  
  }
}

function toggleHide() {
  let hideDiv = document.getElementById("hide");
  hideDiv.innerHTML = hideUnusedDots ? "Show Unused" : "Hide Unused";
  hideUnusedDots = !hideUnusedDots;
}

function confirmClear() {
  for (let dot of dots) {
    dot.isUsed = false;
  }
  constellationLines = [];
  lastClickedDot = null;
  toggleClearDialog();
}

function toggleClearDialog() {
  let clearDialogDiv = document.getElementById("clearDialogue");
  if (clearDialogDiv.classList.contains("invisible")) {
    clearDialogDiv.classList.remove("invisible");
  } else {
    clearDialogDiv.classList.add("invisible");
  }
}

function resetPage() {
  let url = new URL(window.location.href);
  url.searchParams.delete("seed");
  window.history.pushState({}, '', url);
  location.reload();
}