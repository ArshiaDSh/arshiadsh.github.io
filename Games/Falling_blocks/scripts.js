$(document).ready(function () {
    var curShapes = [];
    var curShape = null;
    var nShape;
    var inPlay = false;
    var rowDep;
    var counter;
    var shapeMove;
    var cc = -1;
    var HightScore = 0;
    var Score = 0;
    var shapes = {
        0: ['rgba(209,0,0,1)', [0, 0], [1, 1], [2, 1], [1, 0]],
        1: ['rgba(0,0,255,1)', [0, 0], [0, 3], [3, 0], [1, 0], [0, 1], [2, 0], [0, 2]],
        2: ['rgba(0,255,0,1)', [0, 2], [0, 3], [0, 1], [0, 0]],
        3: ['rgba(0,46,0,1)', [0, 0], [2, 3], [3, 0], [2, 0], [1, 0], [2, 1], [2, 2]],
        4: ['rgba(209,39,155,1)', [0, 0], [0, 1], [1, 1], [1, 0]],
        5: ['rgba(255,255,0,1)', [0, 0], [1, 1], [1, 0], [1, 0]],
        6: ['rgba(97,6,255,1)', [0, 0], [1, 1], [2, 0], [1, 0]],
        7: ['rgba(97,100,255,1)', [0, 0], [0, 1], [0, 1], [0, 0]]

    }




    var countColor = 1;
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
        $('.board,.next,.score').css('border-color', numToColor(countColor));
    }, 1)

    if (localStorage.getItem("highScore")) {
        $('.h-score span')[0].innerHTML = localStorage.getItem("highScore");
        HightScore = localStorage.getItem("highScore");
    }

    function place(des = [0, 0], shape, table = 'b', ret = false) {
        let col = des[0] + 1;
        let row = des[1] + 1;
        let places = [];
        let status = true;
        for (let i = 1; i < shape.length; i++) {
            let target = $('.' + table + '-row:nth-child(' + (row + shape[i][1]) + ') ' + '.' + table + '-col:nth-child(' + (col + shape[i][0]) + ')');
            if (!target.hasClass('active')) {
                if (target[0] && table == 'b') {
                    status = false;
                    break;
                }
            }
        }
        if (status || ret) {

            for (let i = 1; i < shape.length; i++) {
                let target = $('.' + table + '-row:nth-child(' + (row + shape[i][1]) + ') ' + '.' + table + '-col:nth-child(' + (col + shape[i][0]) + ')');

                if (!ret) {
                    target.css('background-color', shape[0]);
                    target.addClass('placed');
                }
                else {
                    places.push(target[0]);
                }
            }
            if (ret) {
                return places;
            }
        } else {
            gameOver();
        }
    }

    $('.start').click(function (e) {
        start();
    });

    $(document).keypress(function (e) {
        if (e.keyCode == 82) {
            localStorage.setItem('highScore', 0);
            $('.h-score span')[0].innerHTML = 0;
            $('.c-score span')[0].innerHTML = 0;
            HightScore = 0;
            gameOver();
        }

        if (e.keyCode == 32) {
            start();
        }
    });

    function move() {
        if (isActive()) {
            $('.b-col.active').css('background-color', 'black');
            $('.b-col.active').removeClass('placed');
            place([rowDep, counter - 1], curShape);
            counter--;

        } else {
            counter = 20;
            curShapes.shift();
            Score += $('.placed.b-col').length;
            $('.c-score span')[0].innerHTML = Score;
            $('.placed').removeClass('active');
            $('.placed').removeClass('placed');
            $('.n-col').css('background-color', 'black');
            for (let i = 1; i < 21; i++) {
                $('.b-col').filter(function () {
                    return $(this).css('background-color') == 'rgb(0, 0, 0)'
                }).addClass('active');
                $('.b-col').filter(function () {
                    return $(this).css('background-color') != 'rgb(0, 0, 0)'
                }).removeClass('active');
                if (!$('.b-row:nth-child(' + i + ') .b-col').hasClass('active') && $('.b-row:nth-child(' + i + ') .b-col')[0]) {
                    $('.b-row:nth-child(' + i + ') .b-col').css('background-color', 'black');
                    $('.b-row:nth-child(' + i + ') .b-col').addClass('active');
                    for (let index = i; index < 21; index++) {
                        for (let index2 = 1; index2 < 11; index2++) {
                            var bg = $('.b-row:nth-child(' + (index + 1) + ') .b-col:nth-child(' + index2 + ')').css('background-color');
                            $('.b-row:nth-child(' + index + ') .b-col:nth-child(' + index2 + ')').css('background-color', bg);
                        }
                    }

                    Score += (i * 10);
                    $('.c-score span')[0].innerHTML = Score;
                    i--;
                }
            }
            clearInterval(shapeMove);
            cc = 0;
            main();

        }
    }

    function main() {
        curShapes.push(shapes[Math.round(Math.random() * (Object.keys(shapes).length - 1))]);
        curShape = curShapes[0];
        rowDep = 5 - curShape[1][0];
        counter = 20;
        let isProccecing = false;
        place([0, 5], curShapes[1], 'n');
        place([0, 0], curShapes[2], 'n');
        shapeMove = setInterval(move, 400)
        $(document).off();
        $(document).keypress(function (e) {

            if (e.keyCode == 82) {
                localStorage.setItem('highScore', 0);
                $('.h-score span')[0].innerHTML = 0;
                $('.c-socre span')[0].innerHTML = 0;
                HightScore = 0;
                gameOver();
            }
            if (e.keyCode == 32) {
                start();
            }
        });
        $(document).keydown(function (e) {
            if (isProccecing) return;
            isProccecing = true;

            if (e.keyCode == 37 && rowDep > 0 && isActive('l')) {
                rowDep--;
                $('.b-col.active').css('background-color', 'black');
                $('.b-col.active').removeClass('placed');
                place([rowDep, counter], curShape);
            }
            if (e.keyCode == 39 && rowDep < (9 - curShape[3][0]) && isActive('r')) {
                rowDep++;
                $('.b-col.active').css('background-color', 'black');
                $('.b-col.active').removeClass('placed');
                place([rowDep, counter], curShape);
            }
            if (e.keyCode == 40) {
                move();
            }
            isProccecing = false;

        });
        $(document).click(function (e) {
            if (isProccecing) return;
            isProccecing = true;
            cc++;
            let nthClick = cc % 4;
            let leng;
            switch (nthClick) {
                case 0:
                    nShape = curShapes[0]
                    break;
                case 1:
                    nShape = flip(rotate(curShapes[0]), 'v');
                    break;
                case 2:
                    nShape = flip(flip(curShapes[0], 'h'), 'v');
                    break;
                case 3:
                    nShape = rotate(flip(curShapes[0], 'v'));
                    break;
            }
            if (isActive('t')) {
                leng = curShape[3][0] - curShape[1][0] + 1;
                rowDep = 0.5 * (10 + rowDep - leng - Math.abs(rowDep + leng - 10));
                curShape = nShape;
            } else {
                cc--;
            }
            isProccecing = false;
        });
    }

    function isActive(dir = 'd') {
        let checkers = $('.b-col.placed');
        if (checkers.length > 0) {
            for (let i = 0; i < checkers.length; i++) {
                const element = checkers[i];
                let colNum = Array.from(element.parentElement.children).indexOf(element) + 1;
                let rowNum = Array.from(element.parentElement.parentElement.children).indexOf(element.parentElement) + 1;
                switch (dir) {
                    case 'd':
                        if (!$('.b-row:nth-child(' + (rowNum - 1) + ') .b-col:nth-child(' + colNum + ')').hasClass('active')) {
                            return false;
                        }
                        break;
                    case 'r':
                        if (!$('.b-row:nth-child(' + rowNum + ') .b-col:nth-child(' + (colNum + 1) + ')').hasClass('active')) {
                            return false;
                        }
                        break;
                    case 'l':
                        if (!$('.b-row:nth-child(' + rowNum + ') .b-col:nth-child(' + (colNum - 1) + ')').hasClass('active')) {
                            return false;
                        }
                        break;
                }
            }
            if (dir == "t") {
                let placed = place([rowDep, counter - 1], nShape, 'b', true);
                for (let i = 0; i < placed.length; i++) {
                    if (!$(placed[i]).hasClass('active')) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function flip(shape, direc = 'h') {
        let newShape = [];
        newShape[0] = shape[0];
        for (let i = 1; i < shape.length; i++) {
            if (direc == 'h') {
                newShape[i] = [3 - shape[i][0], shape[i][1]];
            }
            if (direc == 'v') {
                newShape[i] = [shape[i][0], 3 - shape[i][1]];
            }
        }
        return align(newShape, direc);
    }

    function rotate(shape) {
        let newShape = [];
        newShape[0] = shape[0];
        for (let i = 1; i < shape.length; i++) {
            newShape[i] = [shape[i][1], shape[i][0]]
        }
        return align(newShape, 'r');
    }

    function align(shape, fun) {
        let newShape = shape.slice();
        switch (fun) {
            case 'h':
                newShape[1] = shape[3];
                newShape[3] = shape[1];
                break;

            case 'v':
                newShape[2] = shape[4];
                newShape[4] = shape[2];
                break;

            case 'r':
                newShape[1] = shape[4];
                newShape[2] = shape[3];
                newShape[3] = shape[2];
                newShape[4] = shape[1];
                break;

            default:
                break;
        }
        let LTrans = newShape[1][0];
        let DTrans = newShape[4][1];
        for (let i = 1; i < newShape.length; i++) {
            newShape[i] = [newShape[i][0] - LTrans, newShape[i][1] - DTrans];
        }
        return newShape;
    }

    function start() {
        if (!inPlay) {
            inPlay = true;
            Score = 0;
            cc = 0;
            $('.c-score span')[0].innerHTML = 0;
            $('.start').addClass('reset');
            $('.start')[0].innerHTML = 'Reset';
            $('.start').removeClass('start');
            curShapes[0] = shapes[Math.round(Math.random() * (Object.keys(shapes).length - 1))];
            curShapes[1] = shapes[Math.round(Math.random() * (Object.keys(shapes).length - 1))];
            main();
        } else {
            gameOver();
        }
    }

    function gameOver() {
        if (Score > HightScore) {
            HightScore = Score;
            $('.h-score span')[0].innerHTML = Score;
            localStorage.setItem("highScore", Score);
        }
        inPlay = false;
        Score = 0;
        clearInterval(shapeMove);
        $('.reset').addClass('start');
        $('.reset')[0].innerHTML = "Start";
        $('.reset').removeClass('reset');
        $('.b-col,.n-col').css('background-color', 'black');
        $('.b-col').addClass('active');
        $('.b-col').removeClass('placed');
        $('.c-score span')[0].innerHTML = 0;
        $(document).off();
        $(document).keypress(function (e) {

            if (e.keyCode == 82) {
                localStorage.setItem('highScore', 0);
                $('.h-score span')[0].innerHTML = 0;
                $('.c-socre span')[0].innerHTML = 0;
                HightScore = 0;
                gameOver();
            }
            if (e.keyCode == 32) {
                start();
            }
        });
    }
});