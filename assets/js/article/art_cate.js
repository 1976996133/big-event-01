$(function () {

    // 1.初始化文章分类列表
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var str = template('tpl-art-cate', res);
                $('tbody').html(str);
            }

        })
    }

    // 2.显示添加区域
    var layer = layui.layer;

    $('#btnAdd').on('click', function () {
        // 利用框架代码，显示 提示添加文章类别区域
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ["500px", "260px"],
            content: $('#dialog-add').html()
        });
    })

    // 3.提交添加文章分类
    // 弹出层是后添加的，父盒子就是body
    var indexAdd = null;
    $('body').on("submit", '#form-add', function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        // console.log(123);
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    // return layer.msg(res.message);
                    return layer.msg('新增分类失败！')
                }
                // 因为我们添加成功了，所以要重新渲染 页面的数据
                initArtCateList();
                layer.msg('恭喜你，文章类别添加成功');
                layer.close(indexAdd);
            }
        })
    })

    // 4.显示修改form表单
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', ".btn-edit", function () {
        //4.1 利用框架代码，显示 提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ["500px", "260px"],
            content: $('#dialog-edit').html()
        });
        //4.2获得Id，发送ajax获取数据，渲染到页面
        var Id = $(this).attr("data-id");
        // alert(Id);
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val("form-edit", res.data);
            }
        })

    })

    // 4.修改-提交
    $('body').on("submit", '#form-edit', function (e) {
        // 阻止表单默认提交
        e.preventDefault()
        // console.log(123);
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                // 判断状态码
                if (res.status !== 0) {
                    // return layer.msg(res.message);
                    return layer.msg('新增分类失败！')
                }
                // 因为我们添加成功了，所以要重新渲染 页面的数据
                initArtCateList();
                layer.msg('恭喜你，文章类别更新成功');
                layer.close(indexEdit);
            }
        })
    })

    // 5.删除
    $('tbody').on('click', ".btn-delete", function () {
        var Id = $(this).attr("data-id")
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg('恭喜您，文章类别删除成功');
                    layer.close(index);
                }
            })
        })
    })
    // $('tbody').on('click', '.btn-delete', function () {
    //     var id = $(this).attr('data-id')
    //     // 提示用户是否要删除
    //     layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
    //         $.ajax({
    //             method: 'GET',
    //             url: '/my/article/deletecate/' + id,
    //             success: function (res) {
    //                 if (res.status !== 0) {
    //                     return layer.msg('删除分类失败！')
    //                 }
    //                 layer.msg('删除分类成功！')
    //                 layer.close(index)
    //                 initArtCateList()
    //             }
    //         })
    //     })
    // })
})