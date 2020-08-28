// simple ad hoc pubsub
// designed only for this use case
// so as to remain dependency free

export default class PubSub {

  constructor(eventNames){
    this.eventNames = eventNames || [];
    this.events = {};
    this.nextId = 0;

    if (this.eventNames.constructor != Array){
      this.eventNames = [this.eventNames];
    }

    this.eventNames.forEach((eventName)=>{
      this.events[eventName] = [];
    });
  }
  subscribe(eventName, func){ 
    if (!this.eventNames.includes(eventName)){
      return null;
    } else {
      this.nextId += 1;

      this.events[eventName].push({
        id: this.nextId,
        func: func
      });
      
      return String(this.nextId);
    }
  }

  unsubscribe(eventName, key){
    if (!this.eventNames.includes(eventName)){
      return false;
    } else {
      const ind = this.events[eventName].findIndex((ev)=>{
        return ev.id == key;
      });

      if (ind >= 0){
        this.events[eventName].splice(ind, 1);
        return true
      } else {
        return false;
      }
    }
  }

  trigger(eventName, arg){
    if (this.eventNames.includes(eventName)){
      this.events[eventName].forEach((ev)=>{
          ev.func(arg);
      });
    }
  }

}