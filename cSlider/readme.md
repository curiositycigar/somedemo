#原生JS简单轮播图

>　支持拖动，左右箭头，下方图片导航

***HTML***
```
<div id="focus">
	<ul class="cslider">
		<li class="cslider-item">
			<img src="img/p1.jpg" alt="focusPicture1" title="p1" />
		</li>
		<li class="cslider-item">
			<img src="img/p2.jpg" alt="focusPicture2" title="p2" />
		</li>
		<li class="cslider-item">
			<img src="img/p3.jpg" alt="focusPicture3" title="p3" />
		</li>
		<li class="cslider-item">
			<img src="img/p4.jpg" alt="focusPicture4" title="p4" />
		</li>
	</ul>
</div>
```
***JavaScript***
```
cSlider(document.getElementById("focus"),{
	drag: true,
	nav: true,
	arrow: true,
	scale: 0.5
});
```
#####调用方式：
>```
>cSlider(element, options);
>```
> **element:** 所绑定的元素
> ```
> document.getElementById("focus");
> ```
> **options:** 四个选项
> ```
> {
>         //可否拖动(true or false)，默认false
>         drag:  true,
>         //下方是否有导航圆点(true or false)，默认true
>         nav: true, 
>         //是否有左右箭头(true or false)，默认false
>         arrow: true, 
>         //高度和宽度的比例，默认第一个图片的高宽比
>         scale: 0.5
> }
> ```

**[点击查看demo](http://curiositycigar.github.io/demo/cSlider/index.html)**
