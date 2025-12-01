// LaundryFlow - Main Application Logic
class LaundryManager {
    constructor() {
        this.items = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.sortColumn = 'id';
        this.sortDirection = 'asc';
        this.selectedItems = new Set();
        this.filters = {
            search: '',
            status: ['received', 'progress', 'ready'],
            dateFrom: '',
            dateTo: ''
        };
        
        this.initSampleData();
        this.bindEvents();
    }
    
    initSampleData() {
        const sampleItems = [
            {
                id: 'LF001',
                customer: 'John Smith',
                item: 'Shirt',
                service: 'Wash & Iron',
                status: 'ready',
                dropOffDate: '2024-12-01',
                readyDate: '2024-12-02',
                price: 8.50,
                instructions: 'Light starch on collar'
            },
            {
                id: 'LF002',
                customer: 'Sarah Johnson',
                item: 'Dress',
                service: 'Dry Clean',
                status: 'progress',
                dropOffDate: '2024-12-01',
                readyDate: '2024-12-03',
                price: 15.00,
                instructions: 'Beads on neckline - handle with care'
            },
            {
                id: 'LF003',
                customer: 'Michael Brown',
                item: 'Suit',
                service: 'Dry Clean',
                status: 'received',
                dropOffDate: '2024-12-02',
                readyDate: '2024-12-04',
                price: 18.00,
                instructions: ''
            },
            {
                id: 'LF004',
                customer: 'Emily Davis',
                item: 'Jacket',
                service: 'Wash & Fold',
                status: 'ready',
                dropOffDate: '2024-11-30',
                readyDate: '2024-12-01',
                price: 12.00,
                instructions: 'Remove before ready date'
            },
            {
                id: 'LF005',
                customer: 'David Wilson',
                item: 'Pants',
                service: 'Iron Only',
                status: 'progress',
                dropOffDate: '2024-12-02',
                readyDate: '2024-12-03',
                price: 6.50,
                instructions: ''
            },
            {
                id: 'LF006',
                customer: 'Lisa Anderson',
                item: 'Coat',
                service: 'Dry Clean',
                status: 'received',
                dropOffDate: '2024-12-02',
                readyDate: '2024-12-05',
                price: 20.00,
                instructions: 'Leather trim - special care'
            },
            {
                id: 'LF007',
                customer: 'Robert Taylor',
                item: 'Shirt',
                service: 'Starch',
                status: 'ready',
                dropOffDate: '2024-12-01',
                readyDate: '2024-12-02',
                price: 9.00,
                instructions: 'Heavy starch'
            },
            {
                id: 'LF008',
                customer: 'Jennifer Martinez',
                item: 'Skirt',
                service: 'Delicate Wash',
                status: 'progress',
                dropOffDate: '2024-12-02',
                readyDate: '2024-12-04',
                price: 11.00,
                instructions: 'Silk fabric - cold water only'
            },
            {
                id: 'LF009',
                customer: 'James White',
                item: 'Sweater',
                service: 'Wash & Fold',
                status: 'received',
                dropOffDate: '2024-12-02',
                readyDate: '2024-12-04',
                price: 10.50,
                instructions: 'Wool - lay flat to dry'
            },
            {
                id: 'LF010',
                customer: 'Maria Garcia',
                item: 'Blouse',
                service: 'Iron Only',
                status: 'ready',
                dropOffDate: '2024-11-30',
                readyDate: '2024-12-01',
                price: 7.00,
                instructions: ''
            }
        ];
        
        this.items = sampleItems;
        this.updateDisplay();
    }
    
    bindEvents() {
        // Form submission
        document.getElementById('addForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addItem();
        });
        
        // Search and filter events
        document.getElementById('searchInput').addEventListener('input', () => {
            this.filters.search = document.getElementById('searchInput').value.toLowerCase();
            this.updateDisplay();
        });
        
        // Date filters
        document.getElementById('dateFrom').addEventListener('change', (e) => {
            this.filters.dateFrom = e.target.value;
            this.updateDisplay();
        });
        
