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
    
    var game = new Phaser.Game(1000, 300, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );

    
    
    function preload() {
        game.load.spritesheet('phone', 'assets/phone.png', 60, 60);
        game.load.spritesheet('stuff', 'assets/items.png', 180, 180);
        game.load.image('background','assets/bg.png');
        game.load.image('obj1', 'assets/lose.png');
        game.load.image('obj2', 'assets/win.png');

    }   
    
    var player;
    var cursors;
    var enemy;
    var boss;
    
    var hp = 100;
    var str = game.rnd.between(0,5);
    
    var myText;
    var message;


    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, 1000 , 300, 'background');
        
        player = game.add.sprite(30, 150, 'obj1');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        
        //enemy = game.add.sprite(700, 150, 'obj2');
       // game.physics.arcade.enable(enemy);
        
        //enemy2 = game.add.sprite(600, 150, 'obj2');
        //game.physics.arcade.enable(enemy2);
        
        enemy = game.add.group();
        enemy.enableBody = true;
        
        for (var i = 0; i < 9; i++){
            if(i%2 == 0){
                var e = enemy.create(200+(i*65), 40, 'obj2');                 
            }
            else{
                var e = enemy.create(200+(i*65), game.world.height-50, 'obj2');
            }

        }
        
        myText = game.add.text(10, 10, 'hp: '+hp + '   strength: ' + str, { fontSize: '10px', fill: '#000' });
        
        message = game.add.text(10, game.world.height-25, 'save the princess', { fontSize: '10px', fill: '#000' });
        message.fontSize = 15;
        message.font = 'Arial';
        
        
        
        
        
        
        
        
        
        
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
                
        //game.physics.arcade.collide(player, enemy);
        
        game.physics.arcade.collide(player, enemy, collisionHandler, bossTime, null, this);
        
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
    
    function collisionHandler (o1, o2) {

        // Removes the star from the screen
    //    enemy.kill();
        //  Add and update the score
        hp = hp - 1;
        myText.text = 'hp: '+hp + '   strength: ' + str;
        o1.body.velocity.x = 0;
        o2.body.velocity.x = 0;
        o2.kill();
    }   
    
    function bossTime (player, boss){
        

    }
 
};
