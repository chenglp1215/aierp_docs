
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 修改新建客户表单的基本信息部分
old_create_base = '''                <section id="customer-create" class="module hidden">
                    <div class="page-header">
                        <h2>新建客户</h2>
                        <button class="btn" onclick="showModule('customer-list')">取消</button>
                    </div>
                    
                    <div class="form-section">
                        <h3>基本信息</h3>
                        <div class="form-grid">
                            <div class="form-item">
                                <label><span class="required">*</span> 客户编码</label>
                                <input type="text" value="KH20260527001" readonly>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 客户名称</label>
                                <input type="text" placeholder="客户全称">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 会员账号</label>
                                <input type="text" placeholder="用于客户登录商城">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 客户类型</label>
                                <select>
                                    <option value="terminal">终端</option>
                                    <option value="dealer">经销商</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 联系人</label>
                                <input type="text" placeholder="主要联系人姓名">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 联系电话</label>
                                <input type="text" placeholder="手机号或固定电话">
                            </div>
                            <div class="form-item">
                                <label>邮箱地址</label>
                                <input type="text" placeholder="联系邮箱">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 结算方式</label>
                                <select>
                                    <option value="monthly">月结</option>
                                    <option value="cash">现结</option>
                                    <option value="prepaid">预付</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 发票类型</label>
                                <select id="createInvoiceType" onchange="onInvoiceTypeChange(this)">
                                    <option value="normal">增值税普通发票</option>
                                    <option value="special">增值税专用发票</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>开票信息</h3>
                        <div class="form-grid">
                            <div class="form-item">
                                <label>发票抬头</label>
                                <input type="text" placeholder="开票抬头">
                            </div>
                            <div class="form-item">
                                <label>税号</label>
                                <input type="text" placeholder="纳税人识别号">
                            </div>
                            <div class="form-item">
                                <label>开户银行</label>
                                <input type="text" placeholder="银行名称">
                            </div>
                            <div class="form-item">
                                <label>银行账号</label>
                                <input type="text" placeholder="银行账号">
                            </div>
                            <div class="form-item">
                                <label>企业地址</label>
                                <input type="text" placeholder="注册地址或经营地址">
                            </div>
                            <div class="form-item">
                                <label>企业电话</label>
                                <input type="text" placeholder="企业电话">
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>收货地址</h3>
                        <table id="customerAddressTable" class="sub-table">
                            <thead>
                                <tr>
                                    <th>收货人</th>
                                    <th>联系电话</th>
                                    <th>收货地址</th>
                                    <th>是否默认</th>
                                    <th>备注</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="text" placeholder="收货人"></td>
                                    <td><input type="text" placeholder="联系电话"></td>
                                    <td><input type="text" placeholder="收货地址"></td>
                                    <td>
                                        <select>
                                            <option value="1">是</option>
                                            <option value="0" selected>否</option>
                                        </select>
                                    </td>
                                    <td><input type="text" placeholder="备注"></td>
                                    <td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>
                                </tr>
                            </tbody>
                        </table>
                        <button class="btn btn-sm btn-primary" onclick="addCustomerAddress()" style="margin-top:12px;">+ 添加收货地址</button>
                    </div>

                    <div class="form-section">
                        <h3>其他信息</h3>
                        <div class="form-grid">
                            <div class="form-item">
                                <label>专属折扣</label>
                                <input type="number" value="100" min="0" max="100">
                            </div>
                            <div class="form-item full">
                                <label>备注</label>
                                <textarea rows="3" placeholder="备注信息"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button class="btn" onclick="showModule('customer-list')">取消</button>
                        <button class="btn btn-primary" onclick="saveCustomerDraft()">保存草稿</button>
                        <button class="btn btn-success" onclick="saveCustomer()">保存并启用</button>
                    </div>
                </section>'''

