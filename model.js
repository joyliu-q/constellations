
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
    console.log(addedRadius);

    if (isHighlighted) {
      fill(255, 175, 204);
      ellipse(this.x, this.y, 20 + addedRadius, 20 + addedRadius);
    }
    if (this.isUsed) {
      fill(189, 224, 254)
      noStroke()
    } else {
      fill(255, 255, 255)
      stroke(0)
      addedRadius = 0
    }
    ellipse(this.x, this.y, 10 + addedRadius, 10 + addedRadius);
  }

  toggle(isTrue = false) {
    this.isUsed = isTrue ? true : !this.isUsed;
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
      case "invalid":
        this.type = type;
        break;
      default:
        throw new Error("Invalid line type");
    } 
  }

  getColor() {
    switch (type) {
      case "normal":
        return "#9c89b8";
      case "placeholder":
        return "#B8BEDD";
      case "invalid":
        return "#EFC3E6";
    } 
  }

  draw() {
    stroke(this.getColor());
    strokeWeight(4);
    line(this.dot1.x, this.dot1.y, this.dot2.x, this.dot2.y);
    strokeWeight(1);
  }
}