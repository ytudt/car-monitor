webpackJsonp([0],{"Ea+1":function(t,n,e){"use strict";var r={};e.d(r,"doLogin",function(){return s});var i={};e.d(i,"getVehicles",function(){return c}),e.d(i,"getLocation",function(){return l}),e.d(i,"getOrderList",function(){return d});var o={};e.d(o,"getUsers",function(){return f}),e.d(o,"addUser",function(){return p}),e.d(o,"delUser",function(){return g}),e.d(o,"getRoles",function(){return v}),e.d(o,"addRole",function(){return m}),e.d(o,"delRole",function(){return h});var a=e("mtWM"),u=e.n(a);function s(t){return u.a.post("api/admin/login",t)}function c(){return u.a.get("api/vehicle/list")}function l(t){return u.a.get("api/vehicle/location",{params:t})}function d(t){return u.a.get("api/order/list",{params:t})}function f(){return u.a.get("api/adminuser/list")}function p(t){return u.a.post("api/adminuser/update",t)}function g(t){return u.a.post("api/adminuser/del/"+t)}function v(){return u.a.get("api/role/list")}function m(t){return u.a.post("api/role/save",t)}function h(t){return u.a.post("api/role/del/"+t)}n.a={login:r,main:i,config:o}},mKtT:function(t,n){},teIl:function(t,n,e){"use strict";var r=e("lbHh"),i=e.n(r),o=e("A/UQ"),a={name:"HelloWorld",data:function(){return{syeVersion:o.b}},computed:{showLogOut:function(){return i.a.get("token")}},methods:{logOut:function(){i.a.remove("token"),this.$router.push({name:"Login"})}}},u={render:function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",{staticClass:"header-wrap"},[e("div",{staticClass:"company-ingo"},[e("div",{staticClass:"img"},[t._v("公司logo")]),e("span",{staticClass:"name"},[t._v("北京*****公司")]),e("span",{staticClass:"version"},[t._v("版本号: "+t._s(t.syeVersion))])]),t._t("default"),t.showLogOut?e("div",{staticClass:"logout",on:{click:t.logOut}},[t._v("退出登录")]):t._e()],2)},staticRenderFns:[]};var s=e("VU/8")(a,u,!1,function(t){e("mKtT")},null,null);n.a=s.exports}});
//# sourceMappingURL=0.8d412ea590c10912cbaf.js.map