var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3;
var obstacle4;

var obstacle5;


var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var g ;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  bgroundI = loadImage("backgroundImg.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
 console.log(message)
  
  g = createSprite(width-100,height-70,7000,175);
  g.shapeColor = ("green");
  
  trex = createSprite(50,windowHeight/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = windowHeight/750;
  
  
  
  ground = createSprite(windowWidth/2,windowHeight/1.4111,400,20);
  ground.addImage("ground",groundImage);
  ground.x = windowWidth/2;
  ground.scale = windowHeight/500;
  
  gameOver = createSprite(windowWidth/2,windowHeight/2.5);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = windowHeight/750;
  restart.scale = windowHeight/750;
  
  invisibleGround = createSprite(200,windowHeight/1.35,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",15,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(bgroundI);
  //displaying score
  text("Score: "+ score, 500,50);
  
  console.log(getFrameRate())
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round((getFrameRate())/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
                                      
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >  325) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     if(mousePressedOver(restart) || touches.length > 0) {
      reset();
    }
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
     
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  
  gameState = PLAY;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  
  trex.changeAnimation("running",trex_running)

}


function spawnObstacles(){
 if (frameCount % 100 === 0){
    var obstacle = createSprite(600,height-170,20,30);
   obstacle.velocityX = -(6 + score/100);
   obstacle.setCollider('circle',0,0,35)
   obstacle.debug = true
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
     
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale =windowHeight/750;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);      
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}




