$(function () {
    getUserInfo();
})
// 获取用户信息
var getUserInfo = () => {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: res => {
            const { status, message, data } = res;
            if (status !== 0) return layer.msg(message);
            layer.msg("获取用户信息成功！");
            renderAvatar(data)
        }
    })
};
// 渲染用户头像和名称
var renderAvatar = (user) => {
    let username = user.nickname || user.username;
    // 替换文本
    $("#welcome").html(`欢迎${username}`)
    if (user.user_pic !== null) {
        $(".text-avatar").hide();
        $(".layui-nav-img").attr('src', user.user_pic).show();
    } else {
        $(".layui-nav-img").hide()
        let fiancc = username[0].toUpperCase();
        $(".text-avatar").html(fiancc)
    }

}

// 退出登录的实现
$("#btnLogout").click(() => {
    layui.layer.confirm(
        "确定退出登录？",
        { icon: 3, title: "" },
        function (index) {
            // 清空本地存储里面的 token
            localStorage.removeItem("token");
            // 重新跳转到登录页面
            location.href = "/login.html";
        }
    );
})
