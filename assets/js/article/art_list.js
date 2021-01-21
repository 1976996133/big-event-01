$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 在个位数的左侧填充0----补零
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    //1. 定义查询参数对象，将来查询文章使用
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 2.渲染文章列表--------------------------------------------------
    initTable();
    var layer = layui.layer
    // 封装渲染文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total);
            }
        })
    }

    // 3.渲染文章分类--------------------------------------------------
    initCate();
    var form = layui.form;
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值，渲染form
                var htmlStr = template("tpl-cate", res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构/就是根据 select 标签生成/渲染 dl放dd 
                form.render();
            }
        })
    }

    // 4.筛选功能---------------------------------------------------------
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    //5.渲染分页的方法
    var laypage = layui.laypage;
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,// 设置默认被选中的分页

            // 分页模块 设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 6.删除
    var layer = layui.layer;
    $("tbody").on('click', '.btn-delete', function () {
        // console.log(123);
        // 先获取Id，进入到函数中this的代指就改变了
        var Id = $(this).attr('data-id')
        //显示对话框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败!");
                    }
                    // 弹出提示框，关闭窗口
                    layer.msg("删除成功!")

                    // 删除以后，页面中还有一条，是后台数据库里面没有这一条数据了！
                    // 当前页 -1 满足两个条件，页面中只有一个元素，当前页大于1
                    if ($('.btn-delete').length === 1 && q.pagenum >= 2) q.pagenum--;

                    //更新成功，从新渲染页面
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})