new_create_base = '''                <section id="customer-create" class="module hidden">
                    <div class="page-header">
                        <h2>新建客户</h2>
                        <button class="btn" onclick="showModule('customer-list')">取消</button>
                    </div>
                    
                    <div class="form-section">
                        <h3>基本信息</h3>
                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 客户编码</label>
                                <input type="text" value="KH20260528001" readonly>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 客户名称</label>
                                <input type="text" placeholder="客户全称">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-item">
                                <label><span class="required">*</span> 客户类型</label>
                                <select id="customerTypeCreate">
                                    <option value="terminal">终端</option>
                                    <option value="dealer">经销商</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 联系人</label>
                                <input type="text" placeholder="主要联系人姓名">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 联系电话</label>
                                <input type="text" placeholder="手机号或固定电话">
                            </div>
                            <div class="form-item">
                                <label><span class="required">*</span> 结算方式</label>
                                <select>
                                    <option value="monthly">月结</option>
                                    <option value="cash">现结</option>
                                    <option value="prepaid">预付</option>
                                </select>
                            </div>
                            <div class="form-item">
                                <label>邮箱</label>
                                <input type="text" placeholder="联系邮箱">
                            </div>
                        </div>
                        <div class="form-row" id="researchGroupFields">
                            <div class="form-item">
                                <label><span class="required" id="researchGroupRequired">*</span> 课题组名称</label>
                                <input type="text" id="researchGroupName" placeholder="请输入课题组名称">
                            </div>
                            <div class="form-item">
                                <label><span class="required" id="researchLeaderRequired">*</span> 课题组负责人</label>
                                <input type="text" id="researchLeader" placeholder="请输入课题组负责人">
                            </div>
                            <div class="form-item">
                                <label><span class="required" id="researchPhoneRequired">*</span> 联系电话</label>
                                <input type="text" id="researchPhone" placeholder="请输入联系电话">
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>收货信息</h3>
                        <table id="customerAddressTable" class="sub-table" style="width:100%;">
                            <thead>
                                <tr>
                                    <th style="width:15%;">收货人</th>
                                    <th style="width:15%;">联系电话</th>
                                    <th style="width:50%;">收货地址</th>
                                    <th style="width:10%;">默认</th>
                                    <th style="width:10%;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="text" placeholder="收货人" style="width:100%;"></td>
                                    <td><input type="text" placeholder="联系电话" style="width:100%;"></td>
                                    <td><input type="text" placeholder="收货地址" style="width:100%;"></td>
                                    <td style="text-align:center;">
                                        <input type="checkbox" ondblclick="toggleCheckbox(this)">
                                    </td>
                                    <td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>
                                </tr>
                            </tbody>
                        </table>
                        <button class="btn btn-sm btn-primary" onclick="addCustomerAddress()" style="margin-top:12px;">+ 添加收货地址</button>
                    </div>

                    <div class="form-section">
                        <h3>开票信息</h3>
                        <table id="invoiceTable" class="sub-table" style="width:100%;">
                            <thead>
                                <tr>
                                    <th style="width:20%;">发票抬头</th>
                                    <th style="width:15%;">税号</th>
                                    <th style="width:15%;">开户行</th>
                                    <th style="width:15%;">银行账号</th>
                                    <th style="width:15%;">地址、电话</th>
                                    <th style="width:10%;">默认</th>
                                    <th style="width:10%;">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input type="text" placeholder="发票抬头" style="width:100%;"></td>
                                    <td><input type="text" placeholder="税号" style="width:100%;"></td>
                                    <td><input type="text" placeholder="开户行" style="width:100%;"></td>
                                    <td><input type="text" placeholder="银行账号" style="width:100%;"></td>
                                    <td><input type="text" placeholder="地址、电话" style="width:100%;"></td>
                                    <td style="text-align:center;">
                                        <input type="checkbox" ondblclick="toggleCheckbox(this)">
                                    </td>
                                    <td><a class="action-link danger" onclick="removeInvoiceRow(this)">删除</a></td>
                                </tr>
                            </tbody>
                        </table>
                        <button class="btn btn-sm btn-primary" onclick="addInvoiceRow()" style="margin-top:12px;">+ 添加开票信息</button>
                    </div>

                    <div class="form-actions">
                        <button class="btn" onclick="showModule('customer-list')">取消</button>
                        <button class="btn btn-success" onclick="saveCustomer()">保存并启用</button>
                    </div>
                </section>'''

