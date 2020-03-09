
let controller, rectangle, loop;
let canvas;
let ctx;
let context;
let life = 3;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 450;
canvas.height = 300;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 30;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/back3.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {

    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}


rectangle = {   //this is hero 

    height:32,
    jumping:true,
    width:32,
    x:144, // center of the canvas
    x_velocity:0,
    y:0,
    y_velocity:0
  
};


controller = {
  
    left:false,
    right:false,
    up:false,
    keyListener:function(event) {
  
      var key_state = (event.type == "keydown")?true:false;
  
      switch(event.keyCode) {
  
        case 37:// left key
          controller.left = key_state;
        break;
        case 38:// up key
          controller.up = key_state;
        break;
        case 39:// right key
          controller.right = key_state;
        break;
  
      }
  
    }
  
};

let updateHero = function() {

    if (controller.up && rectangle.jumping == false) {
  
      rectangle.y_velocity -= 20;
      rectangle.jumping = true;
  
    }
  
    if (controller.left) {
  
      rectangle.x_velocity -= 0.5;
  
    }
  
    if (controller.right) {
  
      rectangle.x_velocity += 0.5;
  
    }
  
    rectangle.y_velocity += 1.5;// gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;// friction
    rectangle.y_velocity *= 0.9;// friction
  
    // if rectangle is falling below floor line
    if (rectangle.y > 180 - 16 - 32) {
  
      rectangle.jumping = false;
      rectangle.y = 180 - 16 - 32;
      rectangle.y_velocity = 0;
  
    }
  
    // if rectangle is going off the left of the screen
    if (rectangle.x < 0) {
  
      rectangle.x = 0;
  
    } else if (rectangle.x > canvas.width -32) {// if rectangle goes past right boundary
  
      rectangle.x = canvas.width-32;
  
    }


};

let monsterX = 0;
let monsterY = 0;

let monsterBx = canvas.width;
let monsterBy = canvas.height - 55;

let monsterCx = 0;
let monsterCy = canvas.height - 100;

let crash = false;

function updateLife () {
  life -= 1;
  document.getElementById('life').innerHTML = life;
  ctx.drawImage(heroImage, rectangle.x, rectangle.y + (canvas.height/2 -37));
  console.log(life);
  if (life == 0) {
    crash = true;
    console.log("true")
  } else {
    return;
  }
}
let updateMonsters = function() {
  var crash = false;
  monsterY = monsterY + 3;
  if(monsterY > canvas.height) {
    // Time to move him
    monsterX = Math.random() * canvas.width;
    monsterY = 0;
  }

  monsterBx = monsterBx - 3;
  if(monsterBx < -32) {
    monsterBx = canvas.width;
  } 

  monsterCx = monsterCx + 3;
  if(monsterCx > canvas.width + 32) {
    monsterCx = 0;
  }

  var life = 3;
  life = life - 1;
  
  if (
    rectangle.x <= (monsterX + 32)
    && monsterX <= (rectangle.x + 32)
    && rectangle.y <= (monsterY + 32)
    && monsterY <= (rectangle.y + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    updateLife();
  }
  return 
}



let update = function() {
  updateHero();
  updateMonsters();
}


var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, rectangle.x, rectangle.y + (canvas.height/2 -37));
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
    ctx.drawImage(monsterImage, monsterBx, monsterBy);
    ctx.drawImage(monsterImage, monsterCx, monsterCy);
  }
  
  ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 50);
  
};


var main = function () { 
  render();
  update();
  requestAnimationFrame(main);
};


var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


loadImages();
// setupKeyboardListeners();
main();
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
// window.requestAnimationFrame(loop);