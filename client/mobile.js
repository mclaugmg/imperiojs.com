// Connect to imperio socket room
imperio.emitRoomSetup(function(socket) {
  console.log('socket', socket);
  var rooms = socket.rooms || 'no rooms';
  console.log('ROOMS AFTER MOBILE ROOM SETUP: ', rooms);
});

var scrollBar = document.getElementById('scroll-bar');
var base = document.getElementById('base');

imperio.gesture('pan', scrollBar, null, handleScrollPan);

function handleScrollPan(event) {
  event.scroll = true;
  return event;
}

var scrollButton = document.getElementById('scroll-button');
var beta = document.getElementById('scroll-beta');
var gamma = document.getElementById('scroll-gamma');
var zero = document.getElementById('scroll-zero');
var diff = document.getElementById('difference');
var zeroGyro = true;
var zeroedGyroAngle = 0;
var inScroll = false;

imperio.gesture('press', scrollButton, scrollGyroOn);
imperio.gesture('pressUp', scrollButton, scrollGyroOff);

function scrollGyroOn() {
  console.log('detected press, turning gyro on');
  inScroll = true;
  imperio.emitGyroscope.start(printScrollGyro, modGyro);
}

function modGyro(event) {
  console.log('in mod gyro');
  if (zeroGyro) {
    zeroedGyroAngle = event.beta;
    zeroGyro = false;
  }
  event.difference = event.beta - zeroedGyroAngle;
  event.inScroll = inScroll;
  return event;
}

function printScrollGyro(event) {
  console.log('in print gyro');
  beta.innerHTML = "beta: " + Math.round(event.beta);
  zero.innerHTML = "zero: " + zeroedGyroAngle;
  diff.innerHTML = "diff: " + event.difference;
}

function scrollGyroOff() {
  console.log('detected pressUp, turning gyro OFF');  
  zeroGyro = true;
  inScroll = false;
  imperio.emitGyroscope.remove(printScrollGyro);
}

var browserState = {
  iacto: {
    on: false,
    gyro: false,
  },
  umbra: false,
  fluctus: false,
}

// emitData listener from desktop
// data transferred in two situations:
imperio.dataListener(updateBrowserState);

function updateBrowserState(browserViewData) {
  console.log('state update recevied:');
  console.log(browserViewData);
  if (browserViewData.iacto) browserState.iacto.on = true;
  else browserState.iacto.on = false;
  if (browserViewData.iactoGyro) browserState.iacto.gyro = true;
  else browserState.iacto.gyro = false;
  if (browserViewData.umbra) browserState.umbra = true;
  else browserState.umbra = false;
  if (browserViewData.fluctus) browserState.fluctus = true;
  else browserState.fluctus = false;
  console.log(browserState);
  renderMobile();
}

// turns on and off mobile emitters conditionally
function renderMobile() {
  if (browserState.iacto.on) {
    console.log('rendering iacto');
    renderIacto();
    removeBase();
    if (!browserState.iacto.gyro) turnGyroOff();
    else turnGyroOn();
  } else removeIacto();

  if (browserState.umbra) {
    renderUmbra();
    removeBase();
  } else removeUmbra();

  // if (browserState.fluctus) {
  //   renderFluctus();
  //   removeBase();
  // } else removeFluctus();

  if (!browserState.iacto.on && !browserState.umbra && !browserState.fluctus) {
    renderBase();
  }
}

function renderBase() {
  base.style.display = 'flex';
}

function removeBase() {
  base.style.display = 'none';
}
