// 入口函数
$(function () {
    //1.获取用户信息，并渲染用户名和头像
    getUesrInfo();
    // 2.退出登陆功能
    var layer = layui.layer;//可写可不写
    $('#btnLogout').on('click', function () {
        //构架提供的询问框
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地token
            localStorage.removeItem('token');
            // 2.页面跳转
            location.href = '/login.html'
            // 关闭询问框
            layer.close(index);
        });

    })
})

// 封装获取用户信息方法
//  -------------注意：必须是全区变量，方便其他页面使用
function getUesrInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // headers: {
        //     // 重新登陆，以为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染用户信息和头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1渲染昵称或用户名
    var name = user.nickname || user.username
    $('#welcome').html("欢迎&nbsp" + name);
    // 2渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}
