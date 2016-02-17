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
        game.load.spritesheet('button', 'assets/button.png', 50, 50);
        game.load.spritesheet('stuff', 'assets/fruitnveg.png', 32, 32);
        game.load.image('lose', 'assets/lose.png');
        game.load.image('win', 'assets/win.png');
        
    }
    
    var button;
    var background;
    var count = 500;
    var title;
    var myText;
    var win = false;
    var itemGroup;
    var x = game.rnd.between(0, 770);
    var y = game.rnd.between(100, 570);
    var lost;
    var win;

    function create() {
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#e7e7e7';
        
        //add button
        button = game.add.button(x, y, 'button', actionOnClick, this, 0, 1, 2);
        button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);      
        
        //add text
        title = game.add.text(16, 16, 'Find your phone before you miss the call', { fontSize: '32px', fill: '#000' }); 
        myText = game.add.text(16, 50, 'Count: 0', { fontSize: '32px', fill: '#000' }); 
        
        //add items
        itemGroup = game.add.group();
        for (var i = 0; i < 12; i++)
        {
            var item = itemGroup.create(game.rnd.between(0, 770), game.rnd.between(100, 570), 'stuff', game.rnd.between(0, 35));
            item.inputEnabled = true;
            item.input.enableDrag();
            item.events.onDragStart.add(onDragStart, this);
            item.events.onDragStop.add(onDragStop, this);  
        }        
    }

    function update() {
        if(count != 0 && win == false){
            count = count-1;
            myText.text = 'Count: ' + count;                      
        }
        if(count == 0){
            title.text = 'You missed the call...';
            myText.text = 'You lose :(';  
            button.kill();
            lost = game.add.sprite(x, y, 'lose');
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
            title.text = 'You found it :)';
            myText.text = 'YOUR SCORE IS: ' + count;
            button.kill();
            win = game.add.sprite(x, y, 'win');            
        }
    }

function onDragStart(sprite, pointer) {

    result = "Dragging " + sprite.key;

}

function onDragStop(sprite, pointer) {

    result = sprite.key + " dropped at x:" + pointer.x + " y: " + pointer.y;

}    

};