        document.getElementById('dateTo').addEventListener('change', (e) => {
            this.filters.dateTo = e.target.value;
            this.updateDisplay();
        });
    }
    
    generateId() {
        const lastId = this.items.length > 0 ? 
            Math.max(...this.items.map(item => parseInt(item.id.replace('LF', '')))) : 0;
        return `LF${String(lastId + 1).padStart(3, '0')}`;
    }
    
    calculateReadyDate(serviceType, priority = false) {
        const today = new Date();
        let daysToAdd = 2; // Default 2 days
        
        // Adjust based on service type
        switch(serviceType) {
            case 'Dry Clean':
                daysToAdd = 3;
                break;
            case 'Wash & Fold':
                daysToAdd = 1;
                break;
            case 'Iron Only':
                daysToAdd = 1;
                break;
            case 'Delicate Wash':
                daysToAdd = 2;
                break;
            case 'Stain Removal':
                daysToAdd = 3;
                break;
            default:
                daysToAdd = 2;
        }
        
        // Priority orders are faster
        if (priority) {
            daysToAdd = Math.max(1, daysToAdd - 1);
        }
        
        const readyDate = new Date(today);
        readyDate.setDate(today.getDate() + daysToAdd);
        
        return readyDate.toISOString().split('T')[0];
    }
    
    calculatePrice(itemType, serviceType, priority = false) {
        let basePrice = 0;
        
        // Base price by item type
        switch(itemType) {
            case 'Shirt': basePrice = 6.00; break;
            case 'Pants': basePrice = 7.00; break;
            case 'Dress': basePrice = 12.00; break;
            case 'Jacket': basePrice = 10.00; break;
            case 'Suit': basePrice = 15.00; break;
            case 'Coat': basePrice = 16.00; break;
            case 'Skirt': basePrice = 8.00; break;
            case 'Blouse': basePrice = 6.50; break;
            case 'Tie': basePrice = 4.00; break;
            case 'Scarf': basePrice = 5.00; break;
            case 'Sweater': basePrice = 9.00; break;
            case 'Jeans': basePrice = 7.50; break;
            case 'Shorts': basePrice = 5.50; break;
            case 'Underwear': basePrice = 3.00; break;
            case 'Socks': basePrice = 2.00; break;
            default: basePrice = 6.00;
        }
        
        // Service multiplier
        let serviceMultiplier = 1;
        switch(serviceType) {
            case 'Dry Clean': serviceMultiplier = 1.8; break;
            case 'Wash & Iron': serviceMultiplier = 1.3; break;
            case 'Iron Only': serviceMultiplier = 0.8; break;
            case 'Starch': serviceMultiplier = 1.4; break;
            case 'Delicate Wash': serviceMultiplier = 1.5; break;
            case 'Stain Removal': serviceMultiplier = 1.6; break;
            case 'Alterations': serviceMultiplier = 2.0; break;
            default: serviceMultiplier = 1;
        }
        
        let price = basePrice * serviceMultiplier;
        
        // Priority surcharge
        if (priority) {
            price *= 1.5;
        }
        
        return Math.round(price * 100) / 100;
    }
    
    addItem() {
        const customerName = document.getElementById('customerName').value;
        const itemType = document.getElementById('itemType').value;
        const serviceType = document.getElementById('serviceType').value;
        const specialInstructions = document.getElementById('specialInstructions').value;
        const priorityOrder = document.getElementById('priorityOrder').checked;
        
        if (!customerName || !itemType || !serviceType) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const newItem = {
            id: this.generateId(),
            customer: customerName,
            item: itemType,
            service: serviceType,
            status: 'received',
            dropOffDate: new Date().toISOString().split('T')[0],
            readyDate: this.calculateReadyDate(serviceType, priorityOrder),
            price: this.calculatePrice(itemType, serviceType, priorityOrder),
            instructions: specialInstructions
        };
        
        this.items.unshift(newItem);
        this.updateDisplay();
        this.closeAddModal();
        
        // Show success animation
        this.showNotification('Item added successfully!', 'success');
        
        // Reset form
        document.getElementById('addForm').reset();
    }
    
    updateItemStatus(id, newStatus) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.status = newStatus;
            this.updateDisplay();
            this.showNotification(`Status updated to ${newStatus}`, 'success');
        }
    }
    
    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            this.updateDisplay();
            this.showNotification('Item deleted successfully!', 'success');
        }
    }
    
    getFilteredItems() {
        return this.items.filter(item => {
            // Search filter
            if (this.filters.search && 
                !item.customer.toLowerCase().includes(this.filters.search) &&
                !item.item.toLowerCase().includes(this.filters.search) &&
                !item.service.toLowerCase().includes(this.filters.search) &&
                !item.instructions.toLowerCase().includes(this.filters.search)) {
                return false;
            }
            
            // Status filter
            if (this.filters.status.length > 0 && !this.filters.status.includes(item.status)) {
                return false;
            }
            
            // Date filters
            if (this.filters.dateFrom && item.dropOffDate < this.filters.dateFrom) {
                return false;
            }
            
            if (this.filters.dateTo && item.dropOffDate > this.filters.dateTo) {
                return false;
            }
            
            return true;
        });
    }
    
    sortItems(items) {
        return items.sort((a, b) => {
            let aVal = a[this.sortColumn];
            let bVal = b[this.sortColumn];
            
            // Handle different data types
            if (this.sortColumn === 'price') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            } else if (this.sortColumn === 'date' || this.sortColumn === 'ready') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            
            if (this.sortDirection === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    }
    
    updateDisplay() {
        const filteredItems = this.getFilteredItems();
        const sortedItems = this.sortItems([...filteredItems]);
        
        // Update stats
        this.updateStats(filteredItems);
        
        // Update table
        this.updateTable(sortedItems);
        
        // Update pagination
        this.updatePagination(sortedItems.length);
    }
    
    updateStats(items) {
        const total = items.length;
        const progress = items.filter(item => item.status === 'progress').length;
        const ready = items.filter(item => item.status === 'ready').length;
        
        document.getElementById('totalItems').textContent = total;
        document.getElementById('progressItems').textContent = progress;
        document.getElementById('readyItems').textContent = ready;
    }
    
    updateTable(items) {
        const tbody = document.getElementById('tableBody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageItems = items.slice(startIndex, endIndex);
        
        tbody.innerHTML = '';
        
        pageItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" class="item-checkbox" value="${item.id}" 
                           ${this.selectedItems.has(item.id) ? 'checked' : ''} 
                           onchange="toggleItemSelection('${item.id}')">
                </td>
                <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">${item.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.customer}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.item}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.service}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <select class="status-badge status-${item.status}" onchange="updateStatus('${item.id}', this.value)">
                        <option value="received" ${item.status === 'received' ? 'selected' : ''}>Received</option>
                        <option value="progress" ${item.status === 'progress' ? 'selected' : ''}>In Progress</option>
                        <option value="ready" ${item.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="delivered" ${item.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    </select>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(item.dropOffDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.formatDate(item.readyDate)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$${item.price.toFixed(2)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button onclick="editItem('${item.id}')" 
                                class="text-blue-600 hover:text-blue-900">Edit</button>
                        <button onclick="deleteItem('${item.id}')" 
                                class="text-red-600 hover:text-red-900">Delete</button>
                        <button onclick="printTag('${item.id}')" 
                                class="text-green-600 hover:text-green-900">Print</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Animate new rows
        anime({
            targets: '.table-row',
            translateX: [-20, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 400,
            delay: anime.stagger(50)
        });
    }
    
    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, totalItems);
        
        document.getElementById('showingStart').textContent = totalItems > 0 ? startIndex : 0;
        document.getElementById('showingEnd').textContent = endIndex;
        document.getElementById('totalRecords').textContent = totalItems;
        document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;
        
        // Update button states
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === totalPages || totalItems === 0;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 300
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 300],
                opacity: [1, 0],
                easing: 'easeInExpo',
                duration: 300,
                complete: () => notification.remove()
            });
        }, 3000);
    }
    
    closeAddModal() {
        document.getElementById('addModal').classList.add('hidden');
    }
}

