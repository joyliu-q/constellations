
class Dot {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isUsed = false;
  }

  draw(isHighlighted = false) {
    if (isHighlighted) {
      fill(255, 175, 204);
      ellipse(this.x, this.y, 20, 20);
    }
    this.isUsed ? fill(189, 224, 254) : fill(255, 255, 255);
    this.isUsed ? noStroke() : stroke(0);
    ellipse(this.x, this.y, 10, 10);
  }

  toggle() {
    this.isUsed = !this.isUsed;
  }

  
}

class Line {
  constructor(dot1, dot2) {
    this.dot1 = dot1;
    this.dot2 = dot2;
  }

  draw() {
    stroke(156, 137, 184);
    strokeWeight(4);
    line(this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
    strokeWeight(1);
  }
}