var num = 1;
window.onload=function(){
    //判断是否已存在token  存在尝试登录
    var myToken = window.localStorage.getItem('token');
    if(myToken!=null){
        this.tryAsk(myToken);
    }

    var flag;
    //轮播
    var timeId = this.setInterval(change,3000)
    //轮播图暂停
    $('.chat').hover(function(){
        clearInterval(timeId);
    },
    function(){
        timeId = setInterval(change,3000);
    }
    )

    $('.dot').click(function(){
        num = $(this).index()-4;
        
        var picture = $('.picture');
        picture.removeClass('active');
        $('.picture'+num).addClass('active');
        
        var dot = $('.dot');
        dot.removeClass('dotActive');
        $('.dot'+num).addClass('dotActive');
    });
    //登录界面的出现和退出

    $('.main .login').click(function(){
        userRight();
        passwordRight();
        $('.mainDiv').addClass('mainActive');
    });

    $('.X').click(function(){
        $('.mainDiv').removeClass('mainActive');
        $('#username').val('');
        $('#password').val('');
    })
    //登录框验证
    $('#username').blur(function(){
        if($('#username').val().length>=4){
            userRight();
        }else{
            userErr();
        }
    })
    $('#password').blur(function(){
        if($('#password').val().length!=0){
            passwordRight();
        }else{
            passwordErr();
        }
    })
    //ajax部分

    $('.goLogin').click(getToken)

};

function getToken(){
    var res;
    var username = $('#username').val();
    var password = $('#password').val();
    //再次验证输入款内容
   
    if($('#username').val().length>=4){
        userRight();
    }else{
        userErr();
        return;
    }


    if($('#password').val().length!=0){
        passwordRight();
    }else{
        passwordErr();
        return;
    }
    
    //ajax请求
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST","http://playground.it266.com/login",true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send('username='+username+'&password='+password);

    xmlhttp.onreadystatechange=function(ev2){
        //判断能响应后,对相应内容进行操作
        if(xmlhttp.readyState==4){
            if((xmlhttp.status>=200&&xmlhttp.status<300)||xmlhttp.status==304){
                res = xmlhttp.responseText;
                handing(res);


            }
        }

    }
   
}
function handing(res){
    var resStr=unescape(res);
    var resJson=JSON.parse(resStr);
    var status = resJson.status;
    //判断返回能容是否为正确的  正确进行登录  错误重新输入
    if(status==true){   
        token = resJson.data.token;
        window.localStorage.setItem('token',token);
        tryAsk(token);

    }else{
        userpassErr(resJson);
    }

}
//登录 
function tryAsk(token){
    $.getJSON('http://playground.it266.com/profile?token='+token,null,function(json){
        if(json.status==true){
            load(json);
        }else{
            window.localStorage.removeItem('token');
            json.data='系统繁忙,请稍后重试';
            userpassErr(json)
        }
    });
}
//////////////////////////////////////////////////////////////////////////
//加载取得的数据
function load(json){
    $('.main .right').addClass('hidden');
    $('.main .right2').removeClass('hidden');
    $('.right2 .img').append(`<img src="`+json.data.avatar+`" alt="">`);
    $('.right2 .text .uName').text(json.data.username);
    $('.right2 .point .value').text(json.data.point);
    $('.right2 .message .value').text(json.data.message);
    $('.right2 .balance .value').text(json.data.balance);



    $('.mainDiv').removeClass('mainActive');
}
/////////////////////////////////////////////////////////////
//基本方法

//轮播图
function change(){
    if(num==5){
        num=0;
    }
    var picture = $('.picture');
    picture.removeClass('active');
    $('.picture'+(++num)).addClass('active');
    
    var dot = $('.dot');
    dot.removeClass('dotActive');
    $('.dot'+(num)).addClass('dotActive');
    
}

function userErr(){
    $('.mid .userErr').html(`<i class="iconfont">&#xe613;</i> 账号至少为4位`);
    $('#username').css('border','1px solid red');
}
function userRight(){
    $('.mid .userErr').html('');
    $('#username').css('border','1px solid rgb(238,238,238)');
}
function passwordErr(){
    $('.mid .passwordErr').html(`<i class="iconfont">&#xe613;</i> 密码不为空`);
    $('#password').css('border','1px solid red');
}
function passwordRight(){
    $('.mid .passwordErr').html('');
    $('#password').css('border','1px solid rgb(238,238,238)');
}
function userpassErr(resJson){
    $('.mid .userErr').html(`<i class="iconfont">&#xe613;</i> `+resJson.data);
    $('#username').css('border','1px solid red');
    $('#password').css('border','1px solid red');
}