// Global variables and functions
let laundryManager;

function initializeApp() {
    laundryManager = new LaundryManager();
}

function openAddModal() {
    document.getElementById('addModal').classList.remove('hidden');
}

function closeAddModal() {
    laundryManager.closeAddModal();
}

function updateStatus(id, newStatus) {
    laundryManager.updateItemStatus(id, newStatus);
}

function deleteItem(id) {
    laundryManager.deleteItem(id);
}

function editItem(id) {
    // For demo purposes, just show a notification
    laundryManager.showNotification('Edit functionality would open a detailed form', 'info');
}

function printTag(id) {
    laundryManager.showNotification('Printing tag for item ' + id, 'success');
}

function printTags() {
    const selectedCount = laundryManager.selectedItems.size;
    if (selectedCount === 0) {
        laundryManager.showNotification('Please select items to print', 'error');
        return;
    }
    laundryManager.showNotification(`Printing tags for ${selectedCount} items`, 'success');
}

function bulkUpdateStatus() {
    const selectedCount = laundryManager.selectedItems.size;
    if (selectedCount === 0) {
        laundryManager.showNotification('Please select items to update', 'error');
        return;
    }
    
    const newStatus = prompt('Enter new status (received, progress, ready, delivered):');
    if (['received', 'progress', 'ready', 'delivered'].includes(newStatus)) {
        laundryManager.selectedItems.forEach(id => {
            laundryManager.updateItemStatus(id, newStatus);
        });
        laundryManager.selectedItems.clear();
        laundryManager.updateDisplay();
    }
}

