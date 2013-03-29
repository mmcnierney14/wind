// Set up box2d world
var worldAABB = new b2AABB();
worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
var gravity = new b2Vec2(0, 0);
var doSleep = true;
var world = new b2World(worldAABB, gravity, doSleep);

function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd);
}

// Components
Crafty.c("Boat", {
  speed: 1,
  init: function() {
    this.requires("2D, Canvas, Color")
      .color('rgb(255,0,0)')
      .attr({w: 20, h: 50, x: 50, y: 50})
      .origin("center");
    
    // Create box2d box to handle physics
    var boat_box = createBox(world, this.x, this.y, this.w, this.h, false);
    
    this.bind("EnterFrame", function() {
      position = boat_box.m_position;
      angle = boat_box.m_rotation;
      this.x = position.x;
      this.y = position.y;
      this.rotation = angle;
    });
  }
});

Crafty.c("physics_world", {
  timeStep: 1.0/60,
  iteration: 1,
  init: function() {
    this.requires("2D");
    
    this.visible = false;
    
    // Step the world each frame
    this.bind("EnterFrame", function() {
    	world.Step(this.timeStep, this.iteration);
    });
  }
});

// Main scene
Crafty.scene("main", function() {
  
  // Create the boat entity
  var world = Crafty.e("physics_world");
  var boat = Crafty.e("Boat");
    
});

window.onload = function () {
  Crafty.init(600, 500);
  Crafty.canvas.init();
  Crafty.background("rgb(0,0,255)");
  
  // Start the main scene
  Crafty.scene("main");
};