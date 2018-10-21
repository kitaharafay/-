window.yx = {
    g: function (name) {
        return document.querySelector(name);
    },

    ga: function (name) {
        return document.querySelectorAll(name);
    },

    addEvent: function (obj, eventName, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(eventName, fn);
        } else {
            obj.attachEvent('on' + eventName, fn);
        }
    },

    removeEvent: function (obj, eventName, fn) {
        if (obj.removeEventListener) {
            obj.removeEventListener(eventName, fn);
        } else {
            obj.detachEvent('on' + eventName, fn);
        }
    },

    getTopValue: function (obj) {
        var top = 0;
        while (obj.offsetParent) {
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return top;
    },

    cutTime: function (target) {
        var currentDate = new Date();
        var v = Math.abs(target - currentDate);

        return {
            d: parseInt(v / (24 * 3600000)),
            h: parseInt(v % (24 * 3600000) / 3600000),
            m: parseInt(v % (24 * 3600000) % 3600000 / 60000),
            s: parseInt(v % (24 * 3600000) % 3600000 % 60000 / 1000)
        };
    },

    format: function (v) {
        return v < 10 ? '0' + v : v;
    },

    parseUrl: function (url) {
        var reg = /(\w+)=(\w+)/ig;
        var result = {};
        url.replace(reg, function (a, b, c) {
            result[b] = c;
        });
        return result;
    },

    formatDate: function (time) {
        var d = new Date(time);
        return d.getFullYear() + '-' +
            yx.format(d.getMonth() + 1) + '-' +
            yx.format(d.getDate()) + ' ' +
            yx.format(d.getHours()) + ':' +
            yx.format(d.getMinutes());
    },

    public: {
        navFn: function () {//导航栏功能
            var nav = yx.g('.nav');
            var lis = yx.ga('.navBar li');
            var subNav = yx.g('.subNav');
            var uls = yx.ga('.subNav ul');
            var newLis = []; //存储实际有用的li

            for (var i = 1; i < lis.length - 3; i++) {
                newLis.push(lis[i]);
            }

            for (var i = 0; i < newLis.length; i++) {
                newLis[i].index = uls[i].index = i;
                newLis[i].onmouseenter = uls[i].onmouseenter = function () {
                    subNav.style.opacity = '1';
                    newLis[this.index].className = 'active';
                    uls[this.index].style.display = 'block';
                };
                newLis[i].onmouseleave = uls[i].onmouseleave = function () {
                    subNav.style.opacity = '0';
                    newLis[this.index].className = '';
                    uls[this.index].style.display = 'none';
                };
            }

            yx.addEvent(window, 'scroll', setNavPos);

            setNavPos();

            function setNavPos() {
                nav.id = window.pageYOffset > nav.offsetTop ? 'navFix' : '';
            }
        },

        backUpFn: function () {//回到顶部功能
            var back = yx.g('.back');
            var timer;
            back.onclick = function (ev) {
                var top = window.pageYOffset;
                timer = setInterval(function () {
                    top -= 168;
                    if (top <= 0) {
                        top = 0;
                        clearInterval(timer);
                    }
                    window.scrollTo(0, top);
                }, 16);
                ev.cancelBubble = true;
            }
        },
        shopFn() {//购物车功能
            //购物车添加商品
            var productNum = 0;
            (function (local) {
                var totalPrice = 0;
                var ul = yx.g('.cart ul')
                var li = '';
                ul.innerHTML = '';

                console.log(local.length);
                for (var i = 0; i < local.length; i++) {
                    var attr = local.key(i);
                    var value = JSON.parse(local[attr]);
                    console.log(value);

                    if (value && value.sign == 'productLocal') {
                        li += '<li data-id="' + value.id + '">\n' +
                            '   <a href="#" class="img"><img src="' + value.img + '"></a>\n' +
                            '   <div class="message">\n' +
                            '   <p><a href="#">' + value.name + '</a></p>\n' +
                            '   <p>' + value.spec.join(' ') + ' x ' + value.num + '</p>\n' +
                            '   </div>\n' +
                            '   <div class="price">¥ ' + value.price + '.00</div>\n' +
                            '   <div class="close">X</div>\n' +
                            '  </li>';

                        totalPrice += parseFloat(value.price) * parseFloat(value.num);
                    }
                }
                ul.innerHTML = li;

                //购物车里面有多少个商品
                productNum = ul.children.length;

                yx.g('.cartWrap i ').innerHTML = productNum;
                yx.g('.cartWrap .total span').innerHTML = '¥ ' + totalPrice + '.00';


                //删除按钮
                var closeBtns = yx.ga('.cart .list .close');
                for (var i = 0; i < closeBtns.length; i++) {
                    closeBtns[i].onclick = function () {
                        localStorage.removeItem(this.parentNode.getAttribute('data-id'));
                        yx.public.shopFn();
                    }
                }

                //小红圈事件
                var cartWrap = yx.g('.cartWrap');
                var timer;//解决购物车和弹出层的间隙会触发leave时间的问题
                if (ul.children.length > 0) {
                    cartWrap.onmouseenter = function () {
                        clearInterval(timer);
                        yx.g('.cart').style.display = 'block';
                        scrollFn();
                    }
                    cartWrap.onmouseleave = function () {
                        timer = setTimeout(function () {
                            yx.g('.cart').style.display = 'none';
                        }, 150);
                    }
                }

            }(localStorage));

            //购物车的滚动条
            function scrollFn() {
                var contentWrap = yx.g('.cart .list');
                var content = yx.g('.cart .list ul');
                var scrollBar = yx.g('.cart .scrollBar');
                var slide = yx.g('.cartWrap .cart .slide');
                var slideWrap = yx.g('.cart .sliderWrap');
                var btns = yx.ga('.scrollBar span');
                var timer;

                //倍数
                var beishu = content.offsetHeight / contentWrap.offsetHeight;

                //滑块拖拽：滚动条走的距离
                var scrollTop = 0;
                //滑块拖拽：滑块能走的最大距离

                scrollBar.style.display = beishu <= 1 ? 'none' : 'block';
                //倍数最大值
                beishu = beishu > 20 ? 20 : beishu;
                slide.style.height = slideWrap.offsetHeight / beishu + 'px';

                slide.onmousedown = function (ev) {
                    var disY = ev.clientY - slide.offsetTop;

                    document.onmousemove = function (ev) {
                        scrollTop = ev.clientY - disY;
                        scroll();
                    };

                    document.onmouseup = function () {
                        this.onmousemove = null;
                    };
                    ev.cancelBubble = true;
                    return false;
                };

                var maxHeight = slideWrap.offsetHeight - slide.offsetHeight;

                //滚轮滚动的功能
                myScroll(contentWrap,
                    function () {
                        scrollTop -= 10;
                        scroll();
                        clearInterval(timer);
                    },
                    function () {
                        scrollTop += 10;
                        scroll();
                        clearInterval(timer);
                    });

                //上下箭头点击的功能
                for (var i = 0; i < btns.length; i++) {
                    btns[i].index = i;
                    btns[i].onmousedown = function () {
                        var n = this.index;
                        timer = setInterval(function () {
                            scrollTop = n ? scrollTop + 2 : scrollTop - 2;
                            scroll();
                        }, 16);
                    }
                    btns[i].onmouseup = function () {
                        clearInterval(timer);
                    }
                }
                //滑块区域点击的功能
                slideWrap.onmousedown = function (ev) {
                    timer = setInterval(function () {
                        var slideTop = slide.getBoundingClientRect().top +
                            slide.offsetHeight / 2;
                        if (Math.abs(ev.clientY - slideTop) >= 5) {
                            if (ev.clientY < slideTop) {
                                scrollTop -= 5;
                            } else {
                                scrollTop += 5;
                            }
                        } else {
                            clearInterval(timer);
                        }

                        console.log('ev.clientY:', ev.clientY,
                            'slideTop:', slideTop,
                            'scrollTop', scrollTop);

                        if (!scroll()) {
                            clearInterval(timer);
                        }

                    }, 16);
                };

                //滚动条的主体功能
                function scroll() {
                    var flag = true;
                    if (scrollTop < 0) {
                        scrollTop = 0;
                        flag = false;
                    } else if (scrollTop > maxHeight) {
                        scrollTop = maxHeight;
                        flag = false;
                    } else {
                        flag = true;
                    }

                    var scaleY = scrollTop / maxHeight;
                    slide.style.top = scrollTop + 'px';
                    content.style.top = -(content.offsetHeight - contentWrap.offsetHeight) * scaleY + 'px';

                    return flag;
                }

                //滚轮事件
                function myScroll(obj, fnUp, fnDown) {
                    obj.onmousewheel = fn;
                    obj.addEventListener('DOMMouseScroll', fn);

                    function fn(ev) {
                        console.log('ev.wheelDelta:', ev.wheelDelta, 'ev.detail:', ev.detail);
                        if (ev.wheelDelta > 0 || ev.detail < 0) {
                            fnUp.call(obj);
                        } else {
                            fnDown.call(obj);
                        }
                        ev.preventDefault();
                        return false;
                    }
                }
            }
        },
        lazyImgFn: function () {
            //可视区的高与滚动条目前的距离
            yx.addEvent(window, 'scroll', delayImg);
            delayImg();

            function delayImg() {
                //所有需要懒加载的图片
                var originals = yx.ga('.original');
                //获得可视区的高度与滚动条的距离之和
                var scrollTop = window.innerHeight + window.pageYOffset;

                for (var i = 0; i < originals.length; i++) {
                    //如果图片离HTML的上边的距离小于滚动条的距离与可视区的距离之和的话，就表示图片已经进入到可视区了
                    if (yx.getTopValue(originals[i]) < scrollTop) {
                        console.log(1);
                        originals[i].src = originals[i].getAttribute('data-original');
                        originals[i].removeAttribute('class');
                    }
                }

                if (originals.length == 0) {
                    yx.removeEvent(window, 'scroll', delayImg);
                }
            }
        }
    }
}