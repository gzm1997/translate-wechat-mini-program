# 第一次开发小程序

------


### 官方文档：

其实在几个月之前我就开始关注它，而且小程序发布那天是9号，那时候我正好考试，因为小程序是新事物，当时我真的有点忍不住，但是又要复习考试，所以很不爽，放假之后我就开始看[**微信小程序的官方文档**][1]  通俗易懂很不错。个人推荐想学习小程序的就按照这份官方文档按顺序看吧，其它比如**掘金**或者**w3school**也有，但是这毕竟是官方的，比较权威。语言是基于**es6**，注意这里使用的wxml,wxss,是是对应html和css的，wxml跟html语法上相似，wxss语法就是跟css一样。

------

## 注意事项:

首先开发小程序是需要一个APPID的

这个在教程官方文档里面的官方文档里面会说到，但是这个微信小程序表面上是必须具有**个体户工商营业执照**或**者企业营业执照**才可以注册的，但是像我这种穷学生要是想学一下小程序怎么办呢？这时候你需要[这个][2] 我就是像这样申请一个小程序账号，得到一个APPID，注意不需要搞这个微信认证的，这个专空子申请的APPID只可以用来开发，是没办法拿来发布小程序的，认证也是认证不了的
![不需认证][3]

在小程序里面的wx.reques函数在是用来向你的后端服务器发出请求的


```
wx.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
     x: '' ,
     y: ''
  },
  header: {
      'content-type': 'application/json'
  },
  success: function(res) {
    console.log(res.data)
  }
})
``` 
注意这个函数的url必须是https,这是除了看文档之外我花费时间最多的地方

------

##接上面讲https
这个真的浪费我很多时间，我的后端是在我的腾讯云服务器使用**nodejs**语言搭建的server，因为小程序必须的request的url必须是https这就需要你的服务器具有**ssl证书**。如果你使用的腾讯云服务器的话，登录你的腾讯云服务器云主机，在上面的**ssl证书管理**那里你会看到这个：

![ssl证书][4]

你需要申请证书，按照指引走就行，申请之后就会看到截图那样的证书申请好在那里了，下载之后会发现主要有三部分：Apache, Nginx, IIS：
![ssl证书][5]

**注意**：证书的安装腾讯云的文档不是说的太明白，我当时就是搞得一脸懵逼。因为我的的服务端是用nodejs写的，所以需要安装**Nginx服务器**(涉及**Nginx反向代理nodejs项目**)，Nginx的[安装教程][6]

安装之后你就可以使用http://yourDomainName yourDomainName是你的域名（没有域名的话需要自己申请一个，在腾讯云上有得买，加上优惠券还是挺便宜的，但是之后几年的价格怎样不知道，想要免费的域名也可以，可以自行谷歌百度搜素一下就行） 来访问你的服务器的了（默认是80端口），然后安装Nginx证书，[教程][7]  
安装好ssl证书之后，你就可以适应https://yourDomainName 来访问你的服务器

接着就是使用你的Nginx服务器来代理你作为微信小程序后端的nodejs项目了

------

##先说说使用Nginx反向代理nodejs项目是什么意思  
Nginx是安装在你服务器里面，他可以占据着一个端口，比如443，然后你运行你的nodejs项目，让它在3000端口跑，这时候你让Nginx代理，让别人访问你服务器443端口的时候，转而自动访问你nodejs所在3000端口，这就是使用Nginx反向代理nodejs项目 [教程][8] 核心部分如下（下图源自Nginx的nginx.conf配置文件）： 
![nginx.conf配置文件][9]

------

##我的小程序
我做的这个小程序是一个翻译助手，非常简单，微信的api我只是使用wx.request和onShareAppMessage两个重要的官方api函数，至于逻辑那些只能自己写

小程序部分在这个项目的app文件夹里面，可以下载到本地，使用微信开发工具打开这个名为app的文件夹就可以打开我的这个小程序啦

server文件夹里面是我的服务器部分，里面还没有安装依赖，需要自己安装，部署在我的腾讯云服务器里面，在3000端口跑，用Nginx在443端口进行代理，在server文件夹内的server.js负责接收小程序发送过来的请求，并且使用translate.js里面的函数进行翻译，最后把结果反馈给小程序。

translate.js里面使用百度翻译的api，主要使用http.request()函数，百度翻译的api很好用，很喜欢。

核心代码
```
module.exports = function(params, callback) { 
  if (typeof params === 'string') { 
    params = { 
      query: params 
    }; 
  } 

  params = { 
    from: params.from || 'zh', 
    to: params.to || 'en', 
    query: params.query || '' 
  }; 
   
  var data = querystring.stringify(params); 
    options = { 
      host: 'fanyi.baidu.com', 
      port: 80, 
      path: '/v2transapi', 
      method: 'POST', 
      headers: { 
        'Content-Type':'application/x-www-form-urlencoded', 
        'Content-Length': data.length 
      } 
    }; 
  
  var req = http.request(options, function(res) { 
    var result = ''; 

    res.setEncoding('utf8'); 

    res.on('data', function(data) { 
      result += data; 
    }); 

    res.on('end', function() { 
    //console.log(result);
      var obj = JSON.parse(result);
      console.log(obj);
      var str = obj.trans_result.data[0].dst; 
      callback(str); 
    }); 
  }); 
  
  req.on('error', function(err) { 
    console.log(err); 
    setTimeout(function() { 
      translation(query, callback); 
    }, 3000); 
  }); 
  

  req.write(data); 
  req.end(); 


}; 
```
```
params = { 
   from: params.from || 'zh', //原来是什么语言                
   to: params.to || 'en', //要翻译为什么语言         
   query: params.query || ''  //要翻译的语句
 }; 
```
使用百度翻译的api,必须知道每种语言，百度翻译使用什么单词表示的：
![百度翻译语言表示][10]

------

##解决语音问题：
这是百度翻译女声语音的[url][11]，喜欢的朋友可以收藏，以后可能用得上
注意里面有两个参数，一个是**lan**意思是要读出出来的是什么语言，zh是中文，en是英文，很遗憾，这个url这可以播报中文和英文的语音，其他的小语种不可以这也是我的小程序只可以有中文和英文两种语言的语音的原因，第二个参数是**text**就是要播报的文本是什么

------

##效果图如下：
![效果图1][12]
![效果图2][13]
![效果图3][14]
![效果图4][15]

------

##forever
forever是可以让nodejs项目在后台运行的，只需要npm install forever一下就可以使用forever start server.js来运行你的expres项目，简单好用，当你想停止下来debug的时候就forever stop server.js一下就行

------


  [1]: https://mp.weixin.qq.com/debug/wxadoc/dev/
  [2]: http://www.wxapp-union.com/forum.php?mod=viewthread&tid=495
  [3]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484750785063_22.png?raw=true
  [4]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484751756841_98.png?raw=true
  [5]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484751756841_98.png?raw=true
  [6]: http://www.cnblogs.com/chuncn/archive/2011/10/14/2212291.html
  [7]: http://jingyan.baidu.com/article/63f2362836d90c0208ab3dd9.html
  [8]: http://www.imooc.com/article/1911
  [9]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484752408584_87.png?raw=true
  [10]:https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484783947017_44.png?raw=true
  [11]: http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=我是学生
  [12]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/910618074153886974.png?raw=true
  [13]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/869412204321258718.png?raw=true
  [14]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/729930379004726692.png?raw=true
  [15]: https://github.com/15331094/WeChat-small-program/blob/master/screenshot/208763810200817083.png?raw=true
