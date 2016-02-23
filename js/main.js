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
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    function preload() {
        //background
        game.load.image('background','assets/background.png');        
        //characters
        game.load.spritesheet('hero', 'assets/player.png', 32, 32);
        game.load.image('enemy', 'assets/enemy.png');     
        //objects
        game.load.image('boss', 'assets/boss.png');
        game.load.image('item', 'assets/collect.png');
        game.load.image('bomb', 'assets/bomb.png');          
        //animations        
        game.load.spritesheet('fire', 'assets/fire.png', 110, 110, 28);
        game.load.spritesheet('cut', 'assets/slash.png', 110, 110, 30);
        game.load.spritesheet('buff', 'assets/Heal6.png', 100, 100, 30);
        game.load.spritesheet('attack1', 'assets/Attack1.png', 110, 110, 4);
        game.load.spritesheet('attack2', 'assets/Attack2.png', 110, 110, 10);
        game.load.spritesheet('attack3', 'assets/Attack3.png', 110, 110, 10);
        game.load.spritesheet('attack4', 'assets/Attack4.png', 110, 110, 10);      
        game.load.spritesheet('end', 'assets/Gun2.png', 110, 110, 25);  
        game.load.spritesheet('dead', 'assets/Light6.png', 110, 110, 30); 
    }   
      
    var cursors;
    var bg;
    //player info
    var x = 30;
    var y = 150; 
    var player;    
    var hp = 100;
    var str = game.rnd.between(0,5);    
    //boss info
    var boss;
    var bossHp = 100;    
    //items
    var enemy;
    var items;
    var bombs;
    var bombTime = 0;
    var oldBombTime = 0;    
    //text
    var myText;
    var message;
    var bossText;
    //animations
    var explode;
    var animate;

    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#e1e1e1';
        game.add.sprite(0,0,'background');
        
        //player
        player = game.add.sprite(x, y, 'hero');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;  
        player.animations.add('right', [3, 4, 5], 10, true);
        player.animations.add('up', [9, 10, 11], 10, true);
        player.animations.add('down', [0, 1, 2], 10, true);
        player.animations.add('left', [6, 7, 8], 10, true);        
        
        //items
        items = game.add.group();
        for (var i = 0; i < 3; i++){
            var item = items.create(400, 60+(230*i), 'item');
            game.physics.arcade.enable(item);
        }   
        
        //bombs
        bombs = game.add.group();
        for (var i = 0; i < 8; i++){
            if(i%2 == 0){
                var b = bombs.create(320, game.rnd.between(70, 550), 'bomb');
            }
            else{
                var b = bombs.create(600, game.rnd.between(70, 550), 'bomb');
            }
            game.physics.arcade.enable(b);
        } 
        
        //enemies
        enemy = game.add.group();
        for (var i = 0; i < 9; i++){
            var e;
            if(i < 9){
                if(i%2 == 0){
                    e = enemy.create(200, 40+(i*60), 'enemy');                 
                }
                else{
                    e = enemy.create(310, 20+(i*65), 'enemy');
                }
            }
                game.physics.arcade.enable(e);
        }
        for (var i = 0; i < 9; i++){
            var e;
            if(i < 9){
                if(i%2 == 0){
                    e = enemy.create(450, 40+(i*60), 'enemy');                 
                }
                else{
                    e = enemy.create(580, 20+(i*65), 'enemy');
                }
            }
                game.physics.arcade.enable(e);
        }        
        
        //boss
        boss = game.add.sprite(game.world.width-100, game.world.height-350, 'boss');
        game.physics.arcade.enable(boss);        
       
        //text
        myText = game.add.text(10, 10, 'hero hp: '+hp + '   strength: ' + str, { fontSize: '10px', fill: '#000' });       
        
        message = game.add.text(10, game.world.height-25, 'Are you lucky enough to be the hero?', { fontSize: '10px', fill: '#000' });
        message.fontSize = 15;
        message.font = 'Arial';   
        
        bossText = game.add.text(610, 10, 'boss hp: '+bossHp , { fontSize: '10px', fill: '#ff0000' });
        
           
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
                        
        game.physics.arcade.collide(player, enemy, enemyCollision, null, this);
        game.physics.arcade.collide(player, bombs, bombCollision, null, this);
        game.physics.arcade.collide(player, items, itemCollision, null, this);
        game.physics.arcade.collide(player, boss, bossTime);
        
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
           

        if (cursors.left.isDown){
            player.body.velocity.x = -200;
            player.animations.play('left');
        }
        else if (cursors.right.isDown){
            player.body.velocity.x = 200;
            player.animations.play('right');
        }
        else if (cursors.up.isDown){
            player.body.velocity.y = -200;
            player.animations.play('up');
        }
        else if (cursors.down.isDown){
            player.body.velocity.y = 200;
            player.animations.play('down');
        }
        else{
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }        
  
    }
    
    function enemyCollision (o1, o2) {
        var ani = game.rnd.between(1, 100);
        if(ani <= 25){
            explode = game.add.sprite(o2.x-30, o2.y-30, 'attack2');                
            animate = explode.animations.add('atkAction');     
            explode.animations.play('atkAction', 30, false);            
        }
        else if(ani <= 50){
            explode = game.add.sprite(o2.x-30, o2.y-30, 'attack3');                
            animate = explode.animations.add('atkAction');     
            explode.animations.play('atkAction', 30, false);            
        }
        else if(ani <= 75){
            explode = game.add.sprite(o2.x-30, o2.y-30, 'attack4');                
            animate = explode.animations.add('atkAction');     
            explode.animations.play('atkAction', 30, false);            
        }
        else{
            explode = game.add.sprite(o2.x-30, o2.y-30, 'attack1');                
            animate = explode.animations.add('atkAction');     
            explode.animations.play('atkAction', 30, false); 
        } 
        var dmg = game.rnd.between(1, 5);
        hp = hp - dmg;
        myText.text = 'hero hp: '+hp + '   strength: ' + str;
        message.text = 'Damage Taken: ' + dmg;
        o1.body.velocity.x = 0;
        o2.body.velocity.x = 0;
        o2.kill();
        checkIfDead();
    }   
    
    function bombCollision (o1, o2) {
        //hp = hp - 1;
        //myText.text = 'hp: '+hp + '   strength: ' + str;
        
        o2.body.velocity.x = 0;
        o2.body.velocity.y = 0;
        o2.body.mass = -200;
        o2.body.collideWorldBounds = true;
        message.text = 'bomb time: ' + bombTime;
        bombTime = bombTime + 1;
        if(bombTime == 20){
            explode = game.add.sprite(o2.x-20, o2.y-50, 'fire');                
            animate = explode.animations.add('fireAction');     
            explode.animations.play('fireAction', 40, false);            
            o2.kill();
            bombTime = 0;
            message.text = 'Bomb Exploded.';
            hp = hp - 1;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;            
        }
        
        checkIfDead();
    } 
    
    function itemCollision (o1, o2) {
        explode = game.add.sprite(o2.x-40, o2.y-25, 'buff');                
        animate = explode.animations.add('buffAction');     
        explode.animations.play('buffAction', 50, false);           
        
        message.text = 'collect item';
        o2.kill();
    }    
    
    function bossTime (o1, o2){
        o2.body.velocity.x = 0;
        o2.body.velocity.y = 0;
        o2.body.mass = -100;
        o2.body.collideWorldBounds = true;
        
        explode = game.add.sprite(o2.x, o2.y, 'cut');                
        animate = explode.animations.add('cutAction');     
        explode.animations.play('cutAction', 40, false);     
        bossHp = bossHp - str;
        bossText.text = 'boss hp: ' + bossHp;
        if(str < 10){
            
            //player.kill();
            message.text = 'You were too weak.';
            hp = hp - 10;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;
            
        }
        else{
            message.text = 'You defeated the demon king and saved your people.';
            o2.kill();
              
        }
        checkIfDead();
        o1.reset(x, y);
    }
    
    
    function checkIfDead(){
        if(hp <= 0){
            explode = game.add.sprite(player.x-30, player.y-30, 'dead');                
            animate = explode.animations.add('deadAction');     
            explode.animations.play('deadAction', 70, false);               
            player.kill();
            hp = 0;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;
            message.text = 'You failed.';
        }      
    }
};
