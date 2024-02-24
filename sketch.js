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
  // if it is D
  if (keyCode == 68) {
    deleteLine(mouseX, mouseY);
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

// TODO: i added this last min so its very jank pls fix
function deleteLine(mouseX, mouseY) {
  // find line near mouseX and mouseY
  let foundLine = null;
  for (let line of constellationLines) {
    // use Least Squares to find the closest point on the line
    let x1 = line.dot1.x;
    let y1 = line.dot1.y;
    let x2 = line.dot2.x;
    let y2 = line.dot2.y;
    let x3 = mouseX;
    let y3 = mouseY;
    let u = ((x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let closestX = x1 + u * (x2 - x1);
    let closestY = y1 + u * (y2 - y1);
    let d = dist(mouseX, mouseY, closestX, closestY);
    if (d < 10) {
      foundLine = line;
      break;
    }
  }
  if (foundLine == null) {
    return;
  }
  // remove line from constellationLines
  let index = constellationLines.indexOf(foundLine);
  if (index > -1) {
    constellationLines.splice(index, 1);
  }
  // remove dot1 from foundLine
  foundLine.dot1.toggle(false);
  // remove dot2 from foundLine
  foundLine.dot2.toggle(false);
}