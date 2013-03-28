// Components
Crafty.c("Boat", {
  speed: 1,
  init: function() {
    this.requires("2D, Canvas, Color")
      .color('rgb(255,0,0)')
      .attr({w: 20, h: 20, x: 50, y: 50});
    
    this.bind("EnterFrame", function() {
      
    });
  }
});

// Main scene
Crafty.scene("main", function() {
  
  // Create the boat entity
  var boat = Crafty.e("Boat");
    
});

window.onload = function () {
  Crafty.init(600, 500);
  Crafty.canvas.init();
  Crafty.background("rgb(0,0,255)");
  
  // Start the main scene
  Crafty.scene("main");
};