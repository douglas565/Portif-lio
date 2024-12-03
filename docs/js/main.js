

$(document).ready(function () {
  var input = $('.field').find('input, textarea');
  input.keyup(function () {
    inputTest(this);
  });
});

function inputTest(that) {
  var field = $(that).closest('.field');
  var form = $(that).closest('form, .form');
  var length = $.trim($(that).val()).length;

  //  FILLED
  if (length > 0) field.addClass('filled'); else field.removeClass('filled');

  //  VALIDATED
  if (length >= 4) {
    field.addClass('validated');
    form.addClass('validated');
  } else {
    field.removeClass('validated');
    form.removeClass('validated');
  }
}
var Timer = {
  length: null,
  time: null,
  selector: null,
  interval: null,
  callback: null,

  //  RUN
  run: function (selector, callback, length) {
    Timer.length = length;
    Timer.time = Timer.length;
    Timer.selector = selector;
    Timer.callback = callback;
    $(Timer.selector).text(Timer.length);
    Timer.interval = setInterval(Timer.count, 1000);
  },

  //  COUNT
  count: function () {
    Timer.time = Timer.time - 1;
    $(Timer.selector).text(Timer.time);
    if (Timer.time <= 0) {
      if (typeof Timer.callback === 'function' && Timer.callback) Timer.callback();
      Timer.reset();
    }
  },

  //  RESET
  reset: function () {
    clearInterval(Timer.interval);
    Timer.length = null;
    Timer.time = null;
    Timer.selector = null;
    Timer.interval = null;
    Timer.callback = null;
  }
};
var Identity = {
  duration: 1400,
  delay: 500,
  iteration: 0,
  processing: false,
  enough: false,
  interval: null,
  callback: null,
  status: 'loading',
  id: '#identity',
  selector: '#identity div',
  classes: 'working rest robot',

  //  WORK
  work: function () {
    if (Identity.status != 'loading') Identity.status = 'working';
    Identity.wait(function () {
      $(Identity.id).addClass('working');
    });
  },

  //  ROBOT
  robot: function () {
    Identity.status = 'robot';
    Identity.wait(function () {
      $(Identity.id).addClass('robot');
    });
  },

  //  REST
  rest: function () {
    Identity.abort();
    Identity.status = 'rest';
    setTimeout(function () {
      Identity.abort();
      $(Identity.id).addClass('rest');
    }, Identity.delay);
  },

  //  WAIT
  wait: function (call) {
    if (Identity.processing != true) {
      Identity.abort();
      Identity.processing = true;

      setTimeout(function () {
        if (typeof call === 'function' && call) call();
        Identity.waiting();
        Identity.interval = setInterval(Identity.waiting, Identity.duration);
      }, Identity.delay);
    }
  },

  //  WAITING
  waiting: function () {
    if (Identity.enough != true) {
      ++Identity.iteration;
      return;
    }

    Identity.stopping();
  },

  //  STOP
  stop: function (callback) {
    setTimeout(function () {
      if (Identity.processing == true) {
        Identity.enough = true;
        Identity.callback = callback;

        $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
      }
    }, Identity.delay);
  },

  //  STOPPING
  stopping: function () {
    clearInterval(Identity.interval);
    Identity.rest();

    if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
    Identity.reset();
  },

  //  ABORT
  abort: function () {
    if (Identity.status == 'robot') $(Identity.id).removeClass('robot'); else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading'); else $(Identity.id).removeClass(Identity.classes);
  },

  //  RESET
  reset: function () {
    Identity.iteration = 0;
    Identity.processing = false;
    Identity.enough = false;
    Identity.interval = null;
    Identity.callback = null;

    $(Identity.selector).removeAttr('style');
  }
};
var Stars = {
  canvas: null,
  context: null,
  circleArray: [],
  colorArray: ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'],

  mouseDistance: 50,
  radius: .5,
  maxRadius: 1.5,

  //  MOUSE
  mouse: {
    x: undefined,
    y: undefined,
    down: false,
    move: false
  },

  //  INIT
  init: function () {
    this.canvas = document.getElementById('stars');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.display = 'block';
    this.context = this.canvas.getContext('2d');

    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('resize', this.resize);

    this.prepare();
    this.animate();
  },

  //  CIRCLE
  Circle: function (x, y, dx, dy, radius, fill) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.minRadius = this.radius;

    this.draw = function () {
      Stars.context.beginPath();
      Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      Stars.context.fillStyle = fill;
      Stars.context.fill();
    };

    this.update = function () {
      if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
      if (this.y + this.radius > Stars.canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

      this.x += this.dx;
      this.y += this.dy;

      //  INTERACTIVITY
      if (Stars.mouse.x - this.x < Stars.mouseDistance && Stars.mouse.x - this.x > -Stars.mouseDistance && Stars.mouse.y - this.y < Stars.mouseDistance && Stars.mouse.y - this.y > -Stars.mouseDistance) {
        if (this.radius < Stars.maxRadius) this.radius += 1;
      } else if (this.radius > this.minRadius) {
        this.radius -= 1;
      }

      this.draw();
    };
  },

  //  PREPARE
  prepare: function () {
    this.circleArray = [];

    for (var i = 0; i < 1200; i++) {
      var radius = Stars.radius;
      var x = Math.random() * (this.canvas.width - radius * 2) + radius;
      var y = Math.random() * (this.canvas.height - radius * 2) + radius;
      var dx = (Math.random() - 0.5) * 1.5;
      var dy = (Math.random() - 1) * 1.5;
      var fill = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

      this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
    }
  },

  //  ANIMATE
  animate: function () {
    requestAnimationFrame(Stars.animate);
    Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);

    for (var i = 0; i < Stars.circleArray.length; i++) {
      var circle = Stars.circleArray[i];
      circle.update();
    }
  },

  //  MOUSE MOVE
  mouseMove: function (event) {
    Stars.mouse.x = event.x;
    Stars.mouse.y = event.y;
  },

  //  RESIZE
  resize: function () {
    Stars.canvas.width = window.innerWidth;
    Stars.canvas.height = window.innerHeight;
  }
};
var renderer, scene, camera, ww, wh, particles;

