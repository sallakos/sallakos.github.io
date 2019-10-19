// Peruspeli toimii.
//jshint esversion:6
const CANVAS_VARI = "black";
const SNAKE_VARI = "pink";
const ALKU_PITUUS = 5;
let dx = 10;
let dy = 0;
let ruokaX = 0;
let ruokaY = 0;
let suuntaMuuttumassa = false;
let score = 0;
let nopeus = 100;
let shiftPaaX = 0;
let shiftPaaY = 0;
let paaX = 5;
let paaY = 10;

const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d"); // Piirretään 2D -canvas.

ctx.fillStyle = CANVAS_VARI; // Täyttöväri.
ctx.strokestyle = CANVAS_VARI; // Reunaväri.

ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Täytetään pelialue.
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height); // Pelialueen reunat.

// Luodaan käärme.
// Halutaan, että käärme on aluksi leveyssuunnassa välillä [0, gameCanvas.width / 2].
// Aluksi käärme on kooltaan X ruutua. Oikea reuna on jokin arvo väliltä [100 + 10X, gameCanvas.width / 2].
// Arvon tulee olla jaollinen kymmenellä.
// Sama juttu y-koordinaatille.
const ALKU_X = satunnainenKymppi(100 + ALKU_PITUUS * 10, (gameCanvas.width / 2));
const ALKU_Y = satunnainenKymppi(100 + ALKU_PITUUS * 10, (gameCanvas.height / 2));
let snake = muodostaSnake();

// Piirretään snake valmiiksi. Luodaan ruoka myös.
piirraSnake();
luoRuoka();

// Kun klikataan pelialuetta, aloitetaan peli.
$("#gameCanvas").click(main);

// Pääohjelma. Liikutetaan matoa ajan nopeus välein.
function main() {

  // Jos snake osuu seinään tai itseensä, lopetetaan peli.
  if (peliLoppu()) {
    return;
  }

  // Muutetaan suuntaa näppäimen painalluksesta. Toimii vasta, kun peli on aloitettu.
  document.addEventListener("keydown", muutaSuuntaa);

  // Päivitetään näkymää ajan nopeus välein.
  setTimeout(function() {
    suuntaMuuttumassa = false;
    tyhjennaCanvas();
    liikuta();
    piirraSnake();
    piirraRuoka();
    main();
  }, nopeus);

}

// Satunnainen kymmenellä jaollinen kokonaisluku väliltä [min, max].
function satunnainenKymppi(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
}

// Muodostetaan snake. Alkupituus on määrätty alussa.
function muodostaSnake() {
  var snake_alku = [];
  for (var i = 0; i < ALKU_PITUUS; i++) {
    snake_alku.push({
      x: ALKU_X - i * 10,
      y: ALKU_Y
    });
  }
  return snake_alku;
}

// Piirretään yksi osa. Väritetään 10x10 ruutu.
function piirraSnakeOsa(snakeOsa, index) {
  ctx.fillStyle = SNAKE_VARI;
  ctx.strokestyle = CANVAS_VARI;
  if (index == 0) {
    ctx.fillRect(snakeOsa.x + shiftPaaX, snakeOsa.y + shiftPaaY, paaX, paaY);
    ctx.strokeRect(snakeOsa.x + shiftPaaX, snakeOsa.y + shiftPaaY, paaX, paaY);
  } else {
    ctx.fillRect(snakeOsa.x, snakeOsa.y, 10, 10);
    ctx.strokeRect(snakeOsa.x, snakeOsa.y, 10, 10);
  }
}

// Piirretään koko snake.
function piirraSnake() {
  snake.forEach(piirraSnakeOsa);
}

