var PLAY = 1;
var END = 0;
var gameState = PLAY;



var bgMusic;

var pacman, pacmanImg,pacmanDeadImg;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var ghostGroup, ghost1, ghost2, ghost3, ghost4;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  pacmanImg=loadAnimation("pacman.png");
  pacmanDeadImg = loadAnimation("deadpacman.png");

  
  
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  ghost1 = loadImage("blueghost.png");
  ghost2 = loadImage("redghost.png");
  ghost3 = loadImage("cyanghost.png");
  ghost4 = loadImage("pinkghost.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  bgMusic = loadSound("BG_Music.wav")
}

function setup() {
  createCanvas(600, 200);

  bgMusic.play();
  bgMusic.loop();
  bgMusic.setVolume(0.4);

  var message = "This is a message";
 console.log(message)
  
  pacman = createSprite(50,160,20,50);
  pacman.addAnimation("running", pacmanImg);
  pacman.addAnimation("collided", pacmanDeadImg);
  

  pacman.scale = 0.2;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  ghostsGroup = createGroup();
  cloudsGroup = createGroup();

  
  pacman.setCollider("rectangle",0,0,pacman.width,pacman.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("lightblue");
  //displaying score
  text("Score: "+ score, 500,50);

  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& pacman.y >= 100) {
        pacman.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    pacman.velocityY = pacman.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnGhosts();
    
    if(ghostsGroup.isTouching(pacman)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      bgMusic.stop();

     //change the trex animation
      pacman.changeAnimation("collided", pacmanDeadImg);
    
     
      if(mousePressedOver(restart)) {
        reset();
      }

      ground.velocityX = 0;
      pacman.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    ghostsGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     ghostsGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  pacman.collide(invisibleGround);
  
 


  drawSprites();
}

function reset(){
  pacman.changeAnimation("running");


  gameState=PLAY;
 ghostsGroup.destroyEach();
 cloudsGroup.destroyEach();
 score=0;
 bgMusic.play();


}


function spawnGhosts(){
 if (frameCount % 60 === 0){
   var ghost = createSprite(600,165,10,40);
   ghost.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: ghost.addImage(ghost1);
              break;
      case 2: ghost.addImage(ghost2);
              break;
      case 3: ghost.addImage(ghost3);
              break;
      case 4: ghost.addImage(ghost4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    ghost.scale = 0.2;
    ghost.lifetime = 300;
   
   //add each obstacle to the group
    ghostsGroup.add(ghost);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.25;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = pacman.depth;
    pacman.depth = pacman.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


