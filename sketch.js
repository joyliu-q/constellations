let dots = [];
let lastClickedDot = null;
let constellationLines = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  generateDots(50);
}

function generateDots(numDots) {
  for (let i = 0; i < numDots; i++) {
    let x = random(width);
    let y = random(height);
    ellipse(x, y, 10, 10);
    dots.push(createVector(x, y));
  }
}

function draw() {
  background(255);
  for (let dot of dots) {
    fill(0);
    ellipse(dot.x, dot.y, 10, 10);
  }
  fill(0, 255, 0);
  ellipse(lastClickedDot.x, lastClickedDot.y, 10, 10)

  for (let line of constellationLines) {
    fill(0, 0, 255);
    stroke(5);
    console.log(line)
    line.draw();
  }
}

function mousePressed() {
  console.log("Mouse pressed at", mouseX, mouseY);
  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);
    if (d < 50) {
      if (lastClickedDot) {
        console.log(dot)
        console.log(lastClickedDot)
        constellationLines.push(new Line(dot, lastClickedDot));
      }
      lastClickedDot = dot;
      break;
    }
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

  draw() {
    line(this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
  }
}