// Physics imports
var b2Vec2 = Box2D.Common.Math.b2Vec2
  , b2AABB = Box2D.Collision.b2AABB
	,	b2BodyDef = Box2D.Dynamics.b2BodyDef
	,	b2Body = Box2D.Dynamics.b2Body
	,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
	,	b2Fixture = Box2D.Dynamics.b2Fixture
	,	b2World = Box2D.Dynamics.b2World
	,	b2MassData = Box2D.Collision.Shapes.b2MassData
	,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
	,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
	,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
  , b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
;

// Set up box2d world
var world = new b2World(new b2Vec2(0, 0), true);

// Global reference to bodies
var bodies = {};

// Components
Crafty.c("Boat", {
  speed: 1,
  init: function() {
    this.requires("2D, Canvas, Color")
      .color('rgb(255,0,0)')
      .attr({w: 20, h: 50, x: 50, y: 50})
      .origin("center");
    
    // Create box2d box to handle physics    
    // Box fixture
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(this.w, this.h);
    
    // Box body
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = this.x;
    bodyDef.position.y = this.y;
    
    // Add box to the world and keep global reference in bodies
    bodies["boat"] = world.CreateBody(bodyDef).CreateFixture(fixDef);
    
    // Match sprite's position and angle with the box2d body
    this.bind("EnterFrame", function() {
      position = bodies["boat"].GetBody().GetPosition();
      angle = bodies["boat"].GetBody().GetAngle();
      this.x = position.x;
      this.y = position.y;
      this.rotation = angle;
    });
  }
});

Crafty.c("PhysicsWorld", {
  timeStep: 1.0/60,
  iteration: 1,
  init: function() {
    this.requires("2D, Canvas, Mouse");
    this.attr({w: 600, h: 500});
    
    // Create wind vector on click
    this.bind("MouseDown", function(event) {
      console.log("mouse x: " + event.x + ", mouse y: " + event.y);
      boat = bodies["boat"].GetBody();
      force = new b2Vec2(10000, 10000);
      boat.ApplyForce(force, boat.GetPosition());
    });
    
    // Step the world each frame
    this.bind("EnterFrame", function() {
    	world.Step(this.timeStep, this.iteration);
    });
  }
});

// Main scene
Crafty.scene("main", function() {
  var world = Crafty.e("PhysicsWorld");
  var boat = Crafty.e("Boat");
});

window.onload = function () {
  Crafty.init(600, 500);
  Crafty.canvas.init();
  Crafty.background("rgb(0,0,255)");
  
  // Start the main scene
  Crafty.scene("main");
};