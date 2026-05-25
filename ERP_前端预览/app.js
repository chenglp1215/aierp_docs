function showModule(moduleId) {
    // 隐藏所有模块
    document.querySelectorAll('.module').forEach(function(m) {
        m.classList.add('hidden');
    });

    // 显示选中模块
    var target = document.getElementById(moduleId);
    if (target) {
        target.classList.remove('hidden');
    }

    // 更新导航状态
    document.querySelectorAll('.menu a').forEach(function(a) {
        a.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
}
