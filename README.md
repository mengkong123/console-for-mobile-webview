# console-for-mobile-webview
手机浏览器怎么实现调试 ？

最新改版，去掉了以前版本的预置指令

新版本和 PC 浏览器的调试窗口尽量保持体验一致

另外包涵基本的 控制台 配置快捷方式

? 控制变量输出深度 export deepness

例子：

?0 表示0 个深度等级

此时输出 window //返回 [object Window]

?1 表示1 个深度等级

此时输入 window //返回 top:..window:......

输出深度等级越高，输出的信息量也越大

; 窗口最小化

;; 窗口最大化
