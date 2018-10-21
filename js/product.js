yx.public.navFn();
yx.public.backUpFn();

var params = yx.parseUrl(window.location.href);
var pageId = params.id;
var curData = productList[pageId];
if (!pageId || !curData) {
    window.location.href = '/WangYi-Yanxuan-homepage/assembly/404.html'
}

//面包屑的功能
var positionFn = yx.g('#position');
positionFn.innerHTML = '<a href="#">首页</a>';
for (var i = 0; i < curData.categoryList.length; i++) {
    positionFn.innerHTML += '><a href="#">' + curData.categoryList[i].name + '</a>';
}
positionFn.innerHTML += ('> ' + curData.name);

//产品图片功能
(function () {
    var bigImg = yx.g('#productImg .left img');
    var smallImgs = yx.ga('#productImg .smallImg img');

    bigImg.src = smallImgs[0].src = curData.primaryPicUrl;
    var last = smallImgs[0];
    for (var i = 0; i < smallImgs.length; i++) {
        if (i) {
            smallImgs[i].src = curData.itemDetail['picUrl' + i];
        }
        smallImgs[i].index = i;
        smallImgs.onmouseover = function () {
            bigImg.src = this.src;
            last.className = '';
            this.className = 'active';
            last = this;
        }
    }

    yx.g('#productImg .info h2').innerHTML = curData.name;
    yx.g('#productImg .info p').innerHTML = curData.simpleDesc;
    yx.g('#productImg .info .price').innerHTML =
        '<div><span>售价</span><strong>¥' + curData.retailPrice + '</strong></div>\n' +
        '            <div><span>促销</span><a href="' + curData.hdrkDetailVOList[0].huodongUrlPc + '" class="tag">' + curData.hdrkDetailVOList[0].activityType + '</a><a href="#" class="discount">' + curData.hdrkDetailVOList[0].name + '</a></div>\n' +
        '            <div>\n' +
        '                <span>服务</span>\n' +
        '                <i></i><a href="#" class="service">30天无忧退货</a>\n' +
        '                <i></i><a href="#" class="service">48小时快速退款</a>\n' +
        '                <i></i><a href="#" class="service">满88元免邮费</a>\n' +
        '                <i></i><a href="#" class="service">网易自营品牌</a>\n' +
        '            </div>';

    var format = yx.g('#productImg .format');
    var dds = [];
    for (var i = 0; i < curData.skuSpecList.length; i++) {
        var dl = document.createElement('dl');
        var dt = document.createElement('dt');
        dt.innerText = curData.skuSpecList[i].name;
        dl.appendChild(dt);

        for (var j = 0; j < curData.skuSpecList[i].skuSpecValueList.length; j++) {
            var dd = document.createElement('dd');
            dd.innerHTML = curData.skuSpecList[i].skuSpecValueList[j].value;
            dd.setAttribute('data-id', curData.skuSpecList[i].skuSpecValueList[j].id);
            dd.onclick = function () {
                changeProduct.call(this);
            };
            dds.push(dd);
            dl.appendChild(dd);
        }
        format.appendChild(dl);
    }

    function changeProduct() {
        console.log(this);
        if (this.className.indexOf('noClick') != -1) {
            return;
        }

        var curId = this.getAttribute('data-id');
        var othersDd = [];
        var mergeId = [];

        for (var attr in curData.skuMap) {
            if (attr.indexOf(curId) != -1) {
                var otherId = attr.replace(curId, '').replace(';', '');

                for (var i = 0; i < dds.length; i++) {
                    if (dds[i].getAttribute('data-id') == otherId) {
                        othersDd.push(dds[i]);
                    }
                }

                mergeId.push(attr);
            }
        }
        //console.log(othersDd, mergeId);
        var brothers = this.parentNode.querySelectorAll('dd');
        if (this.className == 'active') {
            this.className = '';
            for (var i = 0; i < othersDd.length; i++) {
                if (othersDd[i].className == 'noClick') {
                    othersDd[i].className = '';
                }
            }
        } else {
            for (var i = 0; i < brothers.length; i++) {
                if (brothers[i].className == 'active') {
                    brothers[i].className = '';
                }
            }

            this.className = 'active';

            for (var i = 0; i < othersDd.length; i++) {
                if (othersDd[i].className == 'noClick') {
                    othersDd[i].className = '';
                }
                if (curData.skuMap[mergeId[i]].sellVolume == 0) {
                    othersDd[i].className = 'noClick';
                }
            }
        }
        addNum();
    }

    //加减功能
    addNum();

    function addNum() {
        var actives = yx.ga('#productImg .format .active');
        var btnParents = yx.g('#productImg .number div');
        var btns = btnParents.children;
        var ln = curData.skuSpecList.length;  //规格的数量

        //是否打开加减的功能
        if (actives.length == ln) {
            btnParents.className = '';
        } else {
            btnParents.className = 'noClick';
        }

        //减
        btns[0].onclick = function () {
            if (btns[1].value - 1 < 0 || btnParents.className.indexOf('noClick') != -1) return;
            btns[1].value--;
        };

        //input
        btns[1].onfocus = function () {
            if (btnParents.className) {
                this.blur();
            }
        };

        //加
        btns[2].onclick = function () {
            if (btnParents.className.indexOf('noClick') != -1) return;
            btns[1].value++;
        };
    }

}());

