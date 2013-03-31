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
    fixDef.density = 5.0;
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
  },
});

Crafty.c("PhysicsWorld", {
  timeStep: 1.0/60,
  iteration: 1,
  fx: 0,
  fy: 0,
  force: null,

  init: function() {
    this.requires("2D, Canvas, Mouse");
    this.attr({w: 600, h: 500});
    
    // Create wind vector on click
    this.bind("MouseDown", function(event) {
      console.log("TEST 1");
      console.log("mouse x: " + (event.x - 390) + ", mouse y: " + (event.y - 5));

      boat = bodies["boat"].GetBody();
      console.log(boat.GetMass());
      var Bx = boat.GetPosition().x;
      var By = boat.GetPosition().y;
      console.log("boat x: " + boat.GetPosition().x + " boat y: " + boat.GetPosition().y);
      var Mx = event.x - 390;
      var My = event.y - 5;

      var fc = 10000;
      var hypotenuse = Math.sqrt((Bx-Mx)*(Bx-Mx) + (By-My) * (By-My));
      console.log("hypotenuse is " + hypotenuse);

      var xSide = (Bx - Mx);
      var ySide = (By - My);
      console.log("y side is " + ySide);
      var theta = Math.asin(ySide/hypotenuse);
      console.log("theta is " + theta);
      
      this.fx = fc * hypotenuse * Math.cos(theta);
      this.fy = fc * hypotenuse * Math.sin(theta);
      if (Mx > Bx) {
        this.fx = -this.fx;
      }
 
      force = new b2Vec2(this.fx, this.fy);
      console.log("MouseDown force: " + force.x);

      boat.ApplyForce(force, boat.GetPosition());
      console.log("   ");
    });

    //Stop the force from going once the mouse is let up
    this.bind("MouseUp", function(event) {
      force = new b2Vec2(0, 0);
      console.log("MouseUp force: " + force.x);
    });
    
    // Step the world each frame
    this.bind("EnterFrame", function() {
    	world.Step(this.timeStep, this.iteration);
    });
  },
});

// Main scene
Crafty.scene("main", function() {
  var boat = Crafty.e("Boat");
  var world = Crafty.e("PhysicsWorld");
});

window.onload = function () {
  Crafty.init(600, 500);
  Crafty.canvas.init();
  Crafty.background("rgb(0,0,255)");
  
  // Start the main scene
  Crafty.scene("main");
};