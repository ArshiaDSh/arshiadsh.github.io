$(document).ready(function () {
    var countColor = 0;
    var mAmount = 100;
    var acce = -30;
    var dt = 10;
    var row = '<div class="row"></div>';
    var plat = '<div class="platform"></div>';
    var catMove;
    var plats = [[115, [0, 80], true]];
    var v = 10;
    var inplay = false;
    var position = 0
    var tredPos = -160;
    var mouseDep = null;
    var playerInitPos = 100;
    var playerPos = 100;
    var hScore = 0;
    var cScore = 0;
    var difficultyLevel = 1;
    var difficulty = [1];

    if (localStorage.getItem("highScore")) {
        $('.h-score span')[0].innerHTML = localStorage.getItem("highScore");
        hScore = localStorage.getItem("highScore");
    }

    if (!localStorage.getItem('d')) {
        localStorage.setItem('d', 1);
    } else {
        difficultyLevel = parseInt(localStorage.getItem('d'));
    }
    for (let i = 0; i < difficultyLevel; i++) {
        difficulty.unshift(0);
    }

    $(document).keydown(function (e) {
        if (e.keyCode == 82) {
            localStorage.setItem('highScore', 0);
            $('.h-score span')[0].innerHTML = 0;
            hScore = 0;
            gameOver();
        }
    });
    $(document).click(function (e) {
        start();
    });

    function numToColor(num, period = 10) {
        var red = 255, blue = 0, green = 0, color = 0;
        num = num % 2040;
        if (num <= 255) {
            blue = num;
        } else {
            if (num <= 510) {
                blue = 255;
                red = 510 - num;
            } else {
                if (num <= 765) {
                    blue = 255;
                    green = num - 510;
                    red = 0;
                } else {
                    if (num <= 1020) {
                        green = 255;
                        blue = 1020 - num;
                        red = 0;
                    }
                    else {
                        if (num <= 1275) {
                            green = 255;
                            red = num - 1020;
                            blue = 0;
                        } else {
                            if (num <= 1530) {
                                red = 225;
                                green = 1530 - num;
                                blue = 0;
                            } else {
                                if (num <= 1785) {
                                    red = 255;
                                    blue = num - 1530;
                                    green = 0;
                                } else {
                                    if (num <= 2040) {
                                        red = 255;
                                        blue = 2040 - num;
                                        green = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        color = 'rgb(' + red + ',' + green + ',' + blue + ')';
        return color;
    }
    setInterval(function () {
        countColor++;
        $('.game').css('border-color', numToColor(countColor));
    }, 1)

    for (let i = 0; i < 17; i++) {
        rowGenerator();
    }
    function start() {
        $(document).mousemove(function (e) {
            if (!mouseDep) {
                mouseDep = e.pageX;
            } else {
                let mousePos = e.pageX - mouseDep;
                mousePos += playerInitPos;
                if (mousePos < -50) {
                    playerInitPos = 0;
                    mouseDep = e.pageX - 340;
                    mousePos = 340;
                }
                if (mousePos > 390) {
                    playerInitPos = 0;
                    mouseDep = e.pageX;
                }
                $('.player').css('left', mousePos);
                playerPos = mousePos;
            }
        });
        if (!inplay) {
            inplay = true;
            catMove = setInterval(main, dt);
        }
    }

    function main() {
        let dx = parseFloat((v * mAmount * (dt / 1000)).toFixed());
        botPos = parseInt($('.player').css('bottom').split('px')[0]);
        plats.forEach((element, index) => {
            if (range(botPos, element[0], (botPos + dx)) && element[1][0] < (playerPos + 35) && (playerPos + 15) < element[1][1] && element[2]) {
                v = 10;
                element[2] = false;
                $($('.platform')[index]).addClass('fade');
                $($('.platform')[index]).css('opacity', '0');
                cScore++;
                $('.score span')[0].innerHTML = cScore;
            }
        });
        if (v >= 0 && position >= 270) {
            treadmill(dx);
        } else {
            position += dx;
            if (position >= 0) {
                $('.player').css('bottom', position + 'px');
            } else {
                $('.player').css('bottom', '0px');
                gameOver();
            }
        }
        v += (acce * (dt / 1000));
        v = parseFloat(v.toFixed(1));
    }

    function rowGenerator() {
        let rowCount = $('.row').length;
        let chances = difficulty;
        let palatCount = 0;
        if (rowCount > 2 && ($('.row')[rowCount - 1].children.length + $('.row')[rowCount - 2].children.length + $('.row')[rowCount - 3].children.length) == 0) {
            palatCount = 1;
        } else {
            palatCount = chances[parseInt((Math.random() * chances.length).toFixed())];
        }
        $('.row-con').append(row);
        for (let i = 0; i < palatCount; i++) {
            $('.row:last-child').append(plat);
            let margin = parseInt((Math.random() * 310).toFixed());
            $('.row:last-child .platform:last-child').css('margin-left', margin);
            let platHeight = parseInt(((rowCount * 35) + 25 + ((70 + tredPos) * -1)).toFixed());
            let platWidth = [margin, margin + 80];
            plats.push([platHeight, platWidth, true]);
        }
    }

    function treadmill(pos) {
        tredPos = pos + tredPos;
        if (tredPos > -35) {
            if ($('.row:first-child')[0].children.length == 1) {
                plats.shift();
            }
            $('.row:first-child').remove();
            tredPos = -35 + tredPos;
            tredPos = tredPos - pos;
            rowGenerator();
            tredPos = tredPos + pos;
        }
        $('.row-con').css('top', tredPos);
        plats.forEach((element, index) => {

            plats[index][0] = parseFloat((element[0] - pos).toFixed());
        });
    }

    function range(start, value, end) {
        if (end > start) {
            return (start <= value && value <= end);
        }
        if (end < start) {
            return (end <= value && value <= start);
        }
        if (start == value) {
            return (value == start);
        }
    }

    function gameOver() {
        if (cScore > hScore) {
            hScore = cScore;
            $('.h-score span')[0].innerHTML = cScore;
            localStorage.setItem("highScore", cScore);
        }
        cScore = 0;
        let TCC = 0;
        $('.game-over').css('display', 'block');
        $('.row').remove();
        $(document).off();
        clearInterval(catMove);
        inplay = false;
        position = 0;
        v = 10;
        mouseDep = null;
        playerPos = 100;
        playerInitPos = 100;
        tredPos = -160;
        $('.row-con').css('top', tredPos);
        $('.player').css('left', '100px');
        $('.score span')[0].innerHTML = 0;
        let colorChange = setInterval(function () {
            TCC += 50;
            $('.game-over').css('color', numToColor(TCC));
            if (TCC >= 5000) {
                clearInterval(colorChange);
                $('.game-over').css('display', 'none');
                $('.row-con').append(row);
                $('.row:first-child').append(plat);
                plats = [[115, [0, 80], true]];
                for (let i = 0; i < 17; i++) {
                    rowGenerator();
                }
                $(document).click(function (e) {
                    start();
                });
            }
        }, 1)


    }

});