class Draggable {
  constructor(tempX, tempY, tempW, tempH) {
    this.x = tempX;
    this.y = tempY;
    this.width = tempW;
    this.height = tempH;
  }

  //this could be expanded to use images instead (make sure to preload them)
  //see this video for more info: https://thecodingtrain.com/tracks/code-programming-with-p5-js/code/7-arrays/8-objects-images
  display() {
    fill(255, 255, 255);
    rect(this.x, this.y, this.width, this.height);
  }

  //the main draggable class...
  draggable() {
    //point to rectangle collision detection
    if (
      mouseX >= this.x && // right of the left edge AND
      mouseX <= this.x + this.width && // left of the right edge AND
      mouseY >= this.y && // below the top AND
      mouseY <= this.y + this.height // above the bottom
    ) {
      //the mouse is inside the rect
      // change the cursor to reflect and indicate the User Experience
      cursor("grab");

      //check if the mouse is down
      if (mouseIsPressed) {
        // console.log("dragging")

        //move the position of the rect (always put the cursor in the center of the element)
        this.x = mouseX - this.width / 2;
        this.y = mouseY - this.height / 2;
      }
    } else {
      //no longer colliding
      //so change the mouse back to the arrow.
      cursor(ARROW);
    }
  }
}
