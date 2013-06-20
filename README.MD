# Jupicker
---
HTML模板
---
```
<div class="J_juitem" data-item="10000000134385,10000000134385," data-template="#Ju_template" ></div>
```

JS调用
---
```

KISSY.ready(function(S){
  S.use('jbc/jupicker/v1/',function(S, Jupicker){
    var jupicker = new Jupicker({
      'juitem' : '.J_juitem',
      //'juitem' : [S.one('.J_juitem')],
      'autoload' : false,
      'trace' : true,
      'clear' : true,
      //'template' : '#Ju_template', //默认为聚划算最新坑位模板，注：优先取Element自定义属性的配置 data-template=""
      //'template' : '<div>template...</div>',
      'idtype' : 'ju',
      'class_done' : 'jupicker-complete',
      'datalazyload' : true,
      'callback' : function(_d){
        console.log(_d);
      }
    });
    S.Event.on('body', 'click', function(ev){
      jupicker.init();
    }, null);
  });
});



```
---
Class
---
### Jupicker(config)

config (Object) – 配置项

  

---
Config（详细配置）
---
### juitem  

{String | HTMLElementList | HTMLElement | KISSY.Node}  容器元素的钩子或实例 默认 '.J_jupicker'


### template  

{String | templateName | HTMLElement | KISSY.Node} 当前实例所匹配的模板


### clear

{Boolean} 是否清除DOM元素容器中的内容 默认false


### url

{String} 数据接口 默认'http://ju.taobao.com/json/tg/AjaxGetJsonItems.htm' 可添加数据后戳 http://ju.taobao.com/json/tg/AjaxGetJsonItems.htm?custom1=value


### callback

{Function} callback(containers: Array, items:Array) 调用函数 返回容器集以及id数据集 默认为null


### idtype

{String} 请求的数据ID类型 ，'item' , 'ju'两种可选，默认 'item' <span style='color:#f60'>注:后期将会取消'item' Id 类型，统一'ju' ID获取商品信息</span>

### datalazyload

{Boolean} 懒加载开关，开启状态会启用懒加载KISSY.DataLazyload 默认 false

### trace

{Boolean} 追踪商品异常状态开关，开启状态会在控制台输出调用失败的商品ID 默认 true

### limit

{Number}  分批请求数据的id数量 默认40

### autoload

{Boolean} 自动加载开关 默认true

### data_item

{String}  DOM元素存放JuIDs的属性名称 默认 'data-item'

### data_template

{String}  DOM元素存放当前元素的模板钩子属性名称 默认 'data-template'

### class_done

{String} 数据加载完成后在DOM上添加此Class名称 默认 'jupicker-complete'

---

---

#### 