function toggleItemSelection(id) {
    if (laundryManager.selectedItems.has(id)) {
        laundryManager.selectedItems.delete(id);
    } else {
        laundryManager.selectedItems.add(id);
    }
}

function toggleSelectAll() {
    const checkboxes = document.querySelectorAll('.item-checkbox');
    const selectAll = document.getElementById('selectAll').checked;
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
        const itemId = checkbox.value;
        if (selectAll) {
            laundryManager.selectedItems.add(itemId);
        } else {
            laundryManager.selectedItems.delete(itemId);
        }
    });
}

function filterData() {
    // Update status filters
    const statusCheckboxes = document.querySelectorAll('.status-filter:checked');
    laundryManager.filters.status = Array.from(statusCheckboxes).map(cb => cb.value);
    
    laundryManager.updateDisplay();
}

function sortTable(column) {
    if (laundryManager.sortColumn === column) {
        laundryManager.sortDirection = laundryManager.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        laundryManager.sortColumn = column;
        laundryManager.sortDirection = 'asc';
    }
    laundryManager.updateDisplay();
}

function changePage(direction) {
    const totalPages = Math.ceil(laundryManager.getFilteredItems().length / laundryManager.itemsPerPage);
    
    if (direction === 1 && laundryManager.currentPage < totalPages) {
        laundryManager.currentPage++;
    } else if (direction === -1 && laundryManager.currentPage > 1) {
        laundryManager.currentPage--;
    }
    
    laundryManager.updateDisplay();
}

function exportData() {
    const filteredItems = laundryManager.getFilteredItems();
    
    if (filteredItems.length === 0) {
        laundryManager.showNotification('No data to export', 'error');
        return;
    }
    
    // Create CSV content
    const headers = ['ID', 'Customer', 'Item', 'Service', 'Status', 'Drop-off Date', 'Ready Date', 'Price', 'Instructions'];
    const csvContent = [
        headers.join(','),
        ...filteredItems.map(item => [
            item.id,
            `"${item.customer}"`,
            item.item,
            `"${item.service}"`,
            item.status,
            item.dropOffDate,
            item.readyDate,
            item.price,
            `"${item.instructions}"`
        ].join(','))
    ].join('\\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laundry-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    laundryManager.showNotification('Data exported successfully!', 'success');
}