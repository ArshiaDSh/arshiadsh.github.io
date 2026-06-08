$(document).ready(function () {

    function isActive(el) {
        return $(el).hasClass("b-active") || $(el).hasClass("r-active");
    }
    var tc = 0;
    $('.s-btn').click(function (e) {
        $('.g-start').css("display", "none");
        $('.g-sizes').css("display", "flex");
    });
    $(".m-one,.m-two").click(function (e) {
        var mode = parseInt(e.target.attributes.mvalue.nodeValue);
        $('.g-mode').css("display", "none");
        if (mode == "2") {
            $('.g-color').css("display", "flex");

        } else {
            $('.g-sizes').css("display", "flex");
        }

    });
    $(".colors .color").click(function (e) {
        var color = parseInt(e.target.attributes.cvalue.nodeValue);

        $('.g-color').css("display", "none");
        $('.g-sizes').css("display", "flex");

    });
    var gDeg = 0;
    function gradient() {
        gDeg += .5;
        $("body").css("background", "linear-gradient(" + gDeg + "deg,rgba(247, 247, 247, 1) 24%, rgba(255, 255, 204, 1) 60%, rgba(255, 255, 171, 1) 76%, rgba(255, 255, 140, 1) 99%)")
    }
    setInterval(gradient, 10);

    $('.c-btn').click(function (e) {
        var w = parseInt($('.w input').val());
        var h = parseInt($('.h input').val());
        if (w >= 3 && h >= 3) {
            $('.g-sizes').css("display", "none");
            $('.g-board').css("display", "flex");

            for (let i = 0; i < h; i++) {
                let hrow = '<div class="h-line" style="z-index:' + (w - 1) + '" lnum="0"><div class="dot"></div><div class="dot"></div></div>';
                let vrow = '<div class="v-line" lnum="0"></div><div class="square"></div>';
                for (let j = 0; j < w - 2; j++) {
                    hrow += '<div class="h-line" style="margin-left:-10px;z-index:' + (-j + w - 2) + '" lnum="' + (j + 1) + '"><div class="dot"></div></div>';
                    vrow += '<div class="v-line" lnum="' + (j + 1) + '"></div><div class="square"></div>';
                }
                vrow += "<div class='v-line' lnum='" + (w - 1) + "'></div>"
                $(".board").append("<div class='row' rnum='" + (2 * i) + "'>" + hrow + "</div>");
                if (i != h - 1) {
                    $(".board").append("<div class='row' style='z-index:0' rnum='" + (2 * i + 1) + "'>" + vrow + "</div>");
                }
            }
            var scores = [0, 0];
            $(".v-line,.h-line").click(function (e) {
                if (!($(e.target).hasClass("dot") || isActive(e.target))) {
                    if (tc % 2 == 0) {
                        var cls = "b-active";
                    } else {
                        var cls = "r-active";
                    }
                    let lnum = parseInt($(e.target).attr("lnum"));
                    let rnum = parseInt($(e.target.parentElement).attr("rnum"));
                    if ($(e.target).hasClass("v-line")) {
                        var ls = lnum > 0 && isActive($(".row:nth-child(" + (rnum + 1) + ") .v-line")[lnum - 1]) && isActive($(".row:nth-child(" + (rnum) + ") .h-line")[lnum - 1]) && isActive($(".row:nth-child(" + (rnum + 2) + ") .h-line")[lnum - 1]);
                        var rs = lnum < w - 1 && isActive($(".row:nth-child(" + (rnum + 1) + ") .v-line")[lnum + 1]) && isActive($(".row:nth-child(" + (rnum) + ") .h-line")[lnum]) && isActive($(".row:nth-child(" + (rnum + 2) + ") .h-line")[lnum]);
                        if (ls) {
                            $($(".row:nth-child(" + (rnum + 1) + ") .square")[lnum - 1]).addClass(cls);
                            scores[tc % 2] += 1;
                        }
                        if (rs) {
                            $($(".row:nth-child(" + (rnum + 1) + ") .square")[lnum]).addClass(cls);
                            scores[tc % 2] += 1;
                        }
                    } else {
                        var ts = rnum > 0 && isActive($(".row:nth-child(" + (rnum - 1) + ") .h-line")[lnum]) && isActive($(".row:nth-child(" + (rnum) + ") .v-line")[lnum]) && isActive($(".row:nth-child(" + (rnum) + ") .v-line")[lnum + 1]);
                        var bs = rnum < 2 * h - 1 && isActive($(".row:nth-child(" + (rnum + 3) + ") .h-line")[lnum]) && isActive($(".row:nth-child(" + (rnum + 2) + ") .v-line")[lnum]) && isActive($(".row:nth-child(" + (rnum + 2) + ") .v-line")[lnum + 1]);
                        if (ts) {
                            $($(".row:nth-child(" + rnum + ") .square")[lnum]).addClass(cls);
                            scores[tc % 2] += 1;
                        }
                        if (bs) {
                            $($(".row:nth-child(" + (rnum + 2) + ") .square")[lnum]).addClass(cls);
                            scores[tc % 2] += 1;
                        }
                    }
                    if (ls || rs || ts || bs) {
                        $(".score span")[tc % 2].innerHTML = scores[tc % 2];
                        tc++;
                    }

                    $(e.target).addClass(cls);
                    tc++;
                    $(".score .color").removeClass("active");
                    $(".score:nth-child(" + (tc % 2 + 1) + ") .color").addClass("active");
                    if ((w - 1) * (h - 1) == scores[0] + scores[1]) {
                        $(".g-res span")[0].innerHTML = scores[0];
                        $(".g-res span")[1].innerHTML = scores[1];
                        if (scores[0] > scores[1]) {
                            $(".g-res .title")[0].innerHTML = "Blue wins!";
                            $(".g-res .side:nth-child(1)").addClass("winner");
                            $(".g-res .side:nth-child(2)").removeClass("winner");
                        } else {
                            if (scores[1] > scores[0]) {
                                $(".g-res .title")[0].innerHTML = "Red wins!";
                                $(".g-res .side:nth-child(2)").addClass("winner");
                                $(".g-res .side:nth-child(1)").removeClass("winner");


                            } else {
                                $(".g-res .title")[0].innerHTML = "Game Ties!";
                                $(".g-res .side:nth-child(1)").removeClass("winner");
                                $(".g-res .side:nth-child(2)").removeClass("winner");

                            }
                        }

                        $('.g-board').css("display", "none");
                        $('.g-res').css("display", "flex");

                        $(".ng-btn").click(function (e) {
                            tc = 0;
                            scores = [0, 0];
                            $(".scores span")[0].innerHTML = 0;
                            $(".scores span")[1].innerHTML = 0;
                            $(".row").remove();
                            $('.g-res').css("display", "none");
                            $('.g-mode').css("display", "flex");

                        });
                    }
                }

            });
        }
    });

});