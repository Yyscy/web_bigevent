$(function () {
    const form = layui.form;
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 10, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };

    // 获取文章列表数据
    const initTable = () => {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: res => {
                if (res.status !== 0) return layer.msg("获取文章列表失败! ");
                var htmlStr = template('tpl-table', res);
                $('tbody').empty().html(htmlStr);
                renderPage(res.total)
            }
        })
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // 初始化文章分类的方法
    const initCate = () => {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {

                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败！");
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            },
        });
    };

    // 筛选
    $("#form-search").submit(function (e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        q.cate_id = cate_id;
        q.state = state;
        initTable()
    })


    // 定义渲染分页方法
    function renderPage(total) {
        layui.use('laypage', function () {
            var laypage = layui.laypage;

            //执行一个laypage实例
            // 调用 laypage.render() 方法来渲染分页的结构
            laypage.render({
                elem: 'pageBox',
                count: total,
                limit: q.pagesize, // 每页显示几条数据
                curr: q.pagenum, // 设置默认被选中的分页
                layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip'],
                // 分页发生切换的时候，触发 jump 回调
                // 分页发生切换的时候，触发 jump 回调
                // 触发 jump 回调的方式有两种：
                // 1. 点击页码的时候，会触发 jump 回调
                // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
                jump: function (obj, first) {
                    // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                    // 如果 first 的值为 true，证明是方式2触发的
                    // 否则就是方式1触发的
                    /*  console.log(first)
                     console.log(obj.curr) */
                    // 把最新的页码值，赋值到 q 这个查询参数对象中
                    q.pagenum = obj.curr
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                    // initTable()
                    if (!first) {
                        initTable()
                    }
                }
            });
        });

    }

    $("tbody").on("click", ".btn-delete", function () {
        const id = $(this).attr("data-id");
        const bunNabe = $(".btn-edit").length;

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: res => {
                    if (res.status !== 0) return layui.msg("删除失败");
                    layer.msg('删除文章成功！')
                    if (bunNabe === 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })

    })

    $("tbody").on("click", ".btn-edit", function () {
        const id = $(this).attr("data-id");
        sessionStorage.setItem("Id", id)

        location.href = "/article/art_pub.html"

    });
    // 调用函数
    initTable()
    initCate()


})

