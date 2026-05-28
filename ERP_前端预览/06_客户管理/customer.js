var customers = [
    {
        id: 1,
        code: 'KH20260501001',
        name: '测试客户公司',
        memberAccount: 'test_company_001',
        customerStatus: 'normal',
        customerType: 'terminal',
        contact: '张三',
        phone: '13800138000',
        email: 'zhangsan@test.com',
        settlement: 'monthly',
        invoiceType: 'special',
        invoiceTitle: '测试客户公司',
        taxNumber: '91110000MA00123456',
        bankName: '中国工商银行北京分行',
        bankAccount: '1102010109876543210',
        accountBalance: 5000.00,
        debtTotal: 12500.00,
        lastOrderTime: '2026-05-24 14:30',
        totalOrderAmount: 123456.78,
        discountRate: 95,
        salespersonName: '业务员A',
        addresses: [
            { receiver: '张三', phone: '13800138000', address: '北京市朝阳区科技园1号', isDefault: true, remark: '默认地址' },
            { receiver: '李四', phone: '13900139000', address: '上海市浦东新区张江高科技园', isDefault: false, remark: '' }
        ],
        remark: '重点客户，请优先处理。'
    },
    {
        id: 2,
        code: 'KH20260505002',
        name: '李四个人客户',
        memberAccount: 'lisi_personal_002',
        customerStatus: 'normal',
        customerType: 'terminal',
        contact: '李四',
        phone: '13900139000',
        email: '',
        settlement: 'cash',
        invoiceType: 'normal',
        invoiceTitle: '李四',
        taxNumber: '',
        accountBalance: 0.00,
        debtTotal: 3200.00,
        lastOrderTime: '2026-05-20 09:15',
        totalOrderAmount: 8765.43,
        discountRate: 100,
        addresses: [
            { receiver: '李四', phone: '13900139000', address: '上海市浦东新区张江高科技园', isDefault: true, remark: '' }
        ],
        remark: ''
    },
    {
        id: 3,
        code: 'KH20251110003',
        name: '沉睡客户公司',
        memberAccount: 'sleeping_company_003',
        customerStatus: 'public',
        customerType: 'dealer',
        contact: '王五',
        phone: '13700137000',
        email: '',
        settlement: 'prepaid',
        invoiceType: 'special',
        invoiceTitle: '沉睡客户公司',
        taxNumber: '91110000MA00987654',
        accountBalance: 10000.00,
        debtTotal: 0.00,
        lastOrderTime: '2025-11-10 08:45',
        totalOrderAmount: 56789.00,
        discountRate: 90,
        addresses: [
            { receiver: '王五', phone: '13700137000', address: '广州市天河区珠江新城', isDefault: true, remark: '' }
        ],
        remark: ''
    }
];

function addCustomerAddress() {
    var table = document.getElementById('customerAddressTable') || document.getElementById('customerAddressTableEdit');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td><input type="text" placeholder="收货人"></td>' +
        '<td><input type="text" placeholder="联系电话"></td>' +
        '<td><input type="text" placeholder="收货地址"></td>' +
        '<td><select><option value="1">是</option><option value="0" selected>否</option></select></td>' +
        '<td><input type="text" placeholder="备注"></td>' +
        '<td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>';
    
    tbody.appendChild(newRow);
}

function removeCustomerAddress(link) {
    var tr = link.closest('tr');
    tr.remove();
}

function saveCustomerDraft() {
    showAlert('客户已保存为草稿！');
    setTimeout(function() {
        showModule('customer-list');
    }, 500);
}

function validateCustomerForm() {
    var customerType = document.getElementById('customerTypeCreate');
    if (customerType && customerType.value === 'terminal') {
        var researchGroupName = document.getElementById('researchGroupName');
        var researchLeader = document.getElementById('researchLeader');
        var researchPhone = document.getElementById('researchPhone');
        
        if (!researchGroupName || !researchGroupName.value) {
            showAlert('请填写课题组名称');
            return false;
        }
        if (!researchLeader || !researchLeader.value) {
            showAlert('请填写课题组负责人');
            return false;
        }
        if (!researchPhone || !researchPhone.value) {
            showAlert('请填写联系电话');
            return false;
        }
    }
    return true;
}

function saveCustomer() {
    if (!validateCustomerForm()) {
        return;
    }
    
    showAlert('客户保存成功！已启用。');
    setTimeout(function() {
        showModule('customer-list');
    }, 500);
}

function addInvoiceRow() {
    var table = document.getElementById('invoiceTable');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td><input type="text" placeholder="发票抬头" style="width:100%;"></td>' +
        '<td><input type="text" placeholder="税号" style="width:100%;"></td>' +
        '<td><input type="text" placeholder="开户行" style="width:100%;"></td>' +
        '<td><input type="text" placeholder="银行账号" style="width:100%;"></td>' +
        '<td><input type="text" placeholder="地址、电话" style="width:100%;"></td>' +
        '<td style="text-align:center;"><input type="checkbox" ondblclick="toggleCheckbox(this)"></td>' +
        '<td><a class="action-link danger" onclick="removeInvoiceRow(this)">删除</a></td>';
    
    tbody.appendChild(newRow);
}

function removeInvoiceRow(btn) {
    var table = document.getElementById('invoiceTable');
    var tbody = table.querySelector('tbody');
    var row = btn.closest('tr');
    
    if (tbody.children.length > 1) {
        row.remove();
    } else {
        showAlert('至少需要保留一条开票信息');
    }
}

function toggleCheckbox(checkbox) {
    checkbox.checked = !checkbox.checked;
}

