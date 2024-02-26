// Config
let hideUnusedDots = false;

// Constellation Related Info
let constellations = null;
let dots = [];
let constellationLines = [];
let lastClickedDot = null;
let lastClickedLine = null;
let placeholderLine = null;

// Animation
let time = 0;

function setup() {
  // Prevent drag on drawbox
  const drawbox = document.getElementById('drawbox');
  drawbox.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents scrolling when touch is initiated
  });

  drawbox.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevents scrolling when mouse click is initiated
  });


  constellations = new Constellations(windowWidth, windowHeight);
  let p5 = createCanvas(constellations.getWidth(), constellations.getHeight());
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
    let x = random(1);
    let y = random(1);
    dots.push(new Dot(x, y));
  }
}

function draw() {
  clear();
  time += 1;
  for (let dot of dots) {
    if (hideUnusedDots == false || dot.isUsed == true) {
      dot.draw(constellations, time, isHighlighted = Object.is(dot, lastClickedDot));
    }
  }
  for (let line of constellationLines) {
    line.draw(constellations);
  }
  if (placeholderLine != null) {
    placeholderLine.draw(constellations);
  }
}

function mousePressed() {
  // I would like to preface this by saying I originally made a Quad tree and realized
  // it is overengineering for a smol project like this
  // TODO: maybe in the future
  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.getX(constellations), dot.getY(constellations));
    if (d < constellations.getDistanceThreshold()) {
      if (dot && lastClickedDot) {
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
    let d = dist(mouseX, mouseY, dot.getX(constellations), dot.getY(constellations));
    if (d < 10) {
      if (dot && lastClickedDot) {
        placeholderLine = new Line(lastClickedDot, dot, type = "placeholder");
        foundDot = true;
      }
      break;
    }
  }
  if (!foundDot && lastClickedDot) {
    placeholderLine = new Line(lastClickedDot, new Dot(mouseX / constellations.getWidth(), mouseY / constellations.getHeight()), type="invalid");
  }
}

function mouseReleased() {
  if (placeholderLine == null) {
    return;
  }
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
    lastClickedDot = null;
  }
  if (keyCode == SHIFT) {
    toggleHide();  
  }
  // if it is D
  if (keyCode == 68) {
    lastClickedDot.toggle(false);
    lastClickedDot = null;
    deleteLine();
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
    dot.toggle(false);
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

function deleteLine() {
  for (let line of constellationLines) {
    // use Least Squares to find the closest point on the line
    let x1 = line.dot1.getX(constellations);
    let y1 = line.dot1.getY(constellations);
    let x2 = line.dot2.getX(constellations);
    let y2 = line.dot2.getY(constellations);
    let u = ((mouseX - x1) * (x2 - x1) + (mouseY - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let closestX = x1 + u * (x2 - x1);
    let closestY = y1 + u * (y2 - y1);
    let d = dist(mouseX, mouseY, closestX, closestY);
    if (d < constellations.getDistanceThreshold()) {
      lastClickedLine = line;
      line.type = "selected";
      break;
    }
  }

  if (lastClickedLine == null) {
    return;
  }
  // remove line from constellationLines
  let index = constellationLines.indexOf(lastClickedLine);
  if (index > -1) {
    constellationLines.splice(index, 1);
  }
  // remove dot1, dot2 from foundLine
  lastClickedLine.dot1.toggle(false);
  lastClickedLine.dot2.toggle(false);
  lastClickedLine = null;
}

function windowResized() {
  if (!windowHeight || !windowWidth) {
    return;
  }
  constellations.recalculate(windowWidth, windowHeight);
  resizeCanvas(constellations.getWidth(), constellations.getHeight());
}
