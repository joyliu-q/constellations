
// Responsive
let dotRadius = 5;
const BREAK_POINTS = [1024, 768, 425, 375];
function GET_DOT_RADIUS() {
  if (windowWidth > BREAK_POINTS[0]) {
    return 10;
  }
  if (windowWidth > BREAK_POINTS[1]) {
    return 20;
  }
  if (windowWidth > BREAK_POINTS[2]) {
    return 15;
  }
  if (windowWidth > BREAK_POINTS[3]) {
    return 12;
  }
  return 10;
}

class Dot {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isUsed = false;
  }

  draw(time, isHighlighted = false) {
    let addedRadius = 5 * Math.sin(time / 10);

    if (isHighlighted) {
      fill(255, 175, 204);
      ellipse(this.x, this.y, 10 + GET_DOT_RADIUS() + addedRadius, 10 + GET_DOT_RADIUS() + addedRadius);
    }
    if (this.isUsed) {
      fill(189, 224, 254)
      noStroke()
    } else {
      fill(255, 255, 255)
      addedRadius = 0
    }
    ellipse(this.x, this.y, GET_DOT_RADIUS() + addedRadius, GET_DOT_RADIUS() + addedRadius);
  }

  toggle(newValue = null) {
    this.isUsed = newValue ?? !this.isUsed;
  }
}

// Why is this in javascript and not typescript??? Crying
class Line {
  constructor(dot1, dot2, type = "normal") {
    this.dot1 = dot1;
    this.dot2 = dot2;

    switch (type) {
      case "normal":
      case "placeholder":
      case "selected":
      case "invalid":
        this.type = type;
        break;
      default:
        throw new Error("Invalid line type");
    } 
  }

  getColor() {
    switch (this.type) {
      case "normal":
        return "#9c89b8";
      case "placeholder":
        return "#B8BEDD";
      case "invalid":
        return "#EFC3E6";
      case "selected":
        return "#FFAFCC";
    } 
  }

  draw() {
    stroke(this.getColor());
    strokeWeight(4);
    line(this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
    strokeWeight(1);
  }
}