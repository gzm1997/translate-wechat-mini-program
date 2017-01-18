#第一次开发小程序<br>   


##`官方文档`
其实在几个月之前我就开始关注它，而且小程序发布那天是9号，那时候我正好考试，因为小程序是新事物，当时我真的有点忍不住，但是又要复习考试，所以很不爽，放假之后我就开始看微信小程序的官方文档，https://mp.weixin.qq.com/debug/wxadoc/dev/ 这是小程序的官方文档，通俗易懂很不错。个人推荐想学习小程序的就按照这份官方文档按顺序看吧，其它比如`掘金`或者`w3school`也有，但是这毕竟是官方的，比较权威。语言是基于`es6`，注意这里使用的`wxml`,`wxss`,是是对应html和css的，wx语法上相似，wxss语法就是跟css一样。  

##`注意事项`<br>     

###首先开发小程序是需要一个`APPID`的     


这个在教程官方文档里面的官方文档里面会说到，但是这个微信小程序表面上是必须具有`个体户工商营业执照`或者`企业营业执照`才可以注册的，但是像我这种穷学生要是想学一下小程序怎么办呢？这时候你需要这个http://www.wxapp-union.com/forum.php?mod=viewthread&tid=495 我就是像这样申请一个小程序账号，得到一个APPID，注意不需要搞这个微信认证的![](https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484750785063_22.png)
###在小程序里面的wx.reques函数在是用来向你的后端服务器发出请求的<br>
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
注意这个函数的url必须是`https`,这是除了看文档之外我花费时间最多的地方<br>



###接上面讲`https`
这个真的浪费我很多时间，我的后端是在我的腾讯云服务器使用`nodejs`语言搭建的server，<br>
因为小程序必须的request的url必须是https这就需要你的服务器具有ssl证书。如果你使用的腾讯云服务器的话，登录你的腾讯云服务器云主机，在上面的ssl证书管理那里你会看到这个：

![](https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484751481038_72.png)   


你需要申请证书，按照指引走就行，申请之后就会看到截图那样的证书申请好在那里了，<br>下载之后会发现有三部分：
![](https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484751756841_98.png)<br>


注意：证书的安装腾讯云的文档不是说的太明白，我当时就是搞得一脸懵逼。<br>   因为我的的服务端是用nodejs写的，所以需要安装Nginx服务器，Nginx的安装教程如下：http://www.cnblogs.com/chuncn/archive/2011/10/14/2212291.html <br>


安装之后你就可以使用http://yourDomainName yourDomainName是你的域名（没有域名的话需要自己申请一个，在腾讯云上有得买，加上优惠券还是挺便宜的，但是之后几年的价格怎样不知道，想要免费的域名也可以，可以自行谷歌百度搜素一下就行） 来访问你的服务器的了（默认是80端口），然后安装Nginx证书，教程如下： http://jingyan.baidu.com/article/63f2362836d90c0208ab3dd9.html <br>  
安装好ssl证书之后，你就可以适应https://youDomainName 来访问你的服务器啦


接着就是使用你的Nginx服务器来代理你作为微信小程序后端的nodejs项目了， 

####先说说使用Nginx反向代理nodejs项目是什么意思    

Nginx是安装在你服务器里面，他可以占据着一个端口，比如443，然后你运行你的nodejs项目，让它在3000端口跑，这时候你让Nginx代理，让别人访问你服务器443端口的时候，转而自动访问你nodejs所在3000端口，这就是使用Nginx反向代理nodejs项目
教程如下： http://www.imooc.com/article/1911 
核心部分如下： ![](https://github.com/15331094/WeChat-small-program/blob/master/screenshot/filehelper_1484752408584_87.png)<br>


###在开发过程中，即使你的小程序还没有发布，也是可以发布体验版给你的小伙伴一起围观一下的喔<br>

