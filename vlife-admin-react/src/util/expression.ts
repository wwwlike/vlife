const RegExp={
   isEmail: function (str:string) {
    var emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/;
    return emailReg.test(str);
  },
  // 验证一个字符串是否是
   isUrl : function (str:string) {
    var patrn = /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+[\/=\?%\-&_~`@[\]:+!]*([^<>])*$/;
    return patrn.exec(str);
  },
  // 验证一个字符串是否是电话或传真
  isTel: function (str:string) {
    var pattern = /^[+]?((\d){3,4}([ ]|[-]))?((\d){3,9})(([ ]|[-])(\d){1,12})?$/;
    return pattern.exec(str);
  },
  // 验证一个字符串是否是手机号码
  isMobile:function (str:string) {
    var patrn = /^(1[3-9]{1})\d{9}$/;
    return patrn.exec(str);
  },
  // 验证一个字符串是否是传真号
   isFax: function (str:string) {
    var patrn = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    return patrn.exec(str);
  },
  // 验证一个字符串是否是数字
  isNum : function (str:string) {
    var p = /^\d+$/;
    return p.exec(str);
  },
  // 验证字符串是否不包含特殊字符 返回bool
  isUnSymbols : function (str:string) {
    var p = /^[A-Za-z0-9\u0391-\uFFE5 \.,()，。（）\-]+$/;
    return p.exec(str);
  },
  // 密码为8-20位，必须包含字母+数字
  isPasswordRule : function (str:string) {
    var p= /^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/;
    return p.test(str);
  }
}

export default RegExp;
