window.onload = function () {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game(360, 640, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        game.load.image('firework', 'assets/firework_b4.png');
        game.load.image('line', 'assets/line.png');
        game.load.image('over', 'assets/overlay.png');
        game.load.image('fg', 'assets/foreground.png');
        game.load.spritesheet('f1_w', 'assets/f1_white.png', 150, 150, 12);
        game.load.spritesheet('f1_g', 'assets/f1_green.png', 150, 150, 12);
        game.load.spritesheet('f1_y', 'assets/f1_yellow.png', 150, 150, 12);
        game.load.spritesheet('f2_w', 'assets/f2_white.png', 230, 230, 16);
        game.load.spritesheet('f2_o', 'assets/f2_orange.png', 230, 230, 16);
        game.load.spritesheet('f2_p', 'assets/f2_purple.png', 230, 230, 16);
        game.load.spritesheet('f3_w', 'assets/f3_white.png', 300, 300, 20);
        game.load.spritesheet('f3_r', 'assets/f3_red.png', 300, 300, 20);
        game.load.spritesheet('f3_b', 'assets/f3_blue.png', 300, 300, 20);
        game.load.audio('win', 'assets/cheer.mp3');    
        game.load.audio('fw1', 'assets/fw1.mp3');
        game.load.audio('fw2', 'assets/fw2.mp3');
        game.load.audio('fw3', 'assets/fw3.mp3');
        

    }   
    
    var message;
    var fireworkGroup;
    var numOfFireworks = 5;
    var topBoundY = 40;
    var lowerBoundY = 350;
    var firework;
    var hp = 100;
    var myText;
    var time = Phaser.Timer.SECOND * 3;
    var endGame = false;
    var score = 0;
    var scoreText;
    var line1, line2, line3;
    var winSound;
    
    var explode;
    var animate;
    var spawner;
    
    var fw1Sound;
    var fw2Sound;
    var fw3Sound;    

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#020041';
        
/*        line1 = game.add.sprite(0, 150, 'line');
        line1.alpha = 0.05;
        line2 = game.add.sprite(0, 350, 'line');
        line2.alpha = 0.05;
        line3 = game.add.sprite(0, 500, 'line');
        line3.alpha = 0.05;
*/
        //gradient overlay
        game.add.sprite(0,0,'over');
        
        winSound = game.add.audio('win');
        fw1Sound = game.add.audio('fw1');
        fw2Sound = game.add.audio('fw2');
        fw3Sound = game.add.audio('fw3');           
        
        //make fireworks
        spawner = game.time.events.loop(Phaser.Timer.SECOND, makeFirework, this);
        fireworkGroup = game.add.group();
        fireworkGroup.enableBody = true;
        
        //foreground image
        game.add.sprite(0, 500, 'fg');
        
        //text
        message = game.add.text(10, game.world.height-24, 'Put on a firework show by clicking on the fireworks', { fill: '#fff' });
        message.fontSize = 15;
        message.font = 'Arial'; 

        myText = game.add.text(10, 10, 'Time Left: ' + time, { fill: '#fff' });
        myText.fontSize = 15;
        myText.font = 'Arial'; 
        
        scoreText = game.add.text(10, 40, 'Score: ' + score, { fill: '#fff' });
        scoreText.fontSize = 15;
        scoreText.font = 'Arial';         
        
        //mouse input
        game.input.onDown.add(click, this);
    }

    function update() { 
        fireworkGroup.forEach(checkPos, this);
              
        if(time > 0){
            time--;
        }
        myText.text = 'Time Left: ' + time;
        if(time == 0){
            endGame = true;
            myText.text = 'Great Show!';
            myText.fontSize = 20;
        }
    }
    
    function click(pointer) {
        if(endGame == true){
            winSound.play();           
        }
    }

    
    function hasClicked(firework){
        //message.text = 'firework click: x = ' + firework.x + ' y = '+ firework.y;
        if(endGame == false){
            var aniRnd = game.rnd.between(1, 3);
            if(firework.y < 500){  
                firework.kill();
                if(firework.y < 150){
                    fw2Sound.play();
                    score = score + 10; 
                    message.text = 'Amazing!';
                    if(aniRnd == 1){
                        explode = game.add.sprite(firework.x-142, firework.y-142, 'f3_r');  
                        animate = explode.animations.add('f3rAction');     
                        explode.animations.play('f3rAction', 30, false, true);  
                        game.stage.backgroundColor = '#410000';
                    }
                    else if(aniRnd == 3){
                        explode = game.add.sprite(firework.x-142, firework.y-142, 'f3_b');  
                        animate = explode.animations.add('f3bAction');     
                        explode.animations.play('f3bAction', 30, false, true);   
                        game.stage.backgroundColor = '#020041';
                    }
                    else{
                        explode = game.add.sprite(firework.x-142, firework.y-142, 'f3_w');  
                        animate = explode.animations.add('f3wAction');     
                        explode.animations.play('f3wAction', 30, false, true); 
                        game.stage.backgroundColor = '#424242';
                    }                       
                }
                else if(firework.y < 350){
                    fw1Sound.play();
                    score = score + 5; 
                    message.text = 'So pretty!';
                    if(aniRnd == 1){
                        explode = game.add.sprite(firework.x-107, firework.y-107, 'f2_o');  
                        animate = explode.animations.add('f2oAction');     
                        explode.animations.play('f2oAction', 30, false, true);
                        game.stage.backgroundColor = '#4d2f00';
                    }
                    else if(aniRnd == 3){
                        explode = game.add.sprite(firework.x-107, firework.y-107, 'f2_p');  
                        animate = explode.animations.add('f2pAction');     
                        explode.animations.play('f2pAction', 30, false, true); 
                        game.stage.backgroundColor = '#2a004d';
                    }
                    else{
                        explode = game.add.sprite(firework.x-107, firework.y-107, 'f2_w');  
                        animate = explode.animations.add('f2wAction');     
                        explode.animations.play('f2wAction', 30, false, true); 
                        game.stage.backgroundColor = '#424242';
                    }                    
                }
                else if(firework.y < 500){
                    fw3Sound.play();
                    score = score + 1; 
                    message.text = 'Nice!';
                    if(aniRnd == 1){
                        explode = game.add.sprite(firework.x-68, firework.y-68, 'f1_g');  
                        animate = explode.animations.add('f1gAction');     
                        explode.animations.play('f1gAction', 30, false, true); 
                        game.stage.backgroundColor = '#004d0e';
                    }
                    else if(aniRnd == 3){
                        explode = game.add.sprite(firework.x-68, firework.y-68, 'f1_y');  
                        animate = explode.animations.add('f1yAction');     
                        explode.animations.play('f1yAction', 30, false, true);
                        game.stage.backgroundColor = '#4d4c00';
                        
                    }
                    else{
                        explode = game.add.sprite(firework.x-68, firework.y-68, 'f1_w');  
                        animate = explode.animations.add('f1wAction');     
                        explode.animations.play('f1wAction', 30, false, true); 
                        game.stage.backgroundColor = '#424242';
                    }
                }  
            }
            else{
                message.text = 'Too low to see!';
                score = score - 3; 
            }   
        }
        scoreText.text = 'Score: ' + score;
    }  
    
    function makeFirework(){
        //message.text = 'make firework';
        
        var firework = fireworkGroup.create(game.rnd.between(5,355), 630, 'firework');
        firework.body.velocity.y = -(game.rnd.between(70,200));
        game.physics.arcade.enable(firework);
        firework.body.setSize(20,20);
        firework.inputEnabled = true;
        firework.events.onInputDown.add(hasClicked, this);       
    }

    function checkPos (firework) {
        if (firework.y < -16)
        {
            firework.kill();
            //message.text = 'MISS';
        }

    }    

};