ww = window.innerWidth, wh = window.innerHeight;

var centerVector = new THREE.Vector3(0, 0, 0);
var previousTime = 0;
speed = 10;
isMouseDown = false;

var getImageData = function (image) {

  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  return ctx.getImageData(0, 0, image.width, image.height);
};

function getPixel(imagedata, x, y) {
  var position = (x + imagedata.width * y) * 4,
    data = imagedata.data;
  return { r: data[position], g: data[position + 1], b: data[position + 2], a: data[position + 3] };
}

var drawTheMap = function () {

  var geometry = new THREE.Geometry();
  var material = new THREE.PointCloudMaterial();
  material.vertexColors = true;
  material.transparent = true;
  for (var y = 0, y2 = imagedata.height; y < y2; y += 1) {
    for (var x = 0, x2 = imagedata.width; x < x2; x += 1) {
      if (imagedata.data[x * 4 + y * 4 * imagedata.width] > 0) {

        var vertex = new THREE.Vector3();
        vertex.x = x - imagedata.width / 2 + (500 - 440 * .5);
        vertex.y = -y + imagedata.height / 2;
        vertex.z = -Math.random() * 500;

        vertex.speed = Math.random() / speed + 0.015;

        var pixelColor = getPixel(imagedata, x, y);
        var color = "rgb(" + pixelColor.r + ", " + pixelColor.g + ", " + pixelColor.b + ")";
        geometry.colors.push(new THREE.Color(color));
        geometry.vertices.push(vertex);
      }
    }
  }
  particles = new THREE.Points(geometry, material);

  scene.add(particles);

  requestAnimationFrame(render);
};

