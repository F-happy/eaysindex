/*! hackday - v1.0.0 - 2015-08-08 */
$(function () {

    if (($.cookie('username') != undefined) || ($.cookie('username'),length != 0)) {
        // $('#login').text('Hello!' + $.cookie('username'));
        // $('#login').unbind();
        // $('#login').click(function() {
        //     window.location.href = 'userinfo.html';
        // });
        $.post('http://hackday.iduobao.net/user/info', {token: $.cookie('token')}, function(data, textStatus, xhr) {
        }, 'json');
    };

    // 初始化参数
    initsetting();

});

function initsetting() {
    
}