//详情
(function () {
    //详情与评价选项卡
    var as = yx.ga('#bottom .title a');
    var tabs = yx.ga('#bottom .content>div');
    var ln = 0;

    for (var i = 0; i < as.length; i++) {
        as[i].index = i;
        as[i].onclick = function () {
            as[ln].className = '';
            tabs[ln].style.display = 'none';
            this.className = 'active';
            tabs[this.index].style.display = 'block'
            ln = this.index;
        }
    }

    //详情内容还产品参数
    var tbody = yx.g('.details tbody');

    for (var i = 0; i < curData.attrList.length; i++) {
        if (i % 2 == 0) {
            var tr = document.createElement('tr');
        }
        var th = document.createElement('th');
        var td = document.createElement('td');
        th.innerHTML = curData.attrList[i].attrName;
        td.innerHTML = curData.attrList[i].attrValue;
        tr.appendChild(th);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    //详情图片列表
    var img = yx.g('.details .img');
    img.innerHTML = curData.itemDetail.detailHtml;
}());

//加入购物车
(function () {
    yx.public.shopFn();

    var joinBtn = yx.g('#productImg .join');
    joinBtn.onclick = function () {
        var actives = yx.ga('#productImg .format .active');
        var selectNum = yx.g('#productImg .number input').value;

        if (actives.length < curData.skuSpecList.length || selectNum < 1) {
            alert('请选择正确的规格以及数量');
            return;
        }

        var id = '';
        var spec = [];
        for (var i = 0; i < actives.length; i++) {
            id += actives[i].getAttribute('data-id') + ';';
            spec.push(actives[i].innerHTML);
        }
        id = id.substr(0, id.length - 1);
        var select = {
            "id": id,
            "name": curData.name,
            "price": curData.retailPrice,
            "num": selectNum,
            "spec": spec,
            "img": curData.skuMap[id].picUrl,
            "sign": "productLocal",
        };
        localStorage.setItem(id, JSON.stringify(select));
        yx.public.shopFn();

        var cartWrap = yx.g('.cartWrap');
        cartWrap.onmouseenter();
        setTimeout(function() {
            yx.g('.cart').style.display='none';
        },1000)
    }
}());

//大家都在看
(function () {
    var ul = yx.g('#look ul');
    var str = '';
    for (var i = 0; i < recommendData.length; i++) {
        str += '<li>\n' +
            '     <a href="#" class="scaleImg"><img src="' + recommendData[i].listPicUrl + '" alt=""></a>\n' +
            '     <a href="#">' + recommendData[i].name + '</a>\n' +
            '     <span>¥ ' + recommendData[i].retailPrice + '</span>\n' +
            '</li>';
    }
    ul.innerHTML = str;

    var allLook = new Carousel();
    allLook.init({
        id: 'allLook',
        autoPlay: false,
        intervalTime: 3000,
        loop: false,
        totalNum: 8,
        moveNum: 4,
        viewNum: 4,
        circle: false,
        moveWay: 'position'
    });

}());

//评价
(function () {
    //修改标题上的文字
    var evaluate = commentData[pageId].data.result;
    var evaluateNum = evaluate.length;
    var evaluateText = evaluateNum > 1000 ? '999+' : evaluateNum;
    yx.ga('#bottom .title a')[1].innerHTML = '评价<span>（' + evaluateText + '）</span>';

    var allData = [[], []];
    for (var i = 0; i < evaluateNum; i++) {
        allData[0].push(evaluate[i]);
        if (evaluate[i].picList.length) {
            allData[1].push(evaluate[i]);
        }
    }

    yx.ga('#bottom .eTitle span')[0].innerHTML = '全部（' + allData[0].length + '）';
    yx.ga('#bottom .eTitle span')[1].innerHTML = '有图（' + allData[1].length + '）';

    var curData = allData[0];
    var btns = yx.ga('#bottom .eTitle div');
    var ln = 0;

    for (var i = 0; i < btns.length; i++) {
        btns[i].index = i;
        btns[i].onclick = function () {
            btns[ln].className = ''
            this.className = 'active';
            ln = this.index;

            curData = allData[this.index];
            showComment(10, 0);
        }
    }

    //显示评价数据
    showComment(10, 0);

    function showComment(pn, cn) {
        //pn一页显示几条数据
        //cn显示哪页
        var ul = yx.g('#bottom .border>ul');
        var dataStart = pn * cn;
        var dataEnd = dataStart + pn;

        if (dataEnd > curData.length) {
            dataEnd = curData.length;
        }

        //主体结构
        var str = '';
        ul.innerHTML = '';
        for (var i = dataStart; i < dataEnd; i++) {
            var avatart = curData[i].frontUserAvatar ?
                curData[i].frontUserAvatar : '../WangYi-Yanxuan-homepage/images/wangyi/avatar.png';

            var smallImg = '';
            var dialog = '';
            if (curData[i].picList.length) {
                //如果这个条件满足的话，说明这条评论有小图以及轮播图
                var span = '';
                var li = '';
                for (var j = 0; j < curData[i].picList.length; j++) {
                    span += '<span><img src="' + curData[i].picList[j] + '" alt=""></span>';
                    li += '<li><img src="' + curData[i].picList[j] + '" alt=""></li>';
                }

                smallImg = '<div class="smallImg clearFix">' + span + '</div>';
                dialog = '<div class="dialog" id="commentImg1' + i + '" data-imgnum="' + curData[i].picList.length + '">\n' +
                    '                  <div class="carouselImgCon">\n' +
                    '                       <ul>\n' + li +
                    '                       </ul>\n' +
                    '                  </div>\n' +
                    '                  <div class="close">X</div>\n' +
                    '                  <div class="prev">&lsaquo;</div>\n' +
                    '                  <div class="next">&rsaquo;</div>\n' +
                    '           </div>\n'
            }

            str += '<li>\n' +
                '       <div class="avatar">\n' +
                '           <img src="' + avatart + '" alt="">\n' +
                '           <a href="#" class="vip1"></a><span>' + curData[i].frontUserName + '</span>\n' +
                '       </div>\n' +
                '       <div class="text">\n' +
                '           <p>' + curData[i].content + '</p>\n' + smallImg +
                '           <div class="color clearFix">\n' +
                '                 <span class="left">' + curData[i].skuInfo + '</span>\n' +
                '                 <span class="right">' + yx.formatDate(curData[i].createTime) + '</span>\n' +
                '           </div>\n' + dialog +
                '      </div>\n' +
                ' </li>';
        }
        ul.innerHTML = str;

        showImg();
    }

    //轮播图功能
    function showImg() {
        var spans = yx.ga('#bottom .smallImg span');
        for (var i = 0; i < spans.length; i++) {
            spans[i].onclick = function () {
                var dialog = this.parentNode.parentNode.lastElementChild;
                dialog.style.opacity = '1';
                dialog.style.height = '510px';
                console.log(1);

                var en = 0;
                dialog.addEventListener('transitionend', function () {
                    en++;
                    if (en == 1) {
                        var id = this.id;
                        var commentImg = new Carousel();
                        commentImg.init({
                            id: id,
                            totalNum: dialog.getAttribute('data-imgnum'),
                            autoPlay: false,
                            loop: false,
                            moveNum: 1,
                            circle: false,
                            moveWay: 'position'
                        });
                    }
                });

                var closeBtn = dialog.querySelector('.close');
                closeBtn.onclick = function () {
                    dialog.style.opacity = '0';
                    dialog.style.height = '0';
                }
            }
        }
    }

    //页码功能
    createPage(10, curData.length);

    function createPage(pn, tn) {
        //pn 显示页码的数量
        //tn 数据的总数
        var page = yx.g('.page');
        var totalNum = Math.ceil(tn / pn);  //最多能显示的页码数量

        if (pn > totalNum) {
            pn = totalNum;
        }
        page.innerHTML = '';
        var cn = 0; //当前点击的页码的索引
        var spans = [];
        var div = document.createElement('div');
        div.className = 'mainPage';

        var indexPage = pageFn('首页', function () {
            for (var i = 0; i < pn; i++) {
                spans[i].innerHTML = i + 1;
            }
            cn = 0;
            showComment(10, 0);
            changePage();
            console.log('首页');
        });
        if (indexPage) {
            indexPage.style.display = 'none';
        }

        var prevPage = pageFn('&lsaquo; 上一页', function () {
            if (cn > 0) {
                cn--;
            }
            showComment(10, spans[cn].innerHTML - 1);
            changePage();
            console.log('&lsaquo; 上一页');
        });
        if (prevPage) {
            prevPage.style.display = 'none';
        }

        for (var i = 0; i < pn; i++) {
            var span = document.createElement('span');
            span.index = i;
            span.innerHTML = i + 1;
            spans.push(span);

            span.className = i ? '' : 'active';

            span.onclick = function () {
                cn = this.index;
                showComment(10, this.innerHTML - 1);
                changePage();
            };

            div.appendChild(span);
        }
        page.appendChild(div);

        var nextPage = pageFn('下一页 &rsaquo;', function () {
            if (cn < spans.length - 1) {
                cn++;
            }
            showComment(10, spans[cn].innerHTML - 1);
            changePage();
            console.log('下一页 &rsaquo;');
        });

        var lastPage = pageFn('尾页', function () {
            var end = totalNum;
            for (var i = pn - 1; i >= 0; i--) {
                spans[i].innerHTML = end--;
            }
            cn = spans.length - 1;
            showComment(10, totalNum - 1);
            changePage();
            console.log('尾页');
        });

        //创建页码的公用函数
        function pageFn(inner, fn) {
            if (pn < 2) { //如果页码数量没超过2页就不创建功能页码
                return;
            }
            var span = document.createElement('span');
            span.innerHTML = inner;
            span.onclick = fn;
            page.appendChild(span);

            return span;
        }

        //更新页码功能
        function changePage() {

            var cur = spans[cn];   //当前点击的页码
            var curInner = cur.innerHTML;

            var differ = Number(spans[spans.length - 1].innerHTML) - Number(spans[0].innerHTML)

            if (cur.index == spans.length - 1) {//页码增加
                if (Number(cur.innerHTML) + differ > totalNum) {
                    differ = totalNum - cur.innerHTML;
                }
                console.log('此时页面增加：', differ);
            }

            if (cur.index == 0) {//页码减少
                if (cur.innerHTML - differ < 1) {
                    differ = cur.innerHTML - 1;
                }
                console.log('此时页面减少：', differ);
            }

            for (var i = 0; i < spans.length; i++) {

                if (cur.index == spans.length - 1) {
                    spans[i].innerHTML = Number(spans[i].innerHTML) + differ;
                }

                if (cur.index == 0) {
                    spans[i].innerHTML -= differ;
                }

                spans[i].className = '';
                console.log(spans[i].innerHTML, curInner, q = spans[i].innerHTML == curInner ? true : false);
                if (spans[i].innerHTML == curInner) {
                    spans[i].className = 'active';
                    cn = spans[i].index;
                }
            }

            if (pn > 1) {
                var dis = curInner == 1 ? 'none' : 'inline-block';
                indexPage.style.display = prevPage.style.display = dis;

                var dis = curInner == totalNum ? 'none' : 'inline-block';
                lastPage.style.display = nextPage.style.display = dis;
            }
        }
    }
}());