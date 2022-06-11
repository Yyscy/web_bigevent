$(function () {
    const form = layui.form;
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        samePwd: (val) => {
            if (val === $("[name=oldPwd]").val()) return "新旧密码不能相同！";
        },
        rePwd: (val) => {
            if (val !== $("[name=newPwd]").val()) return "两次密码不一致！";
        },
    });
    var kong = form.val("formUserInfo")
    $("#btnResets").click((e) => {
        e.preventDefault();
        form.val("formUserInfo", kong)
    })

    $('.layui-form').on('submit', (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/my/updatepwd',
            data: $('.layui-form').serialize(),
            success: res => {
                const { status, message } = res;
                if (status !== 0) return layer.msg(message);
                layer.msg('密码更改成功')
                localStorage.removeItem("token");
                // 重新跳转到登录页面
                $(".layui-form")[0].reset();
                window.parent.location.href = "/login.html";
            }
        })
    })


})