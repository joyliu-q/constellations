
class Dot {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isUsed = false;
  }

  getX(c) {
    if (!c) {
      throw new Error("Canvas is not defined");
    }
    return this.x * c.getWidth();
  }

  getY(c) {
    if (!c) {
      throw new Error("Canvas is not defined");
    }
    return this.y * c.getHeight();
  }

  draw(c, time, isHighlighted = false) {
    let addedRadius = 5 * Math.sin(time / 10);

    if (isHighlighted) {
      fill(255, 175, 204);
      ellipse(this.getX(c), this.getY(c), 10 + c.getDotRadius() + addedRadius, 10 + c.getDotRadius() + addedRadius);
    }
    if (this.isUsed) {
      fill(189, 224, 254)
      noStroke()
    } else {
      fill(255, 255, 255)
      addedRadius = 0
    }
    ellipse(this.getX(c), this.getY(c), c.getDotRadius() + addedRadius, c.getDotRadius() + addedRadius);
  }

  toggle(newValue = null) {
    this.isUsed = newValue ?? !this.isUsed;
  }
}

// Why is this in javascript and not typescript??? Crying
class Line {
  constructor(dot1, dot2, type = "normal") {
    if (!(dot1 instanceof Dot) || !(dot2 instanceof Dot)) {
      throw new Error("Invalid dot type");
    }
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

  draw(c) {
    stroke(this.getColor());
    strokeWeight(4);
    line(this.dot1.getX(c), this.dot1.getY(c), this.dot2.getX(c), this.dot2.getY(c));
    strokeWeight(1);
  }
}


class Constellations {
  constructor(width, height) {
    this.recalculate(width, height);
  }

  recalculate(width, height) {
    this.width = width - 100;
    this.height = height - 150;
    this.distanceThreshold = Constellations._calc_distance_threshold();
    this.dotRadius = Constellations._calc_dot_radius();
  }

  // "Private" helper methods
  static _break_points = [425, 768, 1024];
  static _calc_dot_radius() {
    if (windowWidth < Constellations._break_points[0]) {
      return 20;
    }
    if (windowWidth < Constellations._break_points[1]) {
      return 16;
    }
    if (windowWidth < Constellations._break_points[2]) {
      return 14;
    }
    return 10;
  }
  static _calc_distance_threshold() {
    return this._calc_dot_radius() * 2;
  }

  getDistanceThreshold() {
    return this.distanceThreshold;
  }
  getDotRadius() {
    return this.dotRadius;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }  
}