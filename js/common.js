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

    public: {
        navFn: function () {
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
        }
    }
}