$(document).ready(function () {
    var topDistance = parseInt($('.right-side .mover').css('top'));
    var LPT = parseFloat($('.left-side .mover').css('top'));
    var ballspeed = 5;
    var ySpeed = 0.7;
    var rowIndex = ballspeed;
    var colIndex = ySpeed * ballspeed;
    var vertical;
    var pScore = 0;
    var cScore = 0;
    var rCount = 0;
    var pPgaeY;
    $(document).mousemove(function (e) {
        topDistance = parseInt($('.right-side .mover').css('top'));
        if (pPgaeY) {
            var d = e.pageY - pPgaeY;
            var nTop = topDistance + 3 * d;
            if (nTop >= 0 && nTop <= 280) {
                $('.right-side .mover').css('top', nTop + 'px');
            } else {
                if (nTop < 0) {
                    $('.right-side .mover').css('top', 0 + 'px');
                } else {
                    $('.right-side .mover').css('top', 293 + 'px');
                }

            }

        }
        pPgaeY = e.pageY;
    });
    var ballMove = setInterval(() => {
        var top = parseFloat($('.ball').css('top'));
        var left = parseInt($('.ball').css('left'));
        topDistance = parseFloat($('.right-side .mover').css('top'));
        LPT = parseFloat($('.left-side .mover').css('top'));

        if (rowIndex < 0 && left <= 492.5 && left >= 30) {
            if (ballspeed <= 10) {
                var moverSpeed = (ballspeed * 0.25);
            } else {
                var moverSpeed = 2;
            }
            if (colIndex > 0) {
                vertical = Math.floor((((left - 10) * ySpeed) + top));
                if (vertical > 293) {
                    if (LPT < 293) {
                        if (!$('.left-side .mover').is(':animated')) {
                            $('.left-side .mover').animate({
                                'top': LPT,
                                'top': '293px'
                            }, (293 - LPT) / moverSpeed);
                        }
                    }

                } else {
                    if (LPT != vertical) {
                        if (!$('.left-side .mover').is(':animated')) {
                            $('.left-side .mover').animate({
                                'top': LPT,
                                'top': vertical
                            }, Math.abs(vertical - LPT) / moverSpeed);
                        }
                    }
                }
            } else {
                vertical = Math.floor(top - ((left - 10) * ySpeed));
                if (vertical < 0) {
                    if (LPT > 0) {
                        if (!$('.left-side .mover').is(':animated')) {
                            $('.left-side .mover').animate({
                                'top': LPT,
                                'top': '0px'
                            }, LPT / moverSpeed);
                        }
                    }
                } else {
                    if (vertical < 293) {
                        if (!$('.left-side .mover').is(':animated') && LPT != vertical) {
                            $('.left-side .mover').animate({
                                'top': LPT,
                                'top': vertical
                            }, Math.abs(vertical - LPT) / moverSpeed);
                        }
                    } else {
                        $('.left-side .mover').animate({
                            'top': topDistance,
                            'top': '293px'
                        }, (293 - topDistance) / moverSpeed);
                    }
                }
            }
        }
        if (top >= 378) {
            colIndex = -1 * ySpeed * ballspeed;
        }
        if (top <= 0) {
            colIndex = 1 * ySpeed * ballspeed;
        }
        if (left >= 975 || left <= 10) {
            if (left > 492.5) {
                topDistance = parseFloat($('.right-side .mover').css('top'));
            } else {
                topDistance = parseFloat($('.left-side .mover').css('top'));
            }
            if (topDistance <= (top + 15) && top <= (topDistance + 100)) {
                rCount++;
                if (rCount == 2) {
                    ballspeed += 0.5
                    rCount = 0;
                    console.log(ballspeed);

                }
                if ((top - topDistance) < 42.5) {
                    ySpeed = 2 - ((top - topDistance + 15) / 28.75);
                    colIndex = -1 * ySpeed * ballspeed;

                } else {
                    ySpeed = ((top - topDistance - 42.5) / 28.75);
                    colIndex = 1 * ySpeed * ballspeed;
                }
                rowIndex = ((left > 492.5) ? -1 : 1) * ballspeed;
            } else {
                if (left >= 985 || left <= 0) {
                    (left > 492.5) ? cScore++ : pScore++;
                    $(".left-counter")[0].innerHTML = cScore;
                    $(".right-counter")[0].innerHTML = pScore;
                    ySpeed = 0.7;
                    ballspeed = 5;
                    rowIndex = (left > 492.5) ? ballspeed : -ballspeed;
                    colIndex = ySpeed * ballspeed;
                    rCount = 0
                    top = 191;
                    left = 492.5;
                }
            }
        }
        left += rowIndex;
        top += colIndex;
        $('.ball').css('top', top + 'px');
        $('.ball').css('left', left + 'px');
    }, 10);
});