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
        game.load.spritesheet('phone', 'assets/phone.png', 60, 60);
        game.load.spritesheet('stuff', 'assets/items.png', 180, 180);
        game.load.image('background','assets/background.png');
        game.load.image('obj1', 'assets/lose.png');
        game.load.image('obj2', 'assets/win.png');
        game.load.image('boss', 'assets/boss.png');
        game.load.image('item', 'assets/collect.png');
        game.load.image('bomb', 'assets/bomb.png');

    }   
    

    var cursors;
    var bg;
    var x = 30;
    var y = 150;

    var player;    
    var hp = 100;
    var str = game.rnd.between(0,5);
    
    var enemy;
    var items;
    var bombs;
    var bombTime = 0;
    var oldBombTime = 0;
    var boss;
    var bossHp = 100;

    var myText;
    var message;
    var bossText;


    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#e1e1e1';
          
        player = game.add.sprite(x, y, 'obj1');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        
        items = game.add.group();
        for (var i = 0; i < 3; i++){
            if(i == 0){
               var item = items.create(game.rnd.between(310, 650), game.rnd.between(20, 190), 'item'); 
            }
            else if(i == 1){
                var item = items.create(game.rnd.between(310, 650), game.rnd.between(190, 380), 'item'); 
            }    
            else{
                var item = items.create(game.rnd.between(310, 650), game.rnd.between(380, 600), 'item');
            }
            game.physics.arcade.enable(item);
        }         
        
        bombs = game.add.group();
        for (var i = 0; i < 5; i++){
            var b = bombs.create(game.rnd.between(200, 650), game.rnd.between(70, 600), 'bomb');
            game.physics.arcade.enable(b);
        } 

        enemy = game.add.group();
        for (var i = 0; i < 9; i++){
            var e;
            if(i < 9){
                if(i%2 == 0){
                    e = enemy.create(200, 40+(i*60), 'obj2');                 
                }
                else{
                    e = enemy.create(310, 20+(i*65), 'obj2');
                }
            }
                game.physics.arcade.enable(e);
        }
        for (var i = 0; i < 9; i++){
            var e;
            if(i < 9){
                if(i%2 == 0){
                    e = enemy.create(450, 40+(i*60), 'obj2');                 
                }
                else{
                    e = enemy.create(580, 20+(i*65), 'obj2');
                }
            }
                game.physics.arcade.enable(e);
        }        

        boss = game.add.sprite(game.world.width-100, game.world.height-350, 'boss');
        game.physics.arcade.enable(boss);        
       
        
        myText = game.add.text(10, 10, 'hero hp: '+hp + '   strength: ' + str, { fontSize: '10px', fill: '#000' });
        
        message = game.add.text(10, game.world.height-25, 'defeat the monsters and save the princess', { fontSize: '10px', fill: '#000' });
        message.fontSize = 15;
        message.font = 'Arial';
        
        bossText = game.add.text(610, 10, 'boss hp: '+bossHp , { fontSize: '10px', fill: '#000' });
        
           
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
                
        //game.physics.arcade.collide(player, enemy);
        
        game.physics.arcade.collide(player, enemy, enemyCollision, null, this);
        game.physics.arcade.collide(player, bombs, bombCollision, null, this);
        game.physics.arcade.collide(player, items, itemCollision, null, this);
        game.physics.arcade.collide(player, boss, bossTime);
        
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
           

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200;
        }

        if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
        }
        else if (cursors.down.isDown)
        {
            player.body.velocity.y = 200;
        }
  
    }
    
    function enemyCollision (o1, o2) {
        // Removes the star from the screen
    //    enemy.kill();
        //  Add and update the score
        hp = hp - 1;
        myText.text = 'hero hp: '+hp + '   strength: ' + str;
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
        if(bombTime == 50){
            o2.kill();
            bombTime = 0;
            message.text = 'Bomb Exploded.';
            hp = hp - 1;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;            
        }
        
        checkIfDead();
    } 
    
    function itemCollision (o1, o2) {
        message.text = 'collect item';
        o2.kill();
    }    
    
    function bossTime (player, boss){
        boss.body.velocity.x = 0;
        boss.body.velocity.y = 0;
        boss.body.mass = -100;
        boss.body.collideWorldBounds = true;
        if(str < 10){
            //player.kill();
            message.text = 'You were too weak.';
            hp = hp - 10;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;
            player.reset(x, y);
        }
        else{
            message.text = 'You defeated the demon king and saved your people.';
        }
        checkIfDead();
    }
    
    
    function checkIfDead(){
        if(hp <= 0){
            player.kill();
            hp = 0;
            myText.text = 'hero hp: '+hp + '   strength: ' + str;
            message.text = 'You failed.';
        }      
    }
};
