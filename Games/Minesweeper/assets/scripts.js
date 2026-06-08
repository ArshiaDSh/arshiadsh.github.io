$(document).ready(function () {
    var bombs = [];
    var nums = [];
    var rcount;
    var ccount;
    var mcount;
    var ti = false;
    var tInterval;
    var a = 50;
    function main() {
        for (let row = 0; row < rcount; row++) {

            var content = "<div class='row'>";
            for (let col = 0; col < ccount; col++) {
                var number = (row * ccount) + col + 1;
                content += "<div class='col' num='" + number + "'></div>"
            }

            $(".play-board").append(content + "</div>");
        }

        if (rcount > 10 || ccount > 25) {
            let mh = 525 / rcount;
            let mw = 1312.5 / rcount;
            a = Math.min(mh, mw) - 0.5;
            $(".row").css("height", a);
            $('.col').css("width", a);
            $('.play-board').css("border-radius", 0.6 * a);

        }
        $(".col").on("contextmenu", function (e) {
            e.preventDefault()

        });

        $(".col").on("mousedown", function (e) {

            if (!ti) {
                tInterval = setInterval(timer, 1000);
                ti = true;
                var cnumber = parseInt($(e.target).attr("num"));
                let b = box(cnumber)

                for (let i = 0; i < mcount; i++) {
                    for (let index = 2; index > 1; index++) {
                        var newBomb = Math.floor(Math.random() * rcount * ccount) + 1;
                        if (!bombs.includes(newBomb) && !b.includes(newBomb) && newBomb != cnumber) {
                            bombs[i] = newBomb;
                            break;
                        }
                    }
                }
                for (let index = 1; index <= rcount * ccount; index++) {
                    var counter = 0;
                    if (!bombs.includes(index)) {
                        box(index).forEach(val => {
                            if (bombs.includes(val)) {
                                counter++;
                            }
                        });
                    } else {
                        counter = null;
                    }
                    nums[index - 1] = counter;
                }

            }

            switch (e.button) {
                case 0:
                    if ($(e.target).hasClass("flag") || $(e.target.firstChild).hasClass("flag")) {
                        var flag = true;
                    } else {
                        var flag = false;
                        var cnumber = parseInt($(e.target).attr("num"));
                    }

                    if (!$(e.target).hasClass("active") && !$(e.target.parentElement).hasClass("active") && !flag) {
                        if (nums[cnumber - 1] != null) {
                            var block = [cnumber];
                            let counter = 0;
                            while (counter < block.length) {
                                cnumber = block[counter]
                                if (nums[cnumber - 1] == 0) {
                                    box(cnumber).forEach(val => {
                                        bpush(block, val);
                                    });
                                }
                                counter++;
                            }

                            block.forEach(value => {
                                if (!$(".col[num=" + value + "]")[0].children.length) {
                                    $(".col[num=" + value + "]").addClass("active");
                                    if (nums[value - 1]) {
                                        $(".col[num=" + value + "]")[0].innerHTML = nums[value - 1];
                                    }
                                }
                            });
                        } else {
                            explode()
                        }
                    } else {
                        if (!flag) {
                            let counter = 0;
                            let b = box(cnumber);
                            b.forEach(val => {
                                if ($(".col[num=" + val + "]")[0].children.length > 0) {
                                    counter++;
                                }
                            });

                            if (counter == nums[cnumber - 1]) {
                                const rcs = new MouseEvent("mousedown", { button: 0, buttons: 0 })
                                b.forEach(val => {
                                    let coloumn = $(".col[num=" + val + "]")[0];
                                    if (!$(coloumn).hasClass("active") && !coloumn.children.length) {
                                        coloumn.dispatchEvent(rcs)
                                    }
                                })
                            }
                        }
                    }
                    if ($(".active").length == rcount * ccount - mcount) {
                        win();
                    }
                    break;
                case 2:
                    if (!$(e.target).hasClass("active")) {
                        if (!$(e.target).hasClass("flag")) {
                            if (e.target.children.length > 0) {
                                $(e.target.children[0]).remove();
                                $(".flag-count")[0].innerHTML = parseInt($(".flag-count")[0].innerHTML) + 1;

                            } else {
                                $(e.target).append("<div class='flag'></div>");

                                $('.col .flag').css("width", 0.6 * a);
                                $('.col .flag').css("height", 0.6 * a);
                                $(".flag-count")[0].innerHTML = parseInt($(".flag-count")[0].innerHTML) - 1;
                            }
                        } else {
                            $(e.target).remove();
                            $(".flag-count")[0].innerHTML = parseInt($(".flag-count")[0].innerHTML) + 1;
                        }
                    }
            }
        });

    }

    function numToCoordinate(number) {
        if (number <= rcount * ccount && number >= 1) {
            var row = number % ccount != 0 ? Math.floor(number / ccount) + 1 : number / ccount;
            var col = number % ccount != 0 ? number % ccount : ccount;
        } else {
            if (number > rcount * ccount) {
                row = rcount;
                col = 0
            } else {
                row = 1;
                col = 1;
            }
        }
        return {
            'row': row,
            'col': col
        };

    }

    function bpush(block, item) {
        if (!block.includes(item)) {
            block.push(item)

        }

    }

    function box(number) {
        res = [];
        for (let i = number - ccount - 1; i < number - ccount + 2; i++) {
            if (numToCoordinate(number).row - numToCoordinate(i).row == 1 && i >= 1) {
                res.push(i)
            }
            if (numToCoordinate(i + ccount * 2).row - numToCoordinate(number).row == 1 && i + ccount * 2 <= rcount * ccount) {
                res.push(i + ccount * 2)
            }
        }
        if (numToCoordinate(number).col - numToCoordinate(number - 1).col == 1) {
            res.push(number - 1);
        }
        if (numToCoordinate(number + 1).col - numToCoordinate(number).col == 1) {
            res.push(number + 1);
        }
        return res;
    }

    function explode() {
        bombs.forEach(val => {
            let col = $(".col[num=" + val + "]")[0]

            if (col.children.length == 0) {
                $(col).append("<div class='bomb'></div>");
            }
        });
        $('.col .bomb').css("width", 0.4 * a);
        $('.col .bomb').css("height", 0.4 * a);

        gOver();
        $(".result")[0].innerHTML = "You Lost :(";
        $(".time").css("color", "#ff3434ff");


    }

    function win() {
        gOver();
        $(".result")[0].innerHTML = "You Won!";
        $(".time").css("color", "#6cff6c");

    }

    function gOver() {
        clearInterval(tInterval);
        ti = false;
        $(".col").off();
        $(".play-board").css("z-index", "-1");
        $(".flag-con").css("display", "none");
        $(".timer").css("display", "none");
        $(".game-over").css("display", "flex");
        $(".time")[0].innerHTML = $(".timer")[0].innerHTML;
    }

    function timer() {
        $(".timer")[0].innerHTML = (parseInt($(".timer")[0].innerHTML.split("s")[0]) + 1) + "s";
    }

    $(".btn").click(function (e) {
        rcount = parseInt($(".w input").val());
        ccount = parseInt($(".h input").val());
        mcount = parseInt($(".mine input").val());
        if (rcount > 5 && ccount > 5 && rcount < 31 && ccount < 31 && mcount < rcount * ccount - 9) {
            $(".cords").css("display", 'none');
            $(".play-board").css("display", 'block');
            $(".counter").css("display", 'flex');
            $(".flag-count")[0].innerHTML = mcount;
            $(".timer")[0].innerHTML = "0s";
            bombs = [];
            nums = [];
            main(rcount, ccount, mcount);
        }
    });

    $(".reset-btn").click(function (e) {
        $(".row").remove();
        $(".play-board").css("z-index", "0");
        $(".cords").css("display", 'flex');
        $(".flag-con").css("display", 'flex');
        $(".timer").css("display", 'flex');
        $(".game-over").css("display", 'none');
        $(".play-board").css("display", 'none');
        $(".counter").css("display", 'none');


    });

});