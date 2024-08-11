

let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

// Preload assets before the game starts
function preload() {
  this.load.image("background", "assets/background.png");
  this.load.image("road", "assets/road.png");
  this.load.image("column", "assets/column.png");
  this.load.spritesheet("bird", "assets/bird.png", {
    frameWidth: 64,
    frameHeight: 96,
  });
}

let bird;
let cursors;
let hasLanded = false;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let score = 0;
let scoreText;

/*
* Create the game elements
*/
function create() {
  const background = this.add.image(0, 0, "background").setOrigin(0, 0);
  cursors = this.input.keyboard.createCursorKeys();

  const roads = this.physics.add.staticGroup();
  const topColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 1,
    setXY: { x: 200, y: 0, stepX: 300 },
  });

  const bottomColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 1,
    setXY: { x: 350, y: 400, stepX: 300 },
  });

  const road = roads.create(400, 568, "road").setScale(2).refreshBody();

  bird = this.physics.add.sprite(0, 50, "bird").setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);
  
  // Check for overlap between the bird and the road.
  // If they overlap, set hasLanded to true.
  this.physics.add.overlap(bird, road, () => (hasLanded = true), null, this);
  // Add a collider between the bird and the road to handle physical collisions.
  this.physics.add.collider(bird, road);

  // Check for overlap between bird and top columns, set hasBumped to true if they overlap.
  this.physics.add.overlap(bird, topColumns, () => hasBumped = true, null, this);
  // Add a collider between bird and bottom columns, set hasBumped to true if they collide.
  this.physics.add.collider(bird, bottomColumns, () => hasBumped = true, null, this);
  // Add a collider between bird and top columns to handle physical collisions.
  this.physics.add.collider(bird, topColumns);
  // Add a collider between bird and bottom columns to handle physical collisions.
  this.physics.add.collider(bird, bottomColumns);

  messageToPlayer = this.add.text(
      400,  // x position
      550,  // y position
      'Instructions: Press Space to start the game and Up to jump', 
      { 
        fontFamily: "monospace", 
        fontSize: '20px', 
        color: "#ffffff",  // White color for visibility
        backgroundColor: "rgba(0, 0, 0, 0.7)",  // Semi-transparent black background
        align: 'center' 
      }
    ).setOrigin(0.5, 0.5);  // Center the text

  scoreText = this.add.text(
      700,  // x position
      10,  // y position
      `Score: ${score}`, 
      { 
          fontFamily: "monospace", 
          fontSize: '20px', 
          color: "#ffffff",  // White color for visibility
          backgroundColor: "rgba(0, 0, 0, 0.7)",  // Semi-transparent black background
          align: 'center' 
      }
  ).setOrigin(0.5, 0.5);  // Center the text
  // Add restart key
  this.input.keyboard.on('keydown-R', restartGame, this);
  //Restarting button even listener


  /*
  //I have no idead but this didn't work
  document.getElementById("restartBtn").addEventListener("click", ()=>{
      restartGame();
  });
  */

  document.getElementById("restartBtn").addEventListener("click", ()=>{
      hasLanded = false;
      hasBumped = false;
      isGameStarted = false;
      score = 0;

      //Restarting the Scene
      this.scene.restart();
  });
}
 
function update() {
  if (cursors.space.isDown && !isGameStarted) {
    isGameStarted = true;
    messageToPlayer.setText('Instructions: Press the "^" button to stay upright\nAnd don\'t hit the columns or ground');
  }

  if (!isGameStarted) {
    bird.setVelocityY(0); // Keep the bird still before the game starts
  } else if (cursors.up.isDown && !hasLanded && !hasBumped) {
      bird.setVelocityY(-160);
      if(cursors.up.isDown && !(bird.x > 750)) {
          score += 1;
          scoreText.setText(`Score: ${score}`);
      }   
  }

  if (!hasLanded && !hasBumped && isGameStarted) {
    bird.body.velocity.x = 50;
  }

  if (hasLanded || hasBumped || !isGameStarted) {
    bird.body.velocity.x = 0;
  }

  if (hasLanded || hasBumped) {
    messageToPlayer.setText('Oh no! You crashed');
  }

  if (bird.x > 750) {
    bird.setVelocityY(40);
    messageToPlayer.setText('Congrats! You won!');
  }
}


//Restarting function
function restartGame(){
  hasLanded = false;
  hasBumped = false;
  isGameStarted = false;
  score = 0;

  //Restarting the Scene
  this.scene.restart();
} 