let lastClickedDot = null;
let constellationLines = [];
let qt = null;
let DISTANCE_THRESHOLD = 10;
let width = null;
let height = null;

function setup() {
  width = window.innerWidth;
  height = window.innerHeight;
  qt = new QuadTree(new Rectangle(width / 2, height / 2, width / 2, height / 2), 4);
  createCanvas(width, height);
  generateDots(50);
}

function generateDots(numDots) {
  for (let i = 0; i < numDots; i++) {
    let x = random(width);
    let y = random(height);
    qt.insert(new Point(x, y));
  }
}

function draw() {
  for (let dot of qt) {
    console.log(dot);
    dot.draw();
  }
  if (lastClickedDot) {
    lastClickedDot.draw(true);
  }

  for (let line of constellationLines) {
    fill(0, 0, 255);
    stroke(5);
    console.log(line)
    line.draw();
  }
}

function mousePressed() {
  let found = qt.query(new Rectangle(mouseX, mouseY, DISTANCE_THRESHOLD, DISTANCE_THRESHOLD));
  console.log("Found", found);
  if (found.length > 0) {
    lastClickedDot = found[0];
  }
  
  redraw()
}

function keyPressed() {
  if (keyCode == ESCAPE) {
    console.log("Escape pressed");
    lastClickedDot = null;
    redraw();
  }
}

class Line {
  constructor(dot1, dot2) {
    this.dot1 = dot1;
    this.dot2 = dot2;
  }

  draw(isHighlighted = false) {
    fill(0);
    line(this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
  }
}