// Liikutetaan.
function liikuta() {

  // Jos pää osuu ruokaan, soiRuokaa = true.
  const soiRuokaa = snake[0].x === ruokaX && snake[0].y === ruokaY;

  // Pää liikkuu x- ja y-suunnassa minne kulkusuunta määrää.
  const paa = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  // Lisätään uusi pää alkuun.
  snake.unshift(paa);

  // Jos söi ruokaa, luodaan uusi, muuten poistetaan viimeinen käärmeen osa.
  if (soiRuokaa) {
    score++;
    if (score % 5 == 0) {
      nopeus -= 10;
    }
    $("#score").text(score);
    $("#nopeus").text(nopeus);
    luoRuoka();
  } else {
    snake.pop();
  }

}

// Vaihdetaan snaken kulkusuunta.
function muutaSuuntaa(event) {

  if (suuntaMuuttumassa) {
    return;
  }
  suuntaMuuttumassa = true;

  // Muutetaan aina tietoa, mihin suuntaan snake kulkee.
  const menossaYlos = dy === -10;
  const menossaAlas = dy === 10;
  const menossaVasen = dx === -10;
  const menossaOikea = dx === 10;

  // Hetaan painettu näppäin.
  const nappain = event.key;

  // Vaihdetaan kulkusuunta näppäimen mukaan. Kulkusuuntaa ei voi vaihtaa
  // päinvastaiseksi kuin nykyinen.
  if ((nappain === "ArrowUp" || nappain === "w") && !menossaAlas) {
    dx = 0;
    dy = -10;
    shiftPaaX = 0;
    shiftPaaY = 5;
    paaX = 10;
    paaY = 5;
  }
  if ((nappain === "ArrowDown" || nappain === "s") && !menossaYlos) {
    dx = 0;
    dy = 10;
    shiftPaaX = 0;
    shiftPaaY = 0;
    paaX = 10;
    paaY = 5;
  }
  if ((nappain === "ArrowLeft" || nappain === "a") && !menossaOikea) {
    dx = -10;
    dy = 0;
    shiftPaaX = 5;
    shiftPaaY = 0;
    paaX = 5;
    paaY = 10;
  }
  if ((nappain === "ArrowRight" || nappain === "d") && !menossaVasen) {
    dx = 10;
    dy = 0;
    shiftPaaX = 0;
    shiftPaaY = 0;
    paaX = 5;
    paaY = 10;
  }

}

// Jos snake osuu seinään tai itseensä, peli päättyy.
function peliLoppu() {

  // Pää osuu seinään.
  const osumaVasen = snake[0].x < 0;
  const osumaOikea = snake[0].x > gameCanvas.width - 10;
  const osumaYla = snake[0].y < 0;
  const osumaAla = snake[0].y > gameCanvas.height - 10;

  // Pää osuu vartaloon. Alkaa nelosesta, jotta täyskäännöksen yrittäminen
  // ei tapa snakea.
  for (var i = 4; i < snake.length; i++) {
    const osumaOma = (snake[0].x === snake[i].x && snake[0].y === snake[i].y);
    if (osumaOma) {
      return true;
    }
  }

  if (osumaVasen || osumaOikea || osumaYla || osumaAla) {
    return true;
  }

  return false;

}

// Luodaan ruoka. Jos ruoka on snaken alla, luodaan se uudelleen.
function luoRuoka() {
  ruokaX = satunnainenKymppi(0, gameCanvas.width - 10);
  ruokaY = satunnainenKymppi(0, gameCanvas.height - 10);
  snake.forEach(function(snakeOsa) {
    if (ruokaX == snakeOsa.x && ruokaY == snakeOsa.y) {
      luoRuoka();
    }
  });
}

// Piirretään ruoka.
function piirraRuoka() {
  ctx.fillStyle = "white";
  ctx.strokestyle = CANVAS_VARI;
  ctx.fillRect(ruokaX, ruokaY, 10, 10);
  ctx.strokeRect(ruokaX, ruokaY, 10, 10);
}

// Tyhjennetään ruutu, jotta voidaan piirtää uusi snake.
function tyhjennaCanvas() {
  ctx.fillStyle = CANVAS_VARI; // Täyttöväri.
  ctx.strokestyle = CANVAS_VARI; // Reunaväri.
  ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height); // Täytetään pelialue.
  ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height); // Pelialueen reunat.
}
