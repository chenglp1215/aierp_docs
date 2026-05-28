function showModule(moduleId) {
    var modules = document.querySelectorAll('.module');
    modules.forEach(function(module) {
        module.classList.add('hidden');
    });
    
    var activeModule = document.getElementById(moduleId);
    if (activeModule) {
        activeModule.classList.remove('hidden');
    }
    
    var menuItems = document.querySelectorAll('.menu a, .submenu a');
    menuItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    var activeMenuItem = document.querySelector('.menu a[href="#' + moduleId + '"], .submenu a[href="#' + moduleId + '"]');
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    var breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        var menuGroup = activeMenuItem ? activeMenuItem.closest('.menu-group, li') : null;
        var moduleName = activeMenuItem ? activeMenuItem.textContent.trim() : '';
        var parentName = menuGroup && menuGroup.querySelector('.menu-text') ? menuGroup.querySelector('.menu-text').textContent.trim() : '';
        
        if (parentName && moduleName) {
            breadcrumb.textContent = parentName + ' > ' + moduleName;
        } else if (moduleName) {
            breadcrumb.textContent = moduleName;
        }
    }
}

function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    var content = document.querySelector('.content');
    
    if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
        sidebar.style.width = '220px';
        content.style.marginLeft = '220px';
    } else {
        sidebar.classList.add('collapsed');
        sidebar.style.width = '64px';
        content.style.marginLeft = '64px';
    }
}

function toggleMenuGroup(element) {
    var menuGroup = element.closest('.menu-group');
    var submenu = menuGroup.querySelector('.submenu');
    var arrow = element.querySelector('.menu-arrow');
    
    if (submenu) {
        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            arrow.textContent = '▼';
            menuGroup.classList.add('expanded');
        } else {
            submenu.classList.add('hidden');
            arrow.textContent = '▶';
            menuGroup.classList.remove('expanded');
        }
    }
}

function toggleDropdown(element) {
    var dropdown = element.nextElementSibling;
    if (dropdown && dropdown.classList.contains('dropdown-menu')) {
        var isOpen = dropdown.style.display === 'block';
        
        document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
            menu.style.display = 'none';
        });
        
        if (!isOpen) {
            dropdown.style.display = 'block';
            event.stopPropagation();
        }
    }
}

document.addEventListener('click', function(event) {
    if (!event.target.matches('.action-link')) {
        document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
            menu.style.display = 'none';
        });
    }
});

function showAlert(message) {
    alert(message);
}

function showConfirm(title, message, callback) {
    var isConfirmed = confirm(message);
    if (isConfirmed && callback) {
        callback();
    }
}

function selectAllText(element) {
    if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function goToModule(modulePath) {
    window.location.href = modulePath;
}

function refreshCurrentModule() {
    var currentModule = document.querySelector('.module:not(.hidden)');
    if (currentModule) {
        showModule(currentModule.id);
    }
}

function navigateTo(moduleName, page) {
    var basePath = '../' + moduleName + '/index.html';
    if (page) {
        basePath = '../' + moduleName + '/' + page + '.html';
    }
    window.location.href = basePath;
}

function getUrlParameter(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    var url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState({}, '', url);
}

function formatCurrency(amount) {
    return '¥' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatDate(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}