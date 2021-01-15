$(function () {
    //点击去注册账号，隐藏登陆区域，显示注册区域
    $('#link_reg').on('click', function () {
        $(".login-box").hide();//隐藏
        $(".reg-box").show();//显示
    })

    //点击去登陆，显示登陆区域，隐藏注册区域
    $('#link_login').on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // 自定义验证规则
    var form = layui.form;
    form.verify({
        //1.密码规则
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须6-16位，且不能输入空格'
        ],

        //2.校验两次密码是否一样的规则
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            // 还需要要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $('.reg-box input[name=password]').val();
            if (value !== pwd) {
                return "两次密码输入不一样"
            }
        }
    })

    // 3.注册
    $('#form_reg').on('submit', function (e) {
        //1.阻止默认的提交行为
        e.preventDefault();
        // 发起Ajax的POST请求1
        $.ajax({
            method: 'POST',
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg('注册成功,请登录！');

                // 跳转登陆页面
                $('#link_login').click();

                //重置form
                $('#form_reg')[0].reset();
            }
        });
    })

    // 4。登陆
    $('#form_login').on('submit', function (e) {
        //阻止默认的提交行为
        e.preventDefault();
        // 发送ajsx
        $.ajax({
            method: 'POST',
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提示信息，保存token，跳转页面
                layer.msg('恭喜您，登陆成功！');
                // 保存token，未来的接口要使用token
                localStorage.setItem('token', res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
})