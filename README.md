# Jupicker
---
HTML模板
---
```
<div class="J_jupicker" data-item="10000000134385,10000000134385" data-template="#J_template" ></div>
```


JS调用
---
```

KISSY.use('jbc/jupicker/v1/index',function(S, Jupicker){
    var jupicker = new Jupicker({
        'containers' : '.J_jupicker',
        //'autoload' : false,
        'trace' : true,
        'clear' : true,
        //'template' : 'normal',
        'template' : 'big',
        //'idtype' : 'ju',
        'imglazyload' : true,
        //'imglazyloadAutoInit' : false,
        'data':{
            //'juIds' : '10000000288955',
            'type' : 0,
            'frontCatId' : 6000
        },
        'callback' : function(_d){
            console.log(_d)
            S.all('.J_cutdown').each(function(item){
                Countdown(item);
            });
        }
    });
});



```

---
Example
---
http://act.ju.taobao.com/go/act/ju-item-test.php
<br/>

  
---
Class
---
### Jupicker(config)

config (Object) – 配置项


---
Config（详细配置）
---
### containers  

{String | HTMLElementList[] | KISSY.NodeList[] | HTMLElement | KISSY.Node}  容器元素的钩子或实例 默认 '.J_jupicker'


### template  

{String | templateTagName | HTMLEement | KISSY.Node} 当前实例所有模板设置，权重小于DOM attr 上 data-template设置 默认'normal' 

normal:默认模板
big:聚定制模板


### clear

{Boolean} 是否清除DOM元素容器中的内容 默认false


### data

{Object} 聚划算前台列表Json接口查询参数  参数说明：http://docs.alibaba-inc.com/pages/viewpage.action?pageId=117708282  默认为null



### url

{String} 数据接口  可添加数据后戳 ...JsonItems.htm?custom1=value 默认为'http://ju.taobao.com/json/tg/AjaxGetJsonItems.htm'


### callback

{Function} callback(containers: Array, items:Array) 调用函数 返回容器集以及id数据集 默认为null


### idtype

{String} 请求的数据ID类型 ，'item' , 'ju'两种可选，默认 'ju' <span style='color:#f60'>注:后期将会取消'item' Id 类型，统一'ju' ID获取商品信息</span>


### imglazyload

{Boolean} 懒加载开关，开启状态会启用懒加载KISSY.DataLazyload 默认 false


### imglazyloadAutoInit

{Boolean} 商品加载完毕后是否初始化懒加载 默认true


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
Methods
---
### load
load()
在Jupicker实例上调用，开始加载并渲染商品。再次调用则重新获取商品id 加载并渲染。


---
Template Data （模板数据）
---

```
/*

商品名称：{{item.longName}}
商品段名称：{{item.shortName}}
商品状态：{{item.state}} 
商品价格小数位：{{item.activityPriceInt}} 
商品价格整数位：{{item.activityPriceDecimal}}

*/

activityPrice: "39.00"
activityPriceDecimal: "00"
activityPriceInt: "39"
activityStatus: ""
aliPayExpressPayType: ""
alipayExpressPay: "false"
alipayExpressPayChannelCode: ""
alipayExpressPayDiscount: "0.0"
alipayExpressPayPrice: "0"
androidTerminal: "false"
cashbackBO: ""
categoryId: "50013189"
childCategory: "600006"
city: "全国"
currentRank: "NaN"
cutdown: 52801172
detailAttributes: ""
discount: "4.9"
extraMap: ""
frontFirstCatIds: Array[2]
frontSecondCatIds: ""
hangtagPrice: ""
honorDiscount: "0.0"
honorPay: "false"
honorPayChannelCode: ""
honorPayPrice: "0"
honorPayType: ""
imageLabelCssClassName: Array[2]
indexActivityStatus: "1"
indexActivityStatusAB: "1"
indexRank: "0.0"
indexRankForHome: "0.0"
iphoneTerminal: "false"
isLock: "1"
isSecKill: "false"
itemCount: "4500"
itemGuarantee: "0,0,0,1,1,1,0,0,0"
itemId: "17785978459"
itemLabel: ""
itemOnlineDetailBO: ""
itemStatus: "8"
itemType: "0"
itemUrl: "http://detail.tmall.com/item.htm?id=17785978459"
juId: "10000000066276"
juUrl: "http://ju.taobao.com/tg/home.htm?id=10000000066276"
juView: "true"
labelIndex: "0.0"
ladderInfoBO: ""
ladderItem: "false"
laserCurrentRank: "5.58342488117902"
limitNum: "5"
longName: "[包邮]小象谷童装 夏季新款男童T恤 舒适圆领百搭短袖夏装（每个ID限购5件）"
newRank: "true"
newRankMap: ""
onlineEndTime: "1373414399000"
onlineStartTime: "1373335200000"
originalLongName: "[包邮]小象谷童装 夏季新款男童T恤 舒适圆领百搭短袖夏装（每个ID限购5件）"
originalPrice: "79.00"
otherCities: ""
parentCategory: "600000"
payPostage: "true"
picUrl: "http://img04.taobaocdn.com/bao/uploaded/i4/T1YIdFFotXXXb1upjX.jpg"
picUrlFromIc: "i2/13743021188905707/T1mFt1XpVgXXXXXXXX_!!0-item_pic.jpg"
picWideUrl: "i2/T1YIdFFotXXXb1upjX.jpg"
platformId: "1001"
preOnline: ""
rankMap: ""
realActicityPrice: "3900"
remindNum: "0"
sellerId: "849263743"
shopType: "1"
shortName: "小象谷童装 夏季新款男童T恤 舒适圆领百搭短袖夏装"
showEndTime: "1373414399000"
showStartTime: "1373328000000"
singleChannel: "false"
soldCount: "146"
state: ""
supportAutoRefund: "false"
supportPromotion123: "false"
supportUserRefund: "false"
taobaoFirstCategory: "50008165"
tgType: "0"
travelInfo: ""
wapTerminal: "false"

```