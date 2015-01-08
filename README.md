# console-for-mobile-webview
手机浏览器怎么实现调试 ？

除了执行普通指令之外，控制台有三个特殊的预置指令。


l 遍历对象(浅层)


ls 遍历对象(深层)


c 清空窗口

; 窗口最小化

;; 窗口最大化

l 和 ls 的参数为数字


例: 


l window //浅层遍历所有 window 子元素

ls window //深层遍历所有 window 子元素


l window 5 //浅层遍历 window 子元素，输出前五个

ls window 5 //深层遍历 window 子元素，输出前五个


l window 1 10 //浅层遍历 window 子元素，输出第一个到第十个

ls window 5 8 //深层遍历 window 子元素，输出第五个到第八个
