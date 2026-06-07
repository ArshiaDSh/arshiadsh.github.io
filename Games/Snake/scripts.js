$(document).ready(function () {
    var snake = [];
    put($('.snake:nth-child(1)'), 436)
    put($('.snake:nth-child(2)'), 437)
    put($('.snake:nth-child(3)'), 438)
    var dir = 'right';
    var clickTimes = 0;
    var inPlay = false;
    var snakeMove;
    var currentNumber = 3;
    var moveTime = 75;
    if (localStorage.getItem("record")) {
    }
    else {
        localStorage.setItem("record", 0);
    }
    var record = localStorage.getItem("record");
    $(".record")[0].innerHTML = "record : " + record;

    function ballLocGnerator() {
        for (let i = 2; i > 1; i++) {
            var newRow = Math.floor(Math.random() * 30);
            var newCol = Math.floor(Math.random() * 30);
            var newBallloc = (newRow * 30) + newCol + 1;
            if (!snake.includes(newBallloc)) {
                $('.ball').css('top', newRow * 19);
                $('.ball').css('left', newCol * 19);
                return newBallloc;
                break;
            }
        }
    }
    put($('.ball'), 440)
    for (let row = 0; row < 30; row++) {
        for (let col = 0; col < 30; col++) {
            var number = (row * 30) + col + 1;
            $('.row:nth-child(' + (row + 1) + ')>.col:nth-child(+' + (col + 1) + ')').attr('num', number);
        }
    }

    function locFinder(spot) {
        var Left = parseInt(spot.css('left'));
        var top = parseInt(spot.css('top'));
        var Location = ((top / 19) * 30) + (Left / 19) + 1;
        return Location;
    }

    function put(element, place) {
        if (place % 30 != 0) {
            var Pcol = 19 * ((place % 30) - 1);
            var Prow = 19 * (Math.floor(place / 30));

        } else {
            var Pcol = 29 * 19;
            var Prow = 19 * ((Math.floor(place / 30)) - 1);
        }

        element.css('top', Prow);
        element.css('left', Pcol);
    }

    function gameOver() {
        clearInterval(snakeMove);
        inPlay = false;
        $('.game-over').css('display', 'block');
        $('.retry').css('display', 'block');
        if (currentNumber > record) {
            record = currentNumber;
            localStorage.setItem("record", currentNumber)
        }
        $('.game-over')[0].innerHTML = $('.game-over')[0].innerHTML.slice(0, 66) + currentNumber;
        $('.record')[0].innerHTML = "record : " + record;
    }

    function retry() {
        if (!inPlay) {
            inPlay = true;
            $('.snake').remove();
            for (let i = 0; i < 3; i++) {
                $('<div class="snake"></div>').appendTo('.snake-con');
            }
            put($('.snake:nth-child(1)'), 436)
            put($('.snake:nth-child(2)'), 437)
            put($('.snake:nth-child(3)'), 438)
            put($('.ball'), 440)
            $('.game-over').css('display', 'none');
            $('.game-controllers > div,.game-controllers > button').css('display', 'none');
            snakeMove = setInterval(snakeMover, moveTime);
            currentNumber = 3;
            $('.counter')[0].innerHTML = 'current : 3';
            dir = 'right';
        }
    }
    $('.start').click(function (e) {
        inPlay = true;
        snakeMove = setInterval(snakeMover, moveTime);
        $('.start').css('display', 'none');
    });
    $('.retry').click(retry);


    $(document).keydown(function (e) {
        var newDir;
        var keyPressed = e.which;
        if ((keyPressed == 37 || keyPressed == 38 || keyPressed == 39 || keyPressed == 40) && clickTimes == 0 && inPlay) {
            switch (dir) {
                case 'right':
                    newDir = keyPressed != 37 ? e.key.slice(5).toLowerCase() : false;
                    break;
                case 'left':
                    newDir = keyPressed != 39 ? e.key.slice(5).toLowerCase() : false;
                    break;
                case 'up':
                    newDir = keyPressed != 40 ? e.key.slice(5).toLowerCase() : false;

                    break;
                case 'down':
                    newDir = keyPressed != 38 ? e.key.slice(5).toLowerCase() : false;
                    break;
            }
            if (newDir) {
                dir = newDir;
            }
        }
        clickTimes++;
        if (keyPressed == 32) {
            retry();
        }



    });
    $(document).keypress(function (e) {

        if (e.keyCode == 82 && !inPlay) {
            localStorage.setItem("record", 0);
            record = 0;
            $(".counter")[0].innerHTML = "counter : 3";
            $(".record")[0].innerHTML = "record : 0";
        }

    });
    function snakeMover() {
        clickTimes = 0;
        snake = [];
        for (let i = 0; i < $('.snake').length; i++) {
            snake[i] = locFinder($('.snake:nth-child(' + (i + 1) + ')'));
        }
        var snakeHead;
        var lastChild;
        switch (dir) {
            case 'right':
                snakeHead = snake[snake.length - 1] % 30 != 0 ? snake[snake.length - 1] + 1 : false;
                $('.snake:last-child').css('transform', 'rotate(0deg)');
                break;
            case 'left':
                snakeHead = (snake[snake.length - 1] - 1) % 30 != 0 ? snake[snake.length - 1] - 1 : false;
                $('.snake:last-child').css('transform', 'rotate(180deg)');
                break;
            case 'up':
                snakeHead = snakeHead = snake[snake.length - 1] > 30 ? snake[snake.length - 1] - 30 : false;
                $('.snake:last-child').css('transform', 'rotate(-90deg)');
                break;
            case 'down':
                snakeHead = snakeHead = snake[snake.length - 1] < 871 ? snake[snake.length - 1] + 30 : false;
                $('.snake:last-child').css('transform', 'rotate(90deg)');
                break;
        }
        if (snakeHead) {
            if (snakeHead != locFinder($('.ball')) && !snake.includes(snakeHead)) {
                put($('.snake:last-child'), snakeHead);
                var diffrence = snake[0] - snake[2];
                lastChild = !(Math.abs(diffrence) == 60 || Math.abs(diffrence) == 2);
                for (let i = snake.length - 1; 0 < i; i--) {
                    if (i == 1 && lastChild) {
                        if (diffrence > 0) {
                            if (diffrence == 31) {
                                if (snake[0] - snake[1] == 30) {
                                    $('.snake:first-child').css('transform', 'rotate(180deg)');

                                } else {
                                    $('.snake:first-child').css('transform', 'rotate(-90deg)');
                                }
                            } else {
                                if (snake[0] - snake[1] == 30) {
                                    $('.snake:first-child').css('transform', 'rotate(0deg)');

                                } else {
                                    $('.snake:first-child').css('transform', 'rotate(-90deg)');
                                }
                            }
                        } else {
                            if (diffrence == -31) {
                                if (snake[0] - snake[1] == -30) {
                                    $('.snake:first-child').css('transform', 'rotate(0deg)');
                                } else {
                                    $('.snake:first-child').css('transform', 'rotate(90deg)');
                                }
                            } else {
                                if (snake[0] - snake[1] == -30) {
                                    $('.snake:first-child').css('transform', 'rotate(180deg)');

                                } else {
                                    $('.snake:first-child').css('transform', 'rotate(90deg)');
                                }
                            }
                        }
                    }
                    put($('.snake:nth-child(' + i + ')'), snake[i]);
                }
            } else {
                if (snake.includes(snakeHead)) {
                    gameOver();
                } else {
                    $('<div class="snake"></div>').appendTo('.snake-con');
                    put($('.snake:last-child'), snakeHead);
                    $('.snake:last-child').css('transform', $('.snake:nth-child(' + snake.length + ')').css('transform'));
                    ballLocGnerator();
                    currentNumber++;
                    $('.counter')[0].innerHTML = $('.counter')[0].innerHTML.slice(0, 10) + currentNumber;
                }
            }
        } else {
            gameOver();
        }

    }

});


