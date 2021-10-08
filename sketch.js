let boxw, boxh;
let cx, cy;

let gw, gh;

let result, arr, pinyin;
let character, charpos, charcoord, charmark, charmarked;
let strokeSize;
let clearw, clearh;

//load text files you want to practice
function preload() {
  result = loadStrings("hsk6words.txt");
  pinyin = loadStrings("hsk6pinyin.txt");
}

//only drawing most things once in setup and then refreshing as necessary
function setup() {
  
  createCanvas(700, 700);
  boxw = width / 2;
  boxh = height / 2;
  cx = width / 2;
  cy = height / 2;

  gw = 50;
  gh = 50;
  // frameRate(60);
  // print(result.length);
  // print(pinyin);
  
  //character data
  arr = result;
  // arr = shuffle(result);
  character = arr[0];
  charpos = 0;
  charcoord = [0, 0];
  charmark = [];
  charmarked = 0;

  //whether this character has been marked
  for (i = 0; i < int(((width / gw) * height) / gh); i++) {
    charmark[i] = false;
  }

  //character stroke size
  strokeSize = 10;

  //clear and mark button sizes
  clearw = boxw / 10;

  //draw text in boxes
  drawingContext.setLineDash([3, 10]);
  textAlign(CENTER);
  // noStroke();
  count = 0;

  for (i = 0; i < width; i += gw) {
    for (j = 0; j < height; j += gh) {
      fill(250);
      stroke(200);
      strokeWeight(1);
      rect(i, j, gw, gh);
      fill(200);

      textSize(gw * 0.5);
      noStroke();

      if (
        i + gw < cx - boxw / 2 ||
        i > cx + boxw / 2 ||
        j + gh < cy - boxh / 2 ||
        j > cy + boxh / 2
      ) {
        fill(255, 200, 200);
        text(arr[count], i + gw / 2, j + gh / 2 + gh / 7);
      }
      count++;
    }
  }

  drawBox();
  drawButtons();
}

//mostly empty because things are not redraw
function draw() {
  // background(255);
  // drawingContext.setLineDash([0, 0]);
}

//draw mark, clear buttons
function drawButtons() {
  drawingContext.setLineDash([0, 0]);
  // rect(cx + boxw/2 - clearw, cy + boxh/2 - clearh, clearw*0.7, clearh*0.7);
  // ellipseMode(CENTER);

  //clear
  fill(200, 255, 200);
  ellipseMode(RADIUS);
  ellipse(
    cx + boxw / 2 - clearw / 1.5,
    cy + boxh / 2 - clearw / 1.5,
    (clearw * 0.8) / 2,
    (clearw * 0.8) / 2
  );
  textAlign(CENTER);
  textSize(11);
  fill(150);
  text("clear", cx + boxw / 2 - clearw / 1.5, cy + boxh / 2 - clearw / 1.5);

  //mark
  fill(255, 200, 200);
  ellipse(
    cx - boxw / 2 + clearw / 1.5,
    cy + boxh / 2 - clearw / 1.5,
    (clearw * 0.8) / 2,
    (clearw * 0.8) / 2
  );
  fill(150);
  text("mark", cx - boxw / 2 + clearw / 1.5, cy + boxh / 2 - clearw / 1.5);
}

//draw box with word
function drawBox() {
  drawingContext.setLineDash([0, 0]);

  //outer box
  fill(255);
  stroke(200);
  strokeWeight(3);
  rect(cx - boxw / 2, cy - boxh / 2, boxw, boxh);

  //character
  fill(230);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(boxh * 0.8);
  text(character, width / 2, height / 2 + height / 30);
  // stroke(255, 30);

  //dashed lines in middle to look more like a learning book
  stroke(230);
  fill(230);
  drawingContext.setLineDash([3, 10]);

  line(cx - boxw / 2, cy, cx + boxw / 2, cy);
  line(cx, cy - boxh / 2, cx, cy + boxh / 2);

  //instructions and pinyin
  drawingContext.setLineDash([0, 0]);
  noStroke();
  fill(255, 200, 200);
  textSize(gw / 2);
  text("Write, Click", cx, cy - boxh / 2 + boxh / 20);
  text(pinyin[charpos], cx, cy + boxh / 2 - boxh / 20);
}

//when mouse is clicked, might be clicking buttons or choosing new word
function mouseClicked() {
  
  //if in clear button
  if (
    dist(
      mouseX,
      mouseY,
      cx + boxw / 2 - clearw / 2,
      cy + boxh / 2 - clearw / 2
    ) <
    clearw / 2
  ) {
    print("Clear");
    drawBox();
    drawButtons();
    return;
  }

  //if in mark button
  if (
    dist(
      mouseX,
      mouseY,
      cx - boxw / 2 + clearw / 1.5,
      cy + boxh / 2 - clearw / 1.5
    ) <
    clearw / 2
  ) {
    print("Mark");
    charmark[charpos] = true;
    charmarked++;
    noStroke();
    fill(255, 200, 200);
    rect(charcoord[0] * gw, charcoord[1] * gh, gw, gh);
    return;
  }

  //determine which character was pressed
  i = round(mouseX / gw - 0.5);
  j = round(mouseY / gh - 0.5);
  print(i + " " + j);
  if (
    (i + 1) * gw > cx - boxw / 2 &&
    i * gw < cx + boxw / 2 &&
    (j + 1) * gh > cy - boxh / 2 &&
    j * gh < cy + boxh / 2
  ) {
    print("In Box");
    return;
  }
  
  //log new character data
  charcoord = [i, j];

  charpos = int((i * height) / gh) + j;
  if (charmarked[charpos]) {
    charmarked[i] = false;
  }
  print(arr[int((i * height) / gh) + j]);
  character = arr[charpos];

  drawBox();
  drawButtons();
}

//if mouse is dragged and mouseX, mouseY in drawing box, draw a stroke
function mouseDragged() {
  if (
    mouseX - strokeSize > cx - boxw / 2 &&
    mouseX + strokeSize < cx + boxw / 2 &&
    mouseY - strokeSize > cy - boxh / 2 &&
    mouseY + strokeSize < cy + boxh / 2
  ) {
    drawingContext.setLineDash([0, 0]);
    // noStroke();
    stroke(150);
    fill(200);
    strokeWeight(10);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

//whether mouseX and mouseY are within the drawing box
function inBox() {
  return (
    mouseX > cx - boxw / 2 &&
    mouseX < cx + boxw / 2 &&
    mouseY > cy - boxh / 2 &&
    mouseY < cy + boxh / 2
  );
}

// function clearBox(){

// }
