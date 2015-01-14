describe('Tracker', function(){
  var t;
  describe('Initialization', function(){
    it('default the tracker distant URL to be the current URL', function(){
      t = new Tracker();
      expect(t.distant).toBe(location);
    });

    it('let specify the tracker distant URL', function(){
      t = new Tracker({distant:"https://distant.url"});
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
    var baseTime = new Date('1990-04-17T00:00:00.000Z')

    beforeEach(function() {
      t = new Tracker({distant:"https://distant.url"});
      jasmine.Ajax.install();
      jasmine.clock().install();
      jasmine.clock().mockDate(baseTime);
    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
      jasmine.clock().uninstall();
    });

    it('need a correctly formated event.', function(){
      var send = function(params) {
        return function() {
          t.send(params);
        };
      };

      // Correctly formated
      expect(send({
        'category': 'mooc',
        'action'  : 'click',
        'label'   : 'my link title'
      })).not.toThrow();

      // Malformed events (all three fields are required)
      expect(send({
        'category': 'mooc'
      })).toThrow();
      expect(send({
        'action': 'click'
      })).toThrow();
      expect(send({
        'label': 'my link title'
      })).toThrow();

      expect(send({
        'category': 'mooc',
        'action': 'click'
      })).toThrow();
      expect(send({
        'action': 'click',
        'label': 'my link title'
      })).toThrow();
      expect(send({
        'category': 'mooc',
        'label': 'my link title'
      })).toThrow();
    });

    it('send via XHR the event to the distant URL', function(){
      t.send({
        'category': 'mooc',
        'action'  : 'click',
        'label'   : 'my link title'
      });
      expect(jasmine.Ajax.requests.count()).toBe(1);

      var request = jasmine.Ajax.requests.mostRecent();
      var json = JSON.parse(request.params);

      expect(request.url).toBe('https://distant.url');
      expect(json.category).toBe('mooc');
      expect(json.action).toBe('click');
      expect(json.label).toBe('my link title');
      expect(json.datetime).toBe('1990-04-17T00:00:00.000Z');
    });

    it('if it failed it try again based on the config', function(){
      t.send({
        'category': 'mooc',
        'action'  : 'click',
        'label'   : 'my link title'
      });
      var r1 = lastRequest();
      r1.respondWith(MockResponses.failure);
      var r2 = lastRequest();
      r2.respondWith(MockResponses.failure);
      var r3 = lastRequest();
      r3.respondWith(MockResponses.failure);
      var r4 = lastRequest();

      // No more than 3 try (t.tryAgain = 3)
      expect(jasmine.Ajax.requests.count()).toBe(3);
    });
  });
});

describe('EventTracker', function(){
  var el;
  beforeAll(function(){
    el = document.createElement('p');
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
    it('pass the event to send when it has occured', function(){
      t.on(el).track('click');
      spyOn(t, 'send');

      fireEvent(el, 'click');
      expect(t.send).toHaveBeenCalled();
    });
  });
});
