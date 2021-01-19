$(function () {
    // 1.自定义 验证规则
    var form = layui.form;
    form.verify({
        // 属性是规则名，值可以是函数，也可以是数组
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1 ~ 6位之间！';
            }
        }
    })

    // 2.获取的渲染用户信息
    initUserInfo();
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功后渲染
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 3.表单重置
    $('#btnReset').on('click', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 从新用户渲染
        initUserInfo();
    })

    // 4.监听表单的提交事件
    var layer = layui.layer;
    $(".layui-form").on("submit", function (e) {
        // 阻止表单
        e.preventDefault();
        // 发送 ajax
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息修改失败!')
                }
                layer.msg("恭喜你,用户信息修改成功!");
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUesrInfo();
            }
        })
    })
})