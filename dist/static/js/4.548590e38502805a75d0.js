webpackJsonp([4],{"2Vie":function(e,r){},P7ry:function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s("//Fk"),a=s.n(t),o=s("L6bb"),n=s.n(o),i=s("lbHh"),l=s.n(i),d=s("Ea+1"),u=s("A/UQ"),c=s("+sZq"),m={name:"Login",components:{Header:s("teIl").a},data:function(){return{form:{userName:"",password:""},loading:!1,rules:{userName:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]}}},computed:{passwordType:function(){return this.showPassword?"":"password"},btnDisable:function(){var e=this.userName,r=this.password;return!e||!r}},methods:{login:function(){var e=this;this.$refs.form.validate(function(r){if(!r)return!1;e.loading=!0,e.showPassword=!1,d.a.login.doLogin({userName:e.form.userName,password:n()(e.form.password)}).then(function(r){var s=r.data;if(e.loading=!1,!s||!s.success)return a.a.reject(s.message);l.a.set("token",s.data,{expires:1*u.c.tokenValidTime/24}),e.$router.push({name:"Main"})}).catch(function(r){e.loading=!1;var s=r&&Object(c.c)(r)?r:"登录失败,请检查网络重新尝试~";e.$message({message:s,type:"error",center:!0})})})},resetForm:function(){this.$refs.form.resetFields()}}},f={render:function(){var e=this,r=e.$createElement,s=e._self._c||r;return s("div",{staticClass:"login-wrap",attrs:{id:"target"}},[s("el-card",{staticClass:"box-card"},[s("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[s("span",[e._v("用户登录")])]),s("el-form",{ref:"form",attrs:{rules:e.rules,model:e.form,"label-width":"100px"}},[s("el-form-item",{attrs:{prop:"userName",label:"用户名："}},[s("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.form.userName,callback:function(r){e.$set(e.form,"userName",r)},expression:"form.userName"}})],1),s("el-form-item",{attrs:{prop:"password",label:"密码："}},[s("el-input",{attrs:{type:"passwordType",placeholder:"请输入密码"},model:{value:e.form.password,callback:function(r){e.$set(e.form,"password",r)},expression:"form.password"}})],1),s("el-form-item",{attrs:{align:"left"}},[s("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.login}},[e._v("立即登录")]),s("el-button",{on:{click:e.resetForm}},[e._v("重置")])],1)],1)],1)],1)},staticRenderFns:[]};var p=s("VU/8")(m,f,!1,function(e){s("2Vie")},"data-v-31e0b71b",null);r.default=p.exports}});
//# sourceMappingURL=4.548590e38502805a75d0.js.map