function initCustomerCreate() {
    // 初始化课题组信息显示状态
    var customerTypeSelect = document.getElementById('customerTypeCreate');
    if (customerTypeSelect) {
        updateResearchGroupDisplay(customerTypeSelect);
    }
}

function updateResearchGroupDisplay(select) {
    var researchGroupSection = document.getElementById('researchGroupSection');
    if (!researchGroupSection) return;
    
    if (select.value === 'terminal') {
        researchGroupSection.style.display = 'block';
    } else {
        researchGroupSection.style.display = 'none';
    }
}

function onCustomerTypeChange(select) {
    updateResearchGroupDisplay(select);
}

function checkCustomerDuplicate(input) {
    var customerName = input.value.trim();
    if (!customerName) return;
    
    var existingCustomer = customers.find(function(c) {
        return c.name === customerName;
    });
    
    if (existingCustomer) {
        var message = '';
        if (existingCustomer.customerStatus === 'public') {
            message = customerName + ' 客户归属公共池';
        } else if (existingCustomer.salespersonName) {
            message = customerName + ' 客户归属业务员 ' + existingCustomer.salespersonName;
        } else {
            message = customerName + ' 客户已存在';
        }
        showAlert(message);
    }
}

function deleteCustomer(id) {
    showConfirm('确定要删除该客户吗？删除后相关数据将无法恢复。', function() {
        var row = document.getElementById('row-customer-' + id);
        if (row) {
            row.remove();
        }
        showAlert('删除成功！');
    });
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

function setCustomerDefault(id) {
    var customer = customers.find(c => c.id === id);
    var customerName = customer ? customer.name : '该客户';
    
    showConfirm('确定为【' + customerName + '】设置订单默认值？', function() {
        showAlert('订单默认值设置成功！\n\n默认设置项：\n- 收货地址：将使用客户的默认收货地址\n- 开票信息：将使用客户维护的开票信息\n- 结算方式：将使用客户设定的结算方式\n- 税率：将根据客户发票类型自动带出');
    });
}

function registerMember(id) {
    var customer = customers.find(c => c.id === id);
    var memberAccount = customer ? customer.memberAccount : '';
    
    if (memberAccount) {
        showAlert('该客户已有会员账号：' + memberAccount);
    } else {
        var account = prompt('请设置会员账号：');
        if (account) {
            if (customer) {
                customer.memberAccount = account;
            }
            showAlert('会员账号设置成功：' + account);
        }
    }
}

function transferCustomer(id) {
    var salesman = prompt('请输入新业务员名称：', '系统管理员');
    if (salesman) {
        showAlert('客户已成功转移给业务员：' + salesman);
    }
}

function setDiscount(id) {
    var customer = customers.find(c => c.id === id);
    var currentDiscount = customer ? customer.discountRate : 100;
    
    var discount = prompt('请设置客户专属折扣（0-100）：', currentDiscount.toString());
    if (discount !== null) {
        var num = parseInt(discount);
        if (!isNaN(num) && num >= 0 && num <= 100) {
            if (customer) {
                customer.discountRate = num;
            }
            showAlert('折扣设置成功：' + num + '%');
        } else {
            showAlert('请输入有效的折扣值（0-100）');
        }
    }
}

function setCreditLimit(id) {
    var customer = customers.find(c => c.id === id);
    var customerName = customer ? customer.name : '该客户';
    
    showAlert('设置【' + customerName + '】的固定账期额度\n\n账期额度设置说明：\n- 账期天数：指客户可以延迟付款的天数\n- 信用额度：指客户可赊账的最大金额\n- 当欠款超过信用额度或超过账期天数时，系统将自动提醒');
}

function claimCustomer(id) {
    var customer = customers.find(c => c.id === id);
    var customerName = customer ? customer.name : '该客户';
    
    showConfirm('确认认领客户【' + customerName + '】？', function() {
        showAlert('客户认领成功！');
        if (customer) {
            customer.customerStatus = 'normal';
        }
        showModule('customer-list');
    });
}

function onInvoiceTypeChange(select) {
    if (select.value === 'special') {
        showAlert('增值税专用发票需要填写完整的开票信息。');
    }
}

function addAddressRow() {
    var table = document.getElementById('customerAddressTable') || document.getElementById('editCustomerAddressTable');
    if (!table) return;
    
    var tbody = table.querySelector('tbody');
    var newRow = document.createElement('tr');
    newRow.innerHTML = '<td><input type="text" placeholder="收货人"></td>' +
        '<td><input type="text" placeholder="联系电话"></td>' +
        '<td><input type="text" placeholder="收货地址"></td>' +
        '<td><select><option value="1">是</option><option value="0" selected>否</option></select></td>' +
        '<td><input type="text" placeholder="备注"></td>' +
        '<td><a class="action-link danger" onclick="removeAddressRow(this)">删除</a></td>';
    
    tbody.appendChild(newRow);
}

function removeAddressRow(btn) {
    var row = btn.closest('tr');
    row.remove();
    updateRowNumbers();
}

function updateRowNumbers() {
    var table = document.getElementById('customerAddressTable') || document.getElementById('editCustomerAddressTable');
    if (!table) return;
    
    var rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row, index) {
        var firstCell = row.querySelector('td:first-child');
        if (firstCell && !firstCell.querySelector('input')) {
            firstCell.textContent = index + 1;
        }
    });
}

document.addEventListener('click', function(event) {
    if (!event.target.matches('.action-link')) {
        document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
            menu.style.display = 'none';
        });
    }
});