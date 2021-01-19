//入口函数
$(function () {
    // 1定义密码规则(3个)
    var form = layui.form;
    // 一个方法
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位,且不能出现空格'
        ],
        // 新密码---新旧不重复
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return "原密码和新密码不能相同!";
            }
        },

        // 确认密码
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次新密码输入不一致!";
            }
        },
    })

    //2表单提交 
    $('.layui-form').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault();
        // ajax
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                // 修改失败
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败!')
                }
                // 修改成功
                layui.layer.msg("修改密码成功!");
                // 重置表单
                //jquery里面没有reset,所以要切换成原生js(加[0])
                $('.layui-form')[0].reset();
            }
        });
    })
})