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
        game.load.image('lose', 'assets/lose.png');
        game.load.image('win', 'assets/win.png');
        game.load.image('message', 'assets/msg.png');
        game.load.image('bg', 'assets/bg.png');
        game.load.audio('buzz', 'assets/phone.wav');
        game.load.audio('gasp', 'assets/gasp.wav');
        game.load.audio('beep', 'assets/beep.wav');
    }
    
    var button;
    var background;
    var count = 2500;
    var title;
    var myText;
    var win = false;
    var itemGroup;
    var x = game.rnd.between(0, 700);
    var y = game.rnd.between(100, 500);
    var lost;
    var win;
    var test;
    var item;
    var sound;
    var gasp;
    var beep;
    var hasPlayed = false;

    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //game.stage.backgroundColor = '#e7e7e7';
        game.add.sprite(0, 0, 'bg');
        
        //sound
        sound = game.add.audio('buzz');
        sound.play();
        
        gasp = game.add.audio('gasp');
        beep = game.add.audio('beep');
        
        //add button
        button = game.add.button(x, y, 'phone', actionOnClick, this, 0, 1, 2);
        button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);      

        
        //add items
        itemGroup = game.add.group();
        for (var i = 0; i < 40; i++)
        {
            if(i == 1){
                 item = itemGroup.create(x-50, y-50, 'stuff', game.rnd.between(0, 19));
                item.inputEnabled = true;
                item.input.enableDrag();
                item.events.onDragStart.add(onDragStart, this);
                item.events.onDragStop.add(onDragStop, this);             
            }
            item = itemGroup.create(game.rnd.between(-50, 700), game.rnd.between(0, 500), 'stuff', game.rnd.between(0, 19));
            item.inputEnabled = true;
            item.input.enableDrag();
            item.events.onDragStart.add(onDragStart, this);
            item.events.onDragStop.add(onDragStop, this);  
        }       
        
        //add text
        title = game.add.text(16, 16, 'Find your phone before you miss the call', { fontSize: '32px', fill: '#000' }); 
        myText = game.add.text(16, 50, 'Time: 0', { fontSize: '32px', fill: '#000' });       
        
    }

    function update() {
        if(count != 0 && win == false){
            count = count-1;
            myText.text = 'Time: ' + count;                      
        }
        if(count == 0){
            title.text = 'You missed the call...';
            myText.text = 'You lose :(';  
            button.kill();
            lost = game.add.sprite(x, y, 'lose');
            sound.stop();
            if(hasPlayed == false){
                gasp.play();
                hasPlayed = true;
            }
        }
 
    }
    function up() {
        console.log('button up', arguments);
    }

    function over() {
        console.log('button over');
    }

    function out() {
        console.log('button out');
    }

    function actionOnClick () {

        //background.visible =! background.visible;
        //count += 1;
       
        win = true;
        if(count != 0){
            beep.play();
            title.text = 'You found it!';
            myText.text = 'YOUR SCORE IS: ' + count;
            button.kill();
            win = game.add.sprite(x, y, 'win');  
            win = game.add.sprite(x+50, y-40, 'message');
            sound.stop();
        }
    }

    function onDragStart(sprite, pointer) {

        result = "Dragging " + sprite.key;

    }

    function onDragStop(sprite, pointer) {

        result = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;

    }    
};
