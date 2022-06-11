$(function () {
    const form = layui.form;
    // 自定义校验规则
    form.verify({
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
        },
    });

    // 获取用户信息
    const initUserInfo = () => {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: res => {
                const { status, message, data } = res;
                if (status !== 0) return layer.msg(message);
                form.val('formUserInfo', data);
            }
        })
    };

    initUserInfo();

    $("#btnReset").click((e) => {
        e.preventDefault();
        initUserInfo();
    })
    // 发起请求更新用户的信息
    $('.layui-form').on("submit", (e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $("#form_login").serialize(),
            success: res => {
                const { status, message } = res;
                if (status !== 0) return layer.msg(message);
                layer.msg("修改成功")
                window.parent.getUserInfo();
            }
        })
    })



})