content = content.replace(old_create_base, new_create_base)

# 2. 添加JavaScript函数来支持新功能
# 找到function addCustomerAddress的位置，在其后添加新函数
old_functions = '''        function addCustomerAddress() {
            const table = document.getElementById('customerAddressTable');
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" placeholder="收货人"></td>
                <td><input type="text" placeholder="联系电话"></td>
                <td><input type="text" placeholder="收货地址"></td>
                <td>
                    <select>
                        <option value="1">是</option>
                        <option value="0" selected>否</option>
                    </select>
                </td>
                <td><input type="text" placeholder="备注"></td>
                <td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>
            `;
            tbody.appendChild(newRow);
        }'''

new_functions = '''        function addCustomerAddress() {
            const table = document.getElementById('customerAddressTable');
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" placeholder="收货人" style="width:100%;"></td>
                <td><input type="text" placeholder="联系电话" style="width:100%;"></td>
                <td><input type="text" placeholder="收货地址" style="width:100%;"></td>
                <td style="text-align:center;">
                    <input type="checkbox" ondblclick="toggleCheckbox(this)">
                </td>
                <td><a class="action-link danger" onclick="removeCustomerAddress(this)">删除</a></td>
            `;
            tbody.appendChild(newRow);
        }
        
        function addInvoiceRow() {
            const table = document.getElementById('invoiceTable');
            const tbody = table.querySelector('tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" placeholder="发票抬头" style="width:100%;"></td>
                <td><input type="text" placeholder="税号" style="width:100%;"></td>
                <td><input type="text" placeholder="开户行" style="width:100%;"></td>
                <td><input type="text" placeholder="银行账号" style="width:100%;"></td>
                <td><input type="text" placeholder="地址、电话" style="width:100%;"></td>
                <td style="text-align:center;">
                    <input type="checkbox" ondblclick="toggleCheckbox(this)">
                </td>
                <td><a class="action-link danger" onclick="removeInvoiceRow(this)">删除</a></td>
            `;
            tbody.appendChild(newRow);
        }
        
        function removeInvoiceRow(element) {
            const row = element.closest('tr');
            const tbody = row.parentElement;
            if (tbody.children.length > 1) {
                row.remove();
            } else {
                alert('至少需要保留一条开票信息');
            }
        }
        
        function toggleCheckbox(checkbox) {
            checkbox.checked = !checkbox.checked;
        }
        
        function onCustomerTypeChange(select) {
            const researchGroupFields = document.getElementById('researchGroupFields');
            const requiredFields = researchGroupFields.querySelectorAll('.required');
            
            if (select.value === 'terminal') {
                researchGroupFields.style.display = 'flex';
                requiredFields.forEach(el => el.style.display = 'inline');
            } else {
                researchGroupFields.style.display = 'none';
                requiredFields.forEach(el => el.style.display = 'none');
            }
        }
        
        function validateCustomerForm() {
            const customerType = document.getElementById('customerTypeCreate');
            if (customerType && customerType.value === 'terminal') {
                const researchGroupName = document.getElementById('researchGroupName');
                const researchLeader = document.getElementById('researchLeader');
                const researchPhone = document.getElementById('researchPhone');
                
                if (!researchGroupName.value || !researchLeader.value || !researchPhone.value) {
                    alert('请填写课题组信息');
                    return false;
                }
            }
            return true;
        }
        
        function saveCustomer() {
            if (!validateCustomerForm()) {
                return;
            }
            if (confirm('确定要保存并启用该客户吗？')) {
                alert('客户保存成功');
                showModule('customer-list');
            }
        }'''

content = content.replace(old_functions, new_functions)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('修改完成！')
print('1. 客户编码改为年月日001格式')
print('2. 取消会员账号字段')
print('3. 客户类型、联系人、联系电话、结算方式、邮箱在同一行')
print('4. 取消发票类型字段')
print('5. 增加课题组名称、负责人、联系电话（终端时必填）')
print('6. 收货地址改成收货信息，列宽50%，备注取消，默认字段双击切换')
print('7. 开票信息支持多行，默认字段双击切换')
print('8. 取消其他信息、备注、保存草稿按钮')
