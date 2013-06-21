/*
    @name        Jupicker
    @date        2013-4-22
    @author        linkjun aliwangwang:连延卿
    @extends    kissy 1.2.0
 */
KISSY.add(function (S, DOM, Template, Ajax, DataLazyload) {
    var Jupicker = function(_config){
        var
        _this = this,
        config = {
            'limit' : 40,                         //分批异步数
            'containers' : '.J_jupicker',             //钩子 Class
            'data_item' : 'data-item',            //attr itemsId
            'data_template' : 'data-template',    //attr template "#J-Tmp" || "default"
            'url':'http://ju.taobao.com/json/tg/AjaxGetJsonItems.htm',      //接口
            'class_done' : 'jupicker-complete',   //完成后添此Class
            'autoload' : true,                    //是否自动加载
            'clear' : false,                      //清扫容器内容
            'callback' : null,                    //complete 调用函数
            'idtype' : 'item',                    //请求的ID类型 'item' , 'ju'
            'imglazyload' : false,               //是否开启懒加载
            'template' : null,                    //统一模板 {String || ElementNode || KISSY.Node}
            'trace' : false                       //是否追踪商品异常状态
        };

        //自动匹配配置
        for(var configI in config ){
            if(_config[configI] != undefined){
                _this[configI] = _config[configI];
            }else{
                _this[configI] = config[configI];
            }
        }

        _this.allItems = {};//所有的Item数据
        _this.containersDOM = [];//各个区块的DOM
        _this.itemId = [];//各个区块的itemId
        _this.itemTemplate = [];//各个区块的模板名称
        _this.batchItems = [];//分批ItemId
        _this.successfulItemCount = 0;//成功取到的个数
        _this.currentTime = new Date().getTime();//当前时间

        _this.templateHtml = {
            'default' : '<div class="ju-itemlist">\
                            <ul class="clearfix midimg">\
                                {{#each list as item}}\
                                    <li class="{{item.state}}" data-itemid="{{item.itemId}}">\
                                        <a target="_blank" href="{{item.juUrl}}" class="link-box" title="{{item.longName}}">\
                                            <img class="item-pic" src="{{item.picUrl}}_300x300.jpg">\
                                            <i class="soldout-mask"></i>\
                                            <h3>{{item.shortName}}</h3>\
                                            <div class="item-prices">\
                                                <span class="price"><i>&yen;</i><em>{{item.activityPriceInt}}</em>.{{item.activityPriceDecimal}}</span>\
                                                <div class="dock">\
                                                    <span class="discount"><em>{{item.discount}}</em>折</span>\
                                                    <del class="orig-price">&yen;{{item.originalPrice}}</del>\
                                                </div>\
                                                {{#if item.state == "notbegin"}}\
                                                    {{#if item.remindNum != "0"}}\
                                                        <span class="sold-num"><em>{{item.remindNum}}</em>人想买</span>\
                                                    {{#else}}\
                                                        <span class="sold-num">即将开团</span>\
                                                    {{/if}}\
                                                {{#else}}\
                                                    <span class="sold-num"><em>{{item.soldCount}}</em>人已买</span>\
                                                {{/if}}\
                                            </div>\
                                        </a>\
                                    </li>\
                                {{/each}}\
                            </ul>\
                        </div>'
        };

        if(_this.autoload === true){
            _this.init();
        }

    } //Juitem fun end

    Jupicker.prototype = {
        //获取itemid
        'getItemid' : function(){
            var
            _this = this,
            _container = typeof _this.containers === 'string' ? S.all(_this.containers) : _this.containers,
            _itemCount = 1;

            //清除容器
            _this.containersDOM.length = 0;
            //获取item容器集 放入containersDOM中
            S.each(_container, function(item){
                _this.containersDOM.push(S.one(item));
            });


            //清除itemId
            _this.itemId.length = 0;
            //处理containersDOM
            for (var i = 0; i < _this.containersDOM.length; i++) {

                var
                _containers = _this.containersDOM[i],
                _itemsidStr = DOM.attr(_this.containersDOM[i],_this.data_item) || '',
                _itemsid = _itemsidStr.replace(/[^\d^,]/g,'').split(','),//替换非数字非逗号以外
                _itemTemplateName = DOM.attr(_this.containersDOM[i],_this.data_template),
                _itemTemplate = null;//获取钩子的 template:String

                //清除容器Complete状态
                _containers.removeClass(_this.class_done);
                //_this.itemTemplate[i] = _itemTemplate || _this.templateHtml[_itemTemplateName] || _this.templateHtml['default'];
                
                //开始匹配DOM属性所给予的模板钩子
                if(_itemTemplateName){
                    _itemTemplate = S.one(_itemTemplateName)? S.one(_itemTemplateName).html() : false;//获取DOM attr 的 template
                    _this.itemTemplate[i] = _itemTemplate || _this.templateHtml[_itemTemplateName] || _this.templateHtml['default'];
                }else if(_this.template){
                    //如果没有找到则使用config的模板
                    _itemTemplate = S.one(_this.template)? S.one(_this.template).html() : false;//获取配置中的tmplate
                    _this.itemTemplate[i] = _itemTemplate || _this.templateHtml[_this.template] || _this.template;

                }else{
                    //两者都没有找到则使用默认模板
                    _this.itemTemplate[i] = _this.templateHtml['default'];
                }

                //懒加载
                if(_this.imglazyload){
                    //替换所有的src为懒加载
                    _this.itemTemplate[i] = _this.itemTemplate[i].replace(/src/gi,'data-ks-lazyload');
                }

                
                if(_this.itemId[i] === undefined){
                    _this.itemId[i] = [];
                }
                //放入数据组中
                for (var _i = 0; _i < _itemsid.length; _i++) {
                    if(_itemsid[_i] != ''){
                        _this.allItems[_itemsid[_i]] = 'null';
                        _this.itemId[i][_i] = _itemsid[_i];
                    }
                   
                }
            }

            //放入分批请求数据集
            _this.batchItems.length = 0;
            for (_item in _this.allItems) {
                var _i = Math.ceil(_itemCount/_this.limit) - 1;

                if(!_this.batchItems[_i]){
                    _this.batchItems[_i] = [];
                }

                _this.batchItems[_i].push(_item);
                //总值计数递加
                _itemCount++;
            }
        },


        //item分批请求
        'getItemData' : function (){
            var
            _this = this,
            _batchTimeout,//防堵塞延迟请求
            _getCount = 0,//请求计数
            _doneCount = 1;//数据完成计数

            //开始请求数据源
            (function _getData(){
                //get Request Data
                _getRequestData(_getCount);

                if(_getCount < _this.batchItems.length - 1){
                    _batchTimeout = setTimeout(_getData,200);
                    _getCount++;
                }
            })();

            //请求数据源
            function _getRequestData(_val){
                var
                _idtype = _this.idtype + 'Ids',
                _data = _idtype +'=' + (_this.batchItems[_val] || []).toString();
                S.io({
                    dataType:'jsonp',
                    url:_this.url,
                    processData:false,
                    data:_data,
                    jsonp:"callback",
                    success:function (data) {
                        var
                        _list = data.itemList;

                        //处理数据
                        for(var i = 0; i < _list.length; i++){
                            var _id = String(_list[i][_this.idtype + 'Id']);
                            //赋值给allItems
                            if(_this.allItems[_id] === 'null'){
                                _this.allItems[_id] = _list[i];
                            }
                        }
                        //刷新当前时间
                        _this.currentTime = Number(data.currentTime);

                        if(_doneCount >= _this.batchItems.length){
                            _this.dataComplete();
                        }
                        _doneCount++;
                    }
                });
            }

        },///getItemData


        //数据加载完毕
        'dataComplete' : function (){
            var
            _this = this,
            _dyeCount = 0;//模板渲染次数

            //分批渲染
            (function dyeBatch(){
                var
                _containers = S.one(_this.containersDOM[_dyeCount]),
                _items = _this.itemId[_dyeCount],//当前容器需要填充的商品id
                _template = _this.itemTemplate[_dyeCount],
                _data = [];
                for(var i = 0; i < _items.length; i++){

                    var
                    _id = _this.itemId[_dyeCount][i],
                    _val = null,
                    _irandom = Math.ceil(Math.random()*7),
                    _picUrl = 'http://img0'+_irandom+'.taobaocdn.com/bao/uploaded/i'+_irandom;

                    if(_this.allItems[_id] && _this.allItems[_id]!= 'null'){
                        _val = _this.allItems[_id];
                        if(!_val['raped']){
                            //图片
                            _val['picUrl'] = _picUrl + _val['picUrl'].substr(2);
                            //原价
                            _val['originalPrice'] = Number(Number(_val['originalPrice'])/100).toFixed(2);
                            //现价
                            _val['activityPrice'] = Number(Number(_val['activityPrice'])/100).toFixed(2);
                            //现价整数
                            _val['activityPriceInt'] = _val['activityPrice'].split('.')[0];
                            //现价浮点数
                            _val['activityPriceDecimal'] = _val['activityPrice'].split('.')[1];
                            //链接
                            _val['juUrl'] = 'http://ju.taobao.com/tg/home.htm?id=' + _val['juId'];

                            //状态
                            _val.state = (function(){
                                if(_val.onlineStartTime > _this.currentTime){
                                    return 'notbegin';//还未开团
                                }else if(_val.onlineStartTime < _this.currentTime && _val.isLock === '0'){
                                    return 'soldout';//已售完
                                }

                                return '';
                            })();

                            //施爆完毕
                            _val['raped'] = 'true';

                        }
                        //加入数据集
                        _data.push(_val);
                    }else{
                        if(_this.trace){
                            var _log = 'ID:['+_this.itemId[_dyeCount][i]+']商品已下架或者尚未录入!';
                            
                            if(!window.console){
                                try{
                                    console.warn(_log);
                                }catch(e){
                                    
                                }
                            }
                            
                        }//if(_this.trace) end
                        
                    }
                }//for
                
                //是否清除容器遗留内容
                if(_this.clear){
                    _containers.html(Template(_template).render({'list':_data}));
                }else{
                    _containers.append(Template(_template).render({'list':_data}));
                }
                
                _containers.addClass(_this.class_done);//添加完成Class标示符
                _dyeCount++;
                if(_dyeCount < _this.itemId.length){
                    setTimeout(dyeBatch,200);
                }else{
                    //懒加载
                    if(_this.imglazyload){
                        S.DataLazyload({'diff':200});
                    }

                    //太艰辛了， 终于complete
                    if(_this.callback){
                        _this.callback({
                            'containers' : _this.containersDOM,    //所有容器
                            'items' : _this.itemId              //所有itemId
                        });
                    }
                    
                }


            })();//dyeBatch
        },


        'init' : function (){
            var _this = this;
            _this.getItemid();
            _this.getItemData();
            //_this.initStyle();
        },

        'load': function(){
            this.init();
        }
    }//Jupicker prototype end

    return Jupicker;
},{requires:["dom","template","ajax","datalazyload"]});//add end