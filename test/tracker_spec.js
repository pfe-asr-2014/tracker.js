describe('Tracker', function(){
  var t;
  describe('Initialization', function(){

    it('default the tracker distant URL to be the current URL', function(){
      t = new Tracker();
      expect(t.distant).toBe(location);
    });

    it('let specify the tracker distant URL', function(){
      t = new Tracker("https://distant.url");
      expect(t.distant).toBe("https://distant.url")
    });

  });

  describe('on', function(){
    var el;
    beforeAll(function(){
      el = document.createElement('p');
      el.classList.add('selector');
      document.body.appendChild(el);
    });

    it('return an object with a track function.', function(){
      expect(t.on('.selector').track).toBeDefined();
    });

    it('accept a HTMLElement', function(){
      expect(function(){
        t.on(el);
      }).not.toThrow();
    });

    it('accept a string selector', function(){
      expect(function(){
        t.on('.selector');
      }).not.toThrow();
    });

    it('throw an error if the selector has no results', function(){
      expect(function(){
        t.on('#dontExist');
      }).toThrow();
    });
  });

  describe('send', function(){

  });
});

describe('EventTracker', function(){
  beforeAll(function(){
    var el = document.createElement('p');
    el.classList.add('sel');
    document.body.appendChild(el);
  });

  beforeEach(function(){
    t = new Tracker();
  });

  describe('track', function(){

    it('need to specify what the record should be of', function(){
      expect(function(){ t.on('.selector').track(); })
      .toThrow(new Error("An event must be passed to #track."));
    });

    it('accept only some events', function(){
      var events = {click:true, dontExist: false};

      Object.getOwnPropertyNames(events).forEach(function (e) {
        var val = Object.getOwnPropertyDescriptor(events, e).value;

        var ex = expect(function(){ t.on('.sel').track(e) });
        if(val) {
          ex = ex.not;
        }
        ex.toThrow(new Error(e + " not supported."));
      });
    });
  });

  describe('send the event to the distant server', function(){

  });
});
