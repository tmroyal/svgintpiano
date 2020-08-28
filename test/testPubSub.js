import PubSub from '../src/pubsub'

// very basic tests. 
// chose no testing frame work
// for a 200 line library.

function noop(){}


console.assert(PubSub, "pubsub imported");


console.assert((()=>{
  const ps = new PubSub();

  const res = ps.subscribe("you", noop);

  return res == null;
})(), "Creating a pubsub with no events cannot add events");


console.assert((()=>{
  const ps = new PubSub(["et"]);

  const res = ps.subscribe("et", noop);

  return res != null && typeof res == "string"
})(), "Subscribing to event returns string id");


console.assert((()=>{
  const ps = new PubSub("et");

  const res = ps.subscribe("et", noop);

  return res != null && typeof res == "string"
})(), "Initiating with one string results in a pubsub that takes one event");


console.assert((()=>{
  const ps = new PubSub(["et"]);

  let res = false;
  const cb = function(v){
    res = v;
  }

  ps.subscribe("et", cb);
  ps.trigger("et", true)

  return res == true;
})(), "Pubsub triggers events");


console.assert((()=>{
  const ps = new PubSub(["et"]);

  let res1 = false;
  const cb1 = function(v){
    res1 = v;
  }
  let res2 = false;
  const cb2 = function(v){
    res2 = v;
  }

  ps.subscribe("et", cb1);
  ps.subscribe("et", cb2);
  ps.trigger("et", true)

  return res1 == true && res2 == true;
})(), "Pubsub triggers multilple events");


console.assert((()=>{
  const ps = new PubSub(["et"]);

  let res1 = false;
  const cb1 = function(v){
    res1 = v;
  }
  let res2 = false;
  const cb2 = function(v){
    res2 = v;
  }

  var id = ps.subscribe("et", cb1);
  ps.subscribe("et", cb2);

  ps.unsubscribe("et", id);
  ps.trigger("et", true)

  return res1 == false && res2 == true;
})(), "Pubsub can unsub with an id and event name");

