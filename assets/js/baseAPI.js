// 开发环境
var baseURL = 'http://api-breakingnews-web.itheima.net'
//拦截所有ajax请求 处理函数
$.ajaxPrefilter(function (params) {
    //拼接对应环境服务器
    params.url = baseURL + params.url;
})