var init = function () {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("yahia"),
    antialias: true,
    alpha: true
  });
  renderer.setSize(ww, wh);

  scene = new THREE.Scene();

  camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000);
  camera.position.set(0, -20, 4);
  camera.lookAt(centerVector);
  scene.add(camera);
  camera.zoom = 1;
  camera.updateProjectionMatrix();

  imagedata = getImageData(image);
  drawTheMap();

  window.addEventListener('mousemove', onMousemove, false);
  window.addEventListener('mousedown', onMousedown, false);
  window.addEventListener('mouseup', onMouseup, false);
  window.addEventListener('resize', onResize, false);
};
var onResize = function () {
  ww = window.innerWidth;
  wh = window.innerHeight;
  renderer.setSize(ww, wh);
  camera.left = ww / -2;
  camera.right = ww / 2;
  camera.top = wh / 2;
  camera.bottom = wh / -2;
  camera.updateProjectionMatrix();
};

var onMouseup = function () {
  isMouseDown = false;
};
var onMousedown = function (e) {
  isMouseDown = true;
  lastMousePos = { x: e.clientX, y: e.clientY };
};
var onMousemove = function (e) {
  if (isMouseDown) {
    camera.position.x += (e.clientX - lastMousePos.x) / 100;
    camera.position.y -= (e.clientY - lastMousePos.y) / 100;
    camera.lookAt(centerVector);
    lastMousePos = { x: e.clientX, y: e.clientY };
  }
};

var render = function (a) {

  requestAnimationFrame(render);

  particles.geometry.verticesNeedUpdate = true;
  if (!isMouseDown) {
    camera.position.x += (0 - camera.position.x) * 0.06;
    camera.position.y += (0 - camera.position.y) * 0.06;
    camera.lookAt(centerVector);
  }

  renderer.render(scene, camera);
};

var imgData = '  data:image/png;base64, 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';

