 //获取DOM节点
var send_validcode_btn = document.getElementById('send-validcode-btn'),
    register_btn = document.getElementById('register-btn'),
    alter_phone_btn = document.getElementById('alter-phone-btn'),
    step_one = document.getElementById('step-one'),
    step_two = document.getElementById('step-two'),
    remained_time_wrap = document.getElementById('remained-time-wrap'),
    remained_time = document.getElementById('remained-time'),
    success_pop = document.getElementById('success-pop');

var phone_input = document.getElementById('phone-number'),
    validcode_input = document.getElementById('validcode-input'),
    pw_input = document.getElementById('pw-input'),
    agree_checkbox = document.getElementById('agree-checkbox');;

var phone,validcode,password;

//倒计时初始时间
var REAMINED_TIME = 60;

var valideCodeTimer = null;

var dialog = new Dialog();
//发送验证码
send_validcode_btn.onclick = function(){
	//发送验证码
    phone = phone_input.value;
    //alert(phone);
    if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(phone)){
        dialog.error('手机号码错误！');
        return false;
    }
    sendValidCode(function(ret){
        if(rets){

        }else{
            
        }
    });
    removeClass(step_two,'hide');
    addClass(step_one,'hide');
    valideCodeTimer = new ValidCodeTimer();
}
//修改手机号码
alter_phone_btn.onclick = function(){
    addClass(step_two,'hide');
    removeClass(step_one,'hide');
    valideCodeTimer.stop();
}
//注册
register_btn.onclick = function(){
    var password = pw_input.value,
        validcode = validcode_input.value;

    if(validcode.length < 4){
        dialog.error('请输入验证码！',2000);
        return false;
    }

    if(password.length < 6){
        dialog.error('密码少于6位！',2000);
        return false;
    }

    ajax({
        url: ".php",              //请求地址
        type: "POST",                       //请求方式
        data: {'code': '0000','pw':'qwer' },        //请求参数
        dataType: "json",
        success: function (response, xml) {
            // 此处放成功后执行的代码
        },
        fail: function (status) {
            // 此处放失败后执行的代码
        }
    });

    //alert(agree_checkbox.checked);
    if(!agree_checkbox.checked){
        //agree_checkbox.checked =false;
        dialog.error('请同意《注册协议》');
        return false;
    }

    dialog.success('恭喜您已注册成功！',3000);
    setTimeout(function(){
        window.location.href = './success.html';
    },2500);
    // addClass(success_pop,'fadeIn');
    // setTimeout(function(){
    //     removeClass(success_pop,'fadeIn');
    // },1000);
}
remained_time_wrap.onclick = function(){
    if(!valideCodeTimer.isRunning){
        //发送验证码
        sendValidCode(function(ret){
            if(rets){

            }else{

            }
        });
        valideCodeTimer.start();
    }
    
}
success_pop.onclick = function(){
    //addClass(this,'hide');
    removeClass(this,'fadeIn');
}
//发送验证码
function sendValidCode(callback){
    ajax({
        url: ".php",              //请求地址
        type: "POST",                       //请求方式
        data: {'phone': '13083951289' },        //请求参数
        dataType: "json",
        success: function (response, xml) {
            // 此处放成功后执行的代码
            callback(1);
        },
        fail: function (status) {
            // 此处放失败后执行的代码
            callback(0);
        }
    });
}
function ValidCodeTimer(){
    this.start();
}
ValidCodeTimer.prototype.time = REAMINED_TIME;
ValidCodeTimer.prototype.isRunning = false;
ValidCodeTimer.prototype.interval = null;
ValidCodeTimer.prototype.init = function(){
    this.time = REAMINED_TIME;
}
ValidCodeTimer.prototype.start = function(){
    var self = this;
    self.init();
    self.isRunning = true;
    this.interval = setInterval(function(){
        self.time--;
        remained_time.innerText = self.time;
        if(self.time <= 0){
            self.stop();
            remained_time.innerText = '重新获取';
        }
    },1000);
}   
ValidCodeTimer.prototype.stop = function(){
    if(this.interval){
        clearInterval(this.interval);
    }
    this.isRunning = false;
    remained_time.innerText = this.time+'';
} 

function Dialog(){
}
Dialog.prototype.DOM = success_pop;
Dialog.prototype.timeout = null;
Dialog.prototype.show = function(content, showTime){
    var self = this;
    var showTime = showTime || 1000;
    removeClass(self.DOM,'fadeIn');
    if(this.timeout)clearTimeout(this.timeout);
    addClass(this.DOM,'fadeIn');
    self.DOM.innerText = content || 'dialog';
    
    this.timeout = setTimeout(function(){
        removeClass(self.DOM,'fadeIn');
    },showTime);
}
Dialog.prototype.success = function(content, showTime){
    this.DOM.style.color = '#0f0';
    this.show(content,showTime);
}
Dialog.prototype.tips = function(content, showTime){
    this.DOM.style.color = '#fff';
    this.show(content,showTime);
}
Dialog.prototype.error = function(content, showTime){
    this.DOM.style.color = 'red';
    this.show(content,showTime || 2000);
}