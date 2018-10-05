/*--------- 公用方法调用 ----------*/
yx.public.navFn();
yx.public.lazyImgFn();
yx.public.backUpFn();

var bannerPic = new Carousel();
bannerPic.init({
    id: 'bannerPic',
    autoPlay: true,
    intervalTime: 3000,
    loop: true,
    totalNum: 5,
    moveNum: 1,
    viewNum: 1,
    circle: true,
    moveWay: 'opacity'
});

var newProduct = new Carousel();
newProduct.init({
    id: 'newProduct',
    autoPlay: false,
    intervalTime: 3000,
    loop: true,
    totalNum: 8,
    moveNum: 4,
    viewNum: 4,
    circle: false,
    moveWay: 'position'
});

var sayPic = new Carousel();
sayPic.init({
    id: 'sayPic',
    autoPlay: false,
    intervalTime: 3000,
    loop: true,
    totalNum: 4,
    moveNum: 1,
    viewNum: 3,
    circle: false,
    moveWay: 'position'
});

//人气推荐选项卡
(function () {
    var titles = yx.ga('#recommend header li');
    var contents = yx.ga('#recommend .content');

    console.log('tab');
    for (var i = 0; i < titles.length; i++) {
        titles[i].index = i;
        titles[i].onclick = function () {
            for (var i = 0; i < titles.length; i++) {
                titles[i].className = '';
                contents[i].style.display = 'none';
            }
            titles[this.index].className = 'active';
            contents[this.index].style.display = 'block';
        }
    }
})();

//限时购
(function () {
    var timeBox = yx.g('#limit .timeBox');
    var spans = yx.ga('#limit .timeBox span');
    var timer = setInterval(showTime, 1000);

    //倒计时
    function showTime() {
        var endTime = new Date(2018, 9, 29, 13);
        if (new Date() < endTime) {
            var overTime = yx.cutTime(endTime);
            spans[0].innerHTML = yx.format(overTime.h);
            spans[1].innerHTML = yx.format(overTime.m);
            spans[2].innerHTML = yx.format(overTime.s);
        }
        else {
            clearInterval(timer);
        }
    }

    //商品数据
    var boxWrap = yx.g('#limit .boxWrap');
    var str = '';
    var item = json_promotion.itemList;
    for (var i = 0; i < item.length; i++) {
        var precent = parseInt(Number(item[i].currentSellVolume) / Number(item[i].totalSellVolume)*100);
        str += '<div class="limitBox left">\n' +
            '                <a href="#" class="scaleImg">\n' +
            '                    <img src="' + item[i].primaryPicUrl + '" alt="">\n' +
            '                </a>\n' +
            '                <div class="right">\n' +
            '                    <a href="#" class="title">' + item[i].itemName + '</a>\n' +
            '                    <p>' + item[i].simpleDesc + '</p>\n' +
            '                    <div class="numBar clearFix">\n' +
            '                        <div class="numCon left"><span style="width: ' + precent + '%"></span></div>\n' +
            '                        <span class="numTips left">还剩' + item[i].currentSellVolume + '件</span>\n' +
            '                    </div>\n' +
            '                    <div>\n' +
            '                        <span class="limitPrice">限时价</span>\n' +
            '                        <span class="currency">¥</span>\n' +
            '                        <span><strong>' + item[i].actualPrice + '</strong></span>\n' +
            '                        <span class="price">原价 ¥' + item[i].retailPrice + '</span>\n' +
            '                    </div>\n' +
            '                    <a href="#" class="atOnce">立即抢购</a>\n' +
            '                </div>\n' +
            '            </div>'
    }
    boxWrap.innerHTML = str;
})();