var image = document.createElement("img");
image.src = imgData;
var Submit = {

  //  DATA
  data: function (template, fields) {
    var data = {};
    for (i = 0; i < fields.length; i++) {
      var field = $(fields[i]);
      var name = field.attr('name');
      var value = field.val().replace(/(?:\r\n|\r|\n)/g, '<br>');
      data[name] = value;
    }

    return data;
  },

  //  PUSH
  push: function (form) {
    var template = $('.template[data-template=' + form + ']');
    var fields = template.find('.field input, .field textarea');

    //  WAITING
    Submit.view('[data-status=waiting]', template);

    //  AJAX
    $.ajax({
      type: 'POST',
      url: 'includes/php/' + form + '.php',
      data: { dd: JSON.stringify(Submit.data(template, fields)) },
      dataType: 'json',
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        Submit.callback('error', form, template, fields);
      },
      success: function (data) {
        Submit.callback('success', form, template, fields);
      }
    });
  },

  //  CALLBACK
  callback: function (status, form, template, fields) {
    setTimeout(function () {

      //  SUCCESS
      if (status == 'success') {
        template.find('.form .status').removeClass('current');
        fields.closest('.field').fadeOut(700);
        fields.closest('.form').find('.submit').fadeOut(700);
        Identity.stop();

        if (form == 'secret') secretAvailability = false; else if (form == 'opinion') opinionAvailability = false;

        setTimeout(function () {
          fields.closest('.form').find('.submit').remove();
          fields.closest('.field').remove();
          template.find('.form .status[data-status=success]').addClass('current');
        }, 750);
      }

      //  ERROR
      else {
        Submit.view('[data-status=error]', template);
        setTimeout(function () {
          Submit.view(':not([data-status])', template);
        }, 6000);
      }
    }, 4000);
  },

  //	VIEW
  view: function (selector, template) {
    template.find('.form .status').removeClass('current');
    template.find('.form .status' + selector).addClass('current');
  },

  //	LISTEN
  listen: function (selector) {
    $(selector).on('click', function (e) {
      if ($(this).closest('.form').hasClass('validated')) {
        var form = $(this).attr('data-form');
        Submit.push(form);
      }

      e.preventDefault();
    });
  }
};
var Router = {
  wrapper: [],
  location: null,

  //	ROUTE
  route: function (location, callback) {
    Identity.work();
    Router.location = Router.processLocation(location);

    //	ROUTES
    Router.routes(callback);
  },

  //	PROCESS LOCATION
  processLocation: function (location) {
    if (location === undefined) location = window.location.hash;

    return location.replace('#', '');
  },

  //	CALLBACK
  callback: function (callback) {
    setTimeout(function () {
      Identity.stop();
      Router.updateWrapper();
      Router.updateTemplate(Router.wrapper[0]);
      window.location.hash = Router.location;
      Router.location = null;

      //  CALLBACKS
      Router.callbacks(Router.wrapper[0]);
      if (typeof callback === 'function' && callback) callback();
    }, 200);
  },

  //	UPDATE TEMPLATE
  updateTemplate: function (template) {
    var templates = $('.template');
    var current = $('.template[data-template=' + template + ']');

    templates.removeClass('current');
    setTimeout(function () {
      templates.hide();
      current.show().addClass('current');
    }, 1120);
  },

  //	UPDATE WRAPPER
  updateWrapper: function (push, pull) {
    if (push) Router.push(push);
    if (pull) Router.pull(pull);

    var wrapper = Router.wrapper.toString().replace(/,/g, ' ');
    $('.wrapper').attr('class', 'wrapper ' + wrapper);
  },

  //	PUSH
  push: function (items) {
    items = items.split(' ');

    for (i = 0; i < items.length; i++) {
      if (!Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.push(items[i]);
    }
  },

  //	PULL
  pull: function (items) {
    items = items.split(' ');

    for (i = 0; i < items.length; i++) {
      if (Router.wrapper.includes(items[i]) && items[i] != '') Router.wrapper.splice(Router.wrapper.indexOf(items[i]), 1);
    }
  },

  //	LISTEN
  listen: function () {
    $('.wrapper').on('click', '.router', function (e) {
      Router.route($(this).attr('href'), window[$(this).attr('data-callback')]);
      e.preventDefault();
    });

    window.addEventListener('popstate', function (e) {
      Router.route(undefined);
    });
  }
};
Router.routes = function (callback) {
  Router.wrapper = [];
  var location = Router.location.split('/').filter(Boolean);

  //  HOME
  Router.push('home');

  //  CALLBACK
  Router.callback(callback);
};
Router.callbacks = function (wrapper) {
  if (wrapper == 'secret') secret(); else if (wrapper == 'opinion') opinion(); else if (wrapper == 'bucketAll') bucketAll(); else if (wrapper == 'notFound') notFound();
};
var secretAvailability = true;
function secret() {
  if (secretAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=secret] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
var opinionAvailability = true;
function opinion() {
  if (opinionAvailability == true) {
    setTimeout(function () {
      var input = $('.template[data-template=opinion] .field').find('input, textarea');

      input.focus();
      Identity.robot();
    }, Identity.duration * 1.25);
  }
}
function bucketAll() {
  var list = $('.template[data-template=bucketAll] .bucketList');
  var link = list.find('li.archived a');

  //  LISTEN
  link.hover(function () {
    list.addClass('hover');
  }, function () {
    list.removeClass('hover');
  });
}
function notFound() {
  setTimeout(function () {
    Timer.run('.template[data-template=notFound] time', function () {
      Router.route('#');
    }, 5);
  }, Identity.duration * 1.25);
}

function notFoundCallback() {
  Timer.reset();
}
var md = new MobileDetect(window.navigator.userAgent);

$(document).ready(function () {
  Identity.work();
  $('.template main').mCustomScrollbar({
    theme: 'dark'
  });
});

function loadProject() {
  Router.route(undefined, function () {

    //  CALLBACK
    Router.listen();
    Submit.listen('.submit');
    if (!md.mobile()) {
      Stars.init();
      init();
    }
    setTimeout(function () {
      $('#signature').removeClass('loading');
    }, Identity.delay * 1.5);
  });
};

loadProject();