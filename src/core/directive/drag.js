const directive = {
  bind(el){
    el.onmousedown = function(e){
      //获取鼠标点击处分别与div左边和上边的距离：鼠标位置-div位置
      var divx = e.clientX - el.offsetLeft;
      var divy = e.clientY - el.offsetTop;
      //包含在onmousedown里，表示点击后才移动，为防止鼠标移出div，使用document.onmousemove
      document.onmousemove = function(e){
        //获取移动后div的位置：鼠标位置-divx/divy
        var l = e.clientX - divx;
        var t = e.clientY - divy;
        el.style.left=l+'px';
        el.style.top=t+'px';
      }
      document.onmouseup = function(e){
        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
};

export default directive;
