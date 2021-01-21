$(function () {
    // 1.初始化分类
    var layer = layui.layer;//导入layer
    var form = layui.form;//导入form

    // alert(window.location.search)
    // alert(window.location.search.split('=')[1])
    // 所有文章分类渲染完毕后，再去调用intiFrom方法
    function initForm() {
        var id = window.location.search.split('=')[1];
        $.ajax({
            method: "GET",
            url: '/my/article/' + id,
            success: function (res) {
                // console.log(res);
                // 非空校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 渲染到form表单中
                form.val("from_edit", res.data);
                form.render();
                // 文章的内容需要单独处理
                // tinymce赋值（百度）
                tinymce.activeEditor.setContent(res.data.content);
                // 图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未上传封面");
                }
                var newImgURL = baseURL + res.data.cover_img;
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', newImgURL) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })

    }


    // 调用函数
    initCate();
    // 封装函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值渲染
                var htmlStr = template("tpl-cate", res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render()方法
                form.render();
                // 文章渲染完毕后，我们就可以赋值了
                initForm();

            }
        });
    }

    // 初始化富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮。选择图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 5.渲染文章封面
    $('#coverFile').change(function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验 
        if (file == undefined) {
            return;
        }
        //根据选择文件，创建一个对应的URL地址；
        var newImgURL = URL.createObjectURL(file)
        //先销毁，再设置，最后创建新裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 6.定义文章的发布状态
    var state = '已发布';
    // $("#btnSave1").on('click', function () {
    //     state = '已发布';
    // })

    // 为存为草稿按钮绑定提交事件
    $("#btnSave2").on('click', function () {
        state = '草稿';
    })

    // 7.发布文章
    $("#form-pub").on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 创建formData对象，收集数据
        var fd = new FormData(this);
        // 添加状态
        fd.append('state', state);
        // console.log(...fd);
        // 放入图片
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })
    })
    // 封装，添加 文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                //失败判断
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('修改文章成功！')
                // 发布成功，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 1000)
            }
        })
    }
})