$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //2.选择文件
    $('#btnChooseImage').on('click', function () {
        $("#file").click();
    })

    //3. 为文件 选择框绑定change事件
    $('#file').on('change', function (e) {
        console.log(e);
        // 3.1获取用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file == undefined) {
            return layer.msg('请选择图片!')
        }
        // 3.2 更根据选择的文件,创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 先销毁旧的,在重新设置路径,在创建新的
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 4,修改头像
    $('#btnUpload').on('click', function () {
        // 获取base64格式字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //    发送ajax
        $.ajax({
            method: "POST",
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您,更换成功!');
                window.parent.getUesrInfo();
            }
        })
    })

})