/*! hackday - v1.0.0 - 2015-08-08 */
$(function () {

	// 初始化参赛
	pages = 1;

	if (($.cookie('username') != undefined) || ($.cookie('username'),length != 0)) {
		$('#login').text('Hello!' + $.cookie('username'));
		$('#login').unbind();
		$('#login').click(function() {
			window.location.href = 'userinfo.html';
		});
	};

	// 初始化用户信息
	initlogin();

	// 初始化时间
	setInterval(initTime(), 30000);

	// 初始化首页信息
	initindexinfo();

	// 初始化分享列表
	initsharelist();

	// 绑定点击事件
	initclick();
});

// 登录函数
function initlogin () {
	$('#login').click(function() {
		$('#loginbtn').click(function() {
			var usermail = $('#usermail').val();
			var userpassword = $('#userpassword').val();
			if (usermail.length == 0 || userpassword.length == 0) {
				alert('请输入用户名和密码后再登陆!');
				return;
			};
			$.post('http://hackday.iduobao.net/account/login', {email: usermail,pwd: userpassword}, function(data) {
				if (data.c == 0) {
					$('#login').text('Hello!' + data.d.username);
					$('#logins').modal('hide');
					$('#login').unbind();
					$.cookie('username', data.d.username);
					$.cookie('token', data.d.token);
					$('#login').click(function() {
						window.location.href = 'userinfo.html';
					});
				};
			}, 'json');
		});
		$('#logins').modal('toggle');
	});
}

// 初始化时间
function initTime () {
	var mydate = new Date();
	var nowHours = mydate.getHours();
	var nowMin = mydate.getMinutes();
	if (nowHours <= 9) {
		nowHours = '0' + nowHours;
	};
	if (nowMin <= 9) {
		nowMin = '0' + nowMin;
	};

	$('.time').text(nowHours + ':' + nowMin);
}

// 初始化首页信息
function initindexinfo () {
	$.post('http://hackday.iduobao.net/user/baseinfo', {token: $.cookie('token')}, function(data){
		if (data.c == 0) {
			$('.main').css('background-image', data.d.b_img);
			$.each(data.d.team_guide, function(index, val) {
				var guding = $('.constant-bookmarks').children('.bookmarks-img');
				$(guding[index]).find('a').attr('href', $(val).attr('url'));
				$(guding[index]).find('.bookmarks-bg').css('background-color', $(val).attr('color_id'));
				$(guding[index]).find('.bookmarksname').text($(val).attr('tag_name'));
				$(guding[index]).find('.bookmarks-bg').text($(val).attr('tag_name').substring(0,1));
			});
			$('.motivational').text(data.d.mood);
			if (data.d.search_engine == 1) {
				$('#searchbox').find('form').attr('action', 'http://www.baidu.com/baidu');
			};
			if (data.d.search_engine == 2) {
				$('#searchbox').find('form').attr('action', 'http://www.google.cn/custom');
			};
			if (data.d.search_engine == 3) {
				$('#searchbox').find('form').attr('action', 'http://www.baidu.com/baidu');
			};
			if (data.d.user_guide !=0) {
				// 这里是用户自定义的书签
				$.each(data.d.user_guide, function(index, val) {
					var noguding = $('.variable-bookmarks').children('.bookmarks-img');
					$(noguding[index]).find('a').attr('href', $(val).attr('url'));
					$(noguding[index]).find('.bookmarks-bg-img').attr('class', 'bookmarks-bg').empty();
					$(noguding[index]).unbind();
					$(noguding[index]).find('.bookmarks-bg').css('background-color', $(val).attr('color_id'));
					$(noguding[index]).find('.bookmarksname').text($(val).attr('tag_name'));
					$(noguding[index]).find('.bookmarks-bg').text($(val).attr('tag_name').substring(0,1));
				});
			};
		};
	}, 'json');
}

// 初始化分享列表
function initsharelist () {
	$.post('http://hackday.iduobao.net/share/list', {page: pages, token: $.cookie('token')}, function(data) {
		if (data.c == 0) {
			// $('#Pins').empty();
			$.each(data.d, function(index, val) {
				// 第一层
				var Pin = $('<div>').addClass('textinfo').prependTo($('#Pins'));

				// 第二层
				$('<div>').addClass('titleinfo').text($(val).attr('title')).appendTo($(Pin));
				var Box = $('<div>').addClass('sharduser').appendTo($(Pin));

				// 第三层
				$('<span>').addClass('pit').appendTo($(Box));
				var _img = $('<img>').attr('src', $(val).attr('headimg')).text($(val).attr('username')).appendTo($(Box));
				$('<div>').addClass('looks').text('浏览: '+$(val).attr('stats')).appendTo($(Pin));
				$('<div>').addClass('hrfinfo').text($(val).attr('url')).appendTo($(Pin));
				$('<div>').addClass('shardtext').text('推荐理由: '+$(val).attr('reason')).appendTo($(Pin));
				$(Pin).click(function() {
					window.open($(this).find('.hrfinfo').text());
				});
			});
		};
	}, 'json');
}

// 绑定点击事件
function initclick () {
	var choose_color = '';

	// hover效果
	$('.bookmarks-img').hover(function() {
		$(this).find('img').attr('src', 'images/addbookmarks-btn.png');
	}, function() {
		$(this).find('img').attr('src', 'images/addbookmarks.png');
	});

	// 选择颜色
	$('#choose_color span').click(function() {
		choose_color = $(this).css('background-color');
		$(this).addClass('red_garden_hover');
	});

	$('#editbookmarks').click(function() {
		var _tag_name = $('#tag_name').val();
		var _tag_url = $('#tag_url').val();
		var _tag_id = Number($('#addbookmarksModal').attr('data-id'));
		if (_tag_name.length != 0 && _tag_url.length != 0 && _tag_id.length != 0) {
			$.post('http://hackday.iduobao.net/bookmark/add', {token: $.cookie('token'), tag_name: _tag_name, url: _tag_url, color_id: choose_color}, function(data) {
				if (data.c == 0) {
					alert('添加成功');
					window.location.reload();
				}else {
					alert('网络异常,请稍后再试');
				};
				$('#addbookmarks').modal('hide');
			}, 'json');
		}else{
			alert('请填写完整!');
		};
	});

	// 选择列表
	$('.tag').click(function() {
		$(this).siblings('span').removeClass('greentag');
		$(this).siblings('span').addClass('active');
		$(this).removeClass('active');
		$(this).addClass('greentag');
	});

	// 编辑书签
	$('.variable-bookmarks').children('div').click(function() {
		var _booktype = $(this).attr('data-type');
		if (_booktype == "0") {
			$('#addbookmarks').modal('toggle');
		}else {
			$('#tag_name').val($(this).find('.bookmarksname').text())
			$('#tag_url').val($(this).find('a').attr('href')) 
			$('#addbookmarks').modal('toggle');
		};
	});

	// 添加分享
	$('#addinfoimg').click(function() {

		// $.post('http://hackday.iduobao.net/share/add',{data}, function(data) {
		// });

		$.post('http://hackday.iduobao.net/tag/list', {token: $.cookie('token')}, function(data) {
			if (data.c == 0) {
				$.each(data.d, function(index, val) {
					$('<input>').attr({'type':'checkbox', 'value':$(val).attr('id')}).appendTo($('#focuslists'));
					$('<span>').text($(val).attr('tag_name')).appendTo($('#focuslists'));
				});
			}else {
				$('#focuslists').text();
				$('p').text(data.d).appendTo('#focuslists');
			};
		}, 'json');
		$('#addshard').modal('toggle');
		$('#shardok').click(function() {
			var sharetitle = $('#sharetitle').val();
			var shareurl = $('#shareurl').val();
			var sharereason = $('#sharereason').val();
			var sharetag_id = $($('#focuslists').find('input:checked')[0]).val();
			var is_checks = $('#focuslist').find('input:checked');
			for (var i = 0; i < is_checks.length; i++) {
				uptag = uptag + $(is_checks[i]).attr('value');
			};
			if (is_checks.length == 1) {
				alert('只能选择一个标签!');
			}else{
				$.post('http://hackday.iduobao.net/share/add', {
					token: $.cookie('token'),
					title: sharetitle,
					url: shareurl,
					reason: sharereason,
					tag_id: Number(sharetag_id)
				}, function(data) {
					if (data.c == 0) {
						alert('添加成功!');
					}else{
						alert('网络异常,请稍后再试');
					};
					$('#addshard').modal('hide');
				}, 'json');
			};

		});
	});

	// 编辑关注列表
	$('#tagedit').click(function() {
		var uptag = '';
		var is_checks = $('#focuslist').find('input:checked');
		for (var i = 0; i < is_checks.length; i++) {
			uptag = uptag + $(is_checks[i]).attr('value') + ',';
		};
		$.post('http://hackday.iduobao.net/tag/edit', {tag_list: uptag, token: $.cookie('token')}, function(data) {
			if (data.c == 0) {
				alert('修改成功!!!');
			}else{
				alert('网络异常,请稍后再试');
			};
			$('#addFocus').modal('hide');
		}, 'json');
	});

	// 编辑关注
	$('#subscribeinfoimg').click(function() {
		$.post('http://hackday.iduobao.net/tag/list', {token: $.cookie('token')}, function(data) {
			if (data.c == 0) {
				$('#focuslist').text('');
				$.each(data.d, function(index, val) {
					$('<input>').attr({'type':'checkbox', 'value':$(val).attr('id')}).appendTo($('#focuslist'));
					$('<span>').text($(val).attr('tag_name')).appendTo($('#focuslist'));
					if ((index+1)%5 == 0) {
						$('<br>').appendTo($('#focuslist'));
					};
				});
			}else {
				$('#focuslist').text();
				$('p').text(data.d).appendTo('#focuslist');
			};
		}, 'json');
		$('#addFocus').modal('toggle');
	});

	// 打开分享
	$('.textinfo').click(function(event) {
		window.open($(this).find('.hrfinfo').text());
	});
}