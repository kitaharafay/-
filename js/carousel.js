;(function (window, undefined) {
    var Carousel = function () {
        this.settings = {
            id: 'pic',
            autoPlay: true,
            intervalTime: 1000,
            loop: true,
            totalNum: 5,
            moveNum: 1,
            viewNum: 1,
            circle: true,
            moveWay: 'opacity'
        };
    };

    Carousel.prototype = {
        constructor: Carousel,
        init: function (opt) {
            var opt = opt || this.settings;
            for (var attr in opt) {
                this.settings[attr] = opt[attr];
            }
            this.createDom();
        },
        createDom: function () {
            var self = this;
            this.box = document.getElementById(this.settings.id);
            console.log(this.box);
            //prev button
            this.prevBtn = document.createElement('div');
            this.prevBtn.className = 'prev';
            this.prevBtn.innerHTML = '&lsaquo;';
            this.prevBtn.onclick = function () {
                self.prevFn();
            };
            this.box.appendChild(this.prevBtn);

            //next button
            this.nextBtn = document.createElement('div');
            this.nextBtn.className = 'next';
            this.nextBtn.innerHTML = '&rsaquo;';
            this.nextBtn.onclick = function () {
                self.nextFn();
            };
            this.box.appendChild(this.nextBtn);

            //创建圆点
            this.circleWrap = document.createElement('div');
            this.circleWrap.className = 'circle';
            this.circles = [];
            for (var i = 0; i < parseInt(this.settings.totalNum / this.settings.moveNum); i++) {
                var span = document.createElement('span');
                span.index = i;

                span.onclick = function () {

                };

                this.circleWrap.appendChild(span);
                this.circles.push(span);
            }

            this.circles[0].className = 'active';

            if (this.settings.circle) {
                this.box.appendChild(this.circleWrap);
            }

            this.moveInit();
        },

        moveInit: function () {
            this.currentIndex = 0;
            this.lastIndex = 0;
            this.canClick = true;
            this.endNum = parseInt(this.settings.totalNum / this.settings.moveNum);
            this.opacityItem = this.box.children[0].children;
            this.positionItemWrap = this.box.children[0].children[0];
            this.positionItem = this.positionItemWrap.children;

            switch (this.settings.moveWay) {
                case 'opacity':
                    for (var i = 0; i < this.opacityItem.length; i++) {
                        this.opacityItem[i].style.opacity = '0';
                        this.opacityItem[i].style.transition = 'opacity 0.3s';
                    }
                    this.opacityItem[0].style.opacity = '1';
                    break;
                case 'position':
                    console.log(this.positionItem[0]);
                    var leftMargin = parseInt(getComputedStyle(this.positionItem[0]).marginLeft);
                    var rightMargin = parseInt(getComputedStyle(this.positionItem[0]).marginRight);
                    this.singleWidth = leftMargin + this.positionItem[0].offsetWidth + rightMargin;
                    if (this.settings.loop) {
                        this.positionItemWrap.innerHTML += this.positionItemWrap.innerHTML;
                    }
                    this.positionItemWrap.style.width = this.singleWidth * this.positionItem.length + 'px';
                    break;
            }

            this.autoPlay();
        },

        opacityFn: function () {
            if (this.settings.loop) {
                if (this.currentIndex < 0) {
                    this.currentIndex = this.settings.totalNum - 1;
                } else if (this.currentIndex > this.settings.totalNum - 1) {
                    this.currentIndex = 0;
                }
            } else {
                if (this.currentIndex < 0) {
                    this.currentIndex = 0;
                    this.canClick = true;
                } else if (this.currentIndex > this.settings.totalNum - 1) {
                    this.currentIndex = this.settings.totalNum - 1;
                    this.canClick = true;
                }
            }

            this.opacityItem[this.lastIndex].style.opacity = '0';
            this.circles[this.lastIndex].className = '';

            this.opacityItem[this.currentIndex].style.opacity = '1';
            this.circles[this.currentIndex].className = 'active';

            var self = this;
            var en = 0;
            this.opacityItem[this.currentIndex].addEventListener('transitionend', function () {
                en++;
                if (en == 1) {
                    self.canClick = true;
                    self.lastIndex = self.currentIndex;
                }
            });
        },

        positionFn: function () {
            var self = this;
            if (!this.settings.loop) {
                if (this.currentIndex < 0) {
                    this.currentIndex = 0;
                    this.canClick = true;
                } else if (this.currentIndex > this.endNum - 1) {
                    this.currentIndex = this.endNum - 1;
                    this.canClick = true;
                }
            } else {
                if (this.currentIndex < 0) {
                    this.currentIndex = this.endNum - 1;
                    this.positionItemWrap.style.left = -this.positionItemWrap.offsetWidth / 2 + 'px';
                    this.canClick = true;
                }
            }

            if (this.settings.circle) {
                this.circles[this.lastIndex].className = '';
                this.circles[this.currentIndex].className = 'active';
            }

            move(this.positionItemWrap, {
                left: -this.currentIndex * this.singleWidth * this.settings.moveNum
            }, 300, 'linear', function () {
                console.log(self.currentIndex);
                if (self.currentIndex == self.endNum) {
                    this.style.left = '0';
                    self.currentIndex = 0;
                }
                self.canClick = true;
                self.lastIndex = self.currentIndex;
            });
        },

        prevFn: function () {
            if (!this.canClick) {
                return;
            }
            this.canClick = false;
            this.currentIndex--;
            this[this.settings.moveWay + 'Fn']();
        },

        nextFn: function () {
            if (!this.canClick) {
                return;
            }
            this.canClick = false;
            this.currentIndex++;
            this[this.settings.moveWay + 'Fn']();
        },

        autoPlay: function () {
            if (!this.settings.autoPlay) return;
            var self = this;
            var timer = setInterval(function () {
                self.nextFn();
            }, this.settings.intervalTime);
        }
    };

    window.Carousel = Carousel;
})(window, undefined);