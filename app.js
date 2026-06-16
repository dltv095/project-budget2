// ==========================================
// Project & Budget Tracker - Application Logic
// ==========================================

// Global App State
let state = {
    budgetLimit: 1000001, // 1.2M THB
    projects: [],
    users: [],
    tasks: [],
    currentUser: null,
    currentView: 'dashboard'
};

// Chart instances (to destroy before recreating)
let budgetChartInstance = null;
let workloadChartInstance = null;

// Initial Mock Data
const defaultProjects = [
    { id: 'tech', name: 'งานเทคนิค', budget: 800000, lead: 'tech_staff' },
    { id: 'it', name: 'งานสารสนเทศ', budget: 120000, lead: 'it_staff' },
    { id: 'comm', name: 'งานสื่อสารองค์กร', budget: 100000, lead: 'comm_staff' }
];

const defaultUsers = [
    { username: 'manager', name: 'ณัฐพงษ์ สวัสดี', role: 'manager', avatarText: 'หน' },
    { username: 'tech_staff', name: 'จิตเจริญ ยิ้มพราย', role: 'staff', project: 'tech', avatarText: 'เทคนิค' },
    { username: 'tech_staff', name: 'สุรศักดิ์ ทองคล้าย', role: 'staff', project: 'tech', avatarText: 'เทคนิค' },
    { username: 'tech_staff', name: 'ธัญญทิพย์ ฉิมพิบูรณ์', role: 'staff', project: 'tech', avatarText: 'เทคนิค' },
    { username: 'it_staff', name: 'พิศวัสต์ มานันตพงษ์', role: 'staff', project: 'it', avatarText: 'สารสนเทศ' },
    { username: 'it_staff', name: 'เตชินท์ ปานไพรเวท', role: 'staff', project: 'it', avatarText: 'สารสนเทศ' },
    { username: 'it_staff', name: 'บุญนิธิ  คงดี', role: 'staff', project: 'it', avatarText: 'สารสนเทศ' },
    { username: 'it_staff', name: 'จันทนี  บัวงาม', role: 'staff', project: 'it', avatarText: 'สารสนเทศ' },
    { username: 'it_staff', name: 'ปนัดดา  ทองปุย', role: 'staff', project: 'it', avatarText: 'สารสนเทศ' },
    { username: 'comm_staff', name: 'วรรธณา ทองเจริญ', role: 'staff', project: 'comm', avatarText: 'สื่อสารองค์กร' }
];

const defaultTasks = [
    {
        id: 'task-1',
        title: 'พัฒนาระบบหลังบ้าน (Backend System Development)',
        description: 'พัฒนา API และระบบฐานข้อมูลสำหรับการเชื่อมต่อข้อมูลต่างๆ',
        project: 'tech',
        assignedTo: 'tech_staff',
        startDate: '2026-06-01',
        deadline: '2026-06-15',
        cost: 400000,
        status: 'inprogress',
        priority: 'high'
    },
    {
        id: 'task-2',
        title: 'ออกแบบฐานข้อมูลประสิทธิภาพสูง (Database Design)',
        description: 'ออกแบบโครงสร้างตารางข้อมูลและจัดทำดัชนีเพื่อเพิ่มความเร็วในการสืบค้น',
        project: 'tech',
        assignedTo: 'tech_staff',
        startDate: '2026-05-15',
        deadline: '2026-06-05',
        cost: 150000,
        status: 'completed',
        priority: 'medium'
    },
    {
        id: 'task-3',
        title: 'ทดสอบและปรับปรุงความปลอดภัย (Security Audit)',
        description: 'สแกนหาช่องโหว่ของระบบและปรับปรุงนโยบายการเข้ารหัสข้อมูลสำคัญ',
        project: 'tech',
        assignedTo: 'tech_staff',
        startDate: '2026-06-10',
        deadline: '2026-06-30',
        cost: 100000,
        status: 'todo',
        priority: 'high'
    },
    {
        id: 'task-4',
        title: 'ติดตั้งเซิร์ฟเวอร์และระบบเครือข่าย (Server Installation)',
        description: 'จัดเตรียมคลาวด์เซิร์ฟเวอร์และติดตั้ง SSL Certificates สำหรับโปรแกรมใช้งานจริง',
        project: 'it',
        assignedTo: 'it_staff',
        startDate: '2026-05-20',
        deadline: '2026-06-01',
        cost: 60000,
        status: 'completed',
        priority: 'medium'
    },
    {
        id: 'task-5',
        title: 'พัฒนาระบบความปลอดภัยข้อมูล (Data Privacy Compliance)',
        description: 'ปรับปรุงแบบฟอร์มการยินยอมใช้งานข้อมูลให้ตรงตามกฎหมาย PDPA',
        project: 'it',
        assignedTo: 'it_staff',
        startDate: '2026-06-03',
        deadline: '2026-06-10',
        cost: 40000,
        status: 'inreview',
        priority: 'high'
    },
    {
        id: 'task-6',
        title: 'ผลิตสื่อประชาสัมพันธ์ภาพลักษณ์องค์กร (PR Media Production)',
        description: 'ออกแบบแบนเนอร์และเขียนบทความลงเว็บโซเชียลมีเดียของหน่วยงาน',
        project: 'comm',
        assignedTo: 'comm_staff',
        startDate: '2026-06-02',
        deadline: '2026-06-09',
        cost: 50000,
        status: 'inprogress',
        priority: 'medium'
    },
    {
        id: 'task-7',
        title: 'จัดงานเปิดตัวบริการใหม่ (Launch Event)',
        description: 'ดำเนินการประสานงานสถานที่จัดเลี้ยงและจ้างวิทยากรบรรยายงานเปิดตัว',
        project: 'comm',
        assignedTo: 'comm_staff',
        startDate: '2026-05-10',
        deadline: '2026-05-25',
        cost: 35000,
        status: 'completed',
        priority: 'high'
    },
    {
        id: 'task-8',
        title: 'แคมเปญโฆษณาออนไลน์ (Online Ad Campaign)',
        description: 'ยิงโฆษณาทาง Facebook และ Google Search เพื่อให้เข้าถึงกลุ่มเป้าหมาย',
        project: 'comm',
        assignedTo: 'comm_staff',
        startDate: '2026-06-12',
        deadline: '2026-06-25',
        cost: 15000,
        status: 'todo',
        priority: 'low'
    }
];

// Initialize DB from LocalStorage
function initDatabase() {
    if (!localStorage.getItem('budget_tracker_db_seeded')) {
        localStorage.setItem('budget_tracker_limit', JSON.stringify(state.budgetLimit));
        localStorage.setItem('budget_tracker_projects', JSON.stringify(defaultProjects));
        localStorage.setItem('budget_tracker_users', JSON.stringify(defaultUsers));
        localStorage.setItem('budget_tracker_tasks', JSON.stringify(defaultTasks));
        localStorage.setItem('budget_tracker_db_seeded', 'true');
    }

    state.budgetLimit = JSON.parse(localStorage.getItem('budget_tracker_limit'));
    state.projects = JSON.parse(localStorage.getItem('budget_tracker_projects'));
    state.users = JSON.parse(localStorage.getItem('budget_tracker_users'));
    state.tasks = JSON.parse(localStorage.getItem('budget_tracker_tasks'));

    // Set Default User (Manager)
    state.currentUser = state.users.find(u => u.username === 'manager') || state.users[0];
}

// Save data back to localStorage
function saveStateToStorage() {
    localStorage.setItem('budget_tracker_projects', JSON.stringify(state.projects));
    localStorage.setItem('budget_tracker_tasks', JSON.stringify(state.tasks));
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    setupEventListeners();
    populateUserSwitcher();
    switchTheme(localStorage.getItem('app-theme') || 'dark'); // Default theme
    
    // Set initial UI context based on default user
    updateUIForUserRole();
    renderView();
});

// Setup DOM Event Listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            switchView(view);
        });
    });

    // Mobile Sidebar Toggle
    document.getElementById('mobileSidebarToggle').addEventListener('click', () => {
        document.getElementById('appSidebar').classList.toggle('active');
    });

    // User Switcher
    document.getElementById('userSwitcher').addEventListener('change', (e) => {
        const selectedUser = state.users.find(u => u.username === e.target.value);
        if (selectedUser) {
            state.currentUser = selectedUser;
            showToast(`สลับการแสดงผลเป็น: ${selectedUser.name}`, 'success');
            updateUIForUserRole();
            
            // If staff member, force switch to Kanban board view since they don't have dashboard access
            if (selectedUser.role === 'staff') {
                switchView('kanban');
            } else {
                switchView('dashboard');
            }
        }
    });

    // Theme Toggle
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        switchTheme(isDark ? 'light' : 'dark');
    });

    // Reset DB Button
    document.getElementById('resetDbBtn').addEventListener('click', () => {
        if (confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้นในโค้ด (รวมถึงรายชื่อผู้ใช้ที่แก้ไขหรือเพิ่มใหม่ในโค้ด) ใช่หรือไม่?\n\n*คำเตือน: ข้อมูลงานและโครงการที่สร้างบนหน้าเว็บจะถูกล้างออกและแทนที่ด้วยค่าเริ่มต้นในโค้ด')) {
            localStorage.removeItem('budget_tracker_db_seeded');
            localStorage.removeItem('budget_tracker_limit');
            localStorage.removeItem('budget_tracker_projects');
            localStorage.removeItem('budget_tracker_users');
            localStorage.removeItem('budget_tracker_tasks');
            location.reload();
        }
    });

    // Close Modals
    document.getElementById('closeTaskModalBtn').addEventListener('click', () => closeModal('taskModal'));
    document.getElementById('cancelTaskModalBtn').addEventListener('click', () => closeModal('taskModal'));
    document.getElementById('closeProjectModalBtn').addEventListener('click', () => closeModal('projectModal'));
    document.getElementById('cancelProjectModalBtn').addEventListener('click', () => closeModal('projectModal'));

    // Form Submissions
    document.getElementById('taskForm').addEventListener('submit', handleTaskFormSubmit);
    document.getElementById('projectForm').addEventListener('submit', handleProjectFormSubmit);

    // Modal Add Task Buttons
    document.getElementById('kanbanAddTaskBtn').addEventListener('click', () => openTaskModal());
    document.getElementById('allTasksAddNewBtn').addEventListener('click', () => openTaskModal());
    document.querySelectorAll('.col-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const status = btn.getAttribute('data-status');
            openTaskModal(null, status);
        });
    });

    // Modal Add Project Buttons
    document.getElementById('manageAddProjectBtn').addEventListener('click', () => openProjectModal());
    document.getElementById('dashboardAddProjectBtn').addEventListener('click', () => openProjectModal());

    // Kanban Filter Events
    document.getElementById('kanbanSearchInput').addEventListener('input', renderKanbanView);
    document.getElementById('kanbanProjectFilter').addEventListener('change', renderKanbanView);
    document.getElementById('kanbanPriorityFilter').addEventListener('change', renderKanbanView);

    // All Tasks Table Filter Events
    document.getElementById('tableSearchInput').addEventListener('input', renderAllTasksView);
    document.getElementById('tableProjectFilter').addEventListener('change', renderAllTasksView);
    document.getElementById('tableUserFilter').addEventListener('change', renderAllTasksView);
    document.getElementById('tableStatusFilter').addEventListener('change', renderAllTasksView);

    // Project Cost Validation on input
    document.getElementById('taskCost').addEventListener('input', validateTaskCostLimit);
    document.getElementById('taskProject').addEventListener('change', validateTaskCostLimit);
    
    // Project budget quota check on input
    document.getElementById('projectBudget').addEventListener('input', validateProjectBudgetQuota);
}

// User Switcher population
function populateUserSwitcher() {
    const switcher = document.getElementById('userSwitcher');
    switcher.innerHTML = state.users.map(u => 
        `<option value="${u.username}" ${state.currentUser && state.currentUser.username === u.username ? 'selected' : ''}>
            ${u.name} (${u.role === 'manager' ? 'หัวหน้างาน' : 'ทีมงาน'})
         </option>`
    ).join('');
}

// Update App View & active sidebar classes
function switchView(viewName) {
    state.currentView = viewName;
    
    // Close mobile menu if active
    document.getElementById('appSidebar').classList.remove('active');

    // Update active state in sidebar links
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        if (link.getAttribute('data-view') === viewName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Hide all views and show target view
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view${capitalize(viewName)}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Update main header title and description
    updateHeaderTitle(viewName);

    // Render contents of the view
    renderView();
}

// Capitalize helper (e.g. all-tasks -> AllTasks)
function capitalize(str) {
    return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

// Update Header Text based on current view
function updateHeaderTitle(viewName) {
    const titleEl = document.getElementById('mainViewTitle');
    const subtitleEl = document.getElementById('mainViewSubtitle');
    
    if (viewName === 'dashboard') {
        titleEl.textContent = 'แดชบอร์ดสรุปงานภาพรวม';
        subtitleEl.textContent = 'ดูสถานะโครงการ งบประมาณคงเหลือ และความคืบหน้าของงานทั้งหมด';
    } else if (viewName === 'projects') {
        titleEl.textContent = 'ระบบบริหารจัดการโครงการประจำปี';
        subtitleEl.textContent = 'จัดการโครงการย่อย จัดสรรวงเงินงบประมาณ และวิเคราะห์ความคืบหน้า';
    } else if (viewName === 'kanban') {
        if (state.currentUser.role === 'manager') {
            titleEl.textContent = 'บอร์ดติดตามงานของสมาชิกทุกคน';
            subtitleEl.textContent = 'ภาพรวมงานในระบบของสมาชิกทุกคน แยกตามคอลัมน์สถานะ (หัวหน้างาน)';
        } else {
            const proj = state.projects.find(p => p.id === state.currentUser.project);
            titleEl.textContent = `บอร์ดคันบังงาน: ${proj ? proj.name : ''}`;
            subtitleEl.textContent = `จัดการงานของคุณ ค้นหา และปรับปรุงสถานะการดำเนินงานของตัวคุณเอง`;
        }
    } else if (viewName === 'all-tasks') {
        titleEl.textContent = 'ตารางรายการงานทั้งหมดของทีม';
        subtitleEl.textContent = 'ตรวจสอบประวัติงาน ยอดงบประมาณย่อย และวันครบกำหนดส่งของทุกคนในทีม';
    }
}

// Set up UI depending on currentUser role (Manager vs Staff)
function updateUIForUserRole() {
    const isManager = state.currentUser.role === 'manager';
    
    // Show/Hide manager-only elements
    document.querySelectorAll('.manager-only').forEach(el => {
        if (isManager) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    // Update avatar and profile info in sidebar
    const avatar = document.getElementById('sidebarUserAvatar');
    const name = document.getElementById('sidebarUserName');
    const role = document.getElementById('sidebarUserRole');

    avatar.textContent = state.currentUser.avatarText;
    name.textContent = state.currentUser.name;
    role.textContent = state.currentUser.role === 'manager' 
        ? 'หัวหน้างาน (Manager)' 
        : `ทีมงาน: ${state.projects.find(p => p.id === state.currentUser.project)?.name || 'ทั่วไป'}`;

    // Update Kanban sidebar link text
    const kanbanLinkText = document.getElementById('kanbanNavLinkText');
    kanbanLinkText.textContent = isManager ? 'บอร์ดคันบังของทีม' : 'บอร์ดคันบังของฉัน';
}

// Render dynamic contents of the active view
function renderView() {
    if (state.currentView === 'dashboard') {
        renderDashboardView();
    } else if (state.currentView === 'projects') {
        renderProjectsView();
    } else if (state.currentView === 'kanban') {
        renderKanbanView();
    } else if (state.currentView === 'all-tasks') {
        renderAllTasksView();
    }
}

// Switch between Dark and Light Theme
function switchTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('app-theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('app-theme', 'light');
    }
    
    // Redraw charts if in dashboard view since colors change
    if (state.currentView === 'dashboard') {
        renderCharts();
    }
}

// Format number to Thai currency format ฿X,XXX,XXX
function formatCurrency(amount) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
}

// Capitalize first letter helper
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ==========================================
// VIEW RENDERING LOGIC
// ==========================================

// 1. Manager Dashboard View
function renderDashboardView() {
    // 1.1 Calculate Financial Status
    const totalAllocated = state.projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = state.tasks.reduce((sum, t) => sum + t.cost, 0);
    const remainingBudget = totalAllocated - totalSpent;

    // Update KPI UI
    document.getElementById('kpiTotalBudget').textContent = formatCurrency(state.budgetLimit);
    document.getElementById('kpiAllocatedBudget').textContent = formatCurrency(totalAllocated);
    document.getElementById('kpiSpentBudget').textContent = formatCurrency(totalSpent);
    document.getElementById('kpiRemainingBudget').textContent = formatCurrency(remainingBudget);

    // Percentage displays
    document.getElementById('kpiAllocatedPercent').textContent = `งบประมาณรวมของทุกโครงการย่อย`;

    const spentPercent = totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(1) : 0;
    document.getElementById('kpiSpentPercent').textContent = `${spentPercent}% ของงบประมาณจัดสรร`;

    const remainingPercent = totalAllocated > 0 ? ((remainingBudget / totalAllocated) * 100).toFixed(1) : 0;
    const remTrend = document.getElementById('kpiRemainingPercent');
    remTrend.textContent = `${remainingPercent}% ของงบประมาณจัดสรร`;
    if (remainingBudget < 0) {
        remTrend.className = 'kpi-trend text-danger';
        remTrend.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> งบประมาณใช้เกินวงเงินจัดสรร!`;
    } else {
        remTrend.className = 'kpi-trend text-green';
    }

    // 1.2 Render Projects List in Dashboard
    const projListContainer = document.getElementById('dashboardProjectList');
    projListContainer.innerHTML = '';

    if (state.projects.length === 0) {
        projListContainer.innerHTML = '<div class="text-muted text-center p-4">ไม่มีโครงการในระบบ</div>';
    } else {
        state.projects.forEach(project => {
            const projTasks = state.tasks.filter(t => t.project === project.id);
            const projSpent = projTasks.reduce((sum, t) => sum + t.cost, 0);
            const budgetPercent = project.budget > 0 ? (projSpent / project.budget) * 100 : 0;
            
            const completedTasks = projTasks.filter(t => t.status === 'completed').length;
            const totalTasks = projTasks.length;
            const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            // Find lead person name
            const leadUser = state.users.find(u => u.username === project.lead);
            const leadName = leadUser ? leadUser.name : 'ไม่มี';

            const projItem = document.createElement('div');
            projItem.className = 'project-item';
            projItem.innerHTML = `
                <div class="project-item-header">
                    <div class="project-meta-name">
                        <div class="project-avatar-icon">${project.name.substring(0, 2)}</div>
                        <div>
                            <span class="project-title">${project.name}</span>
                            <div style="font-size:11px; color:var(--text-muted)">ผู้รับผิดชอบหลัก: ${leadName}</div>
                        </div>
                    </div>
                    <div class="project-budget-meta">
                        <span>${formatCurrency(projSpent)}</span>
                        <span class="project-budget-total"> / ${formatCurrency(project.budget)}</span>
                    </div>
                </div>

                <div class="progress-bar-group">
                    <div class="progress-label-row">
                        <span>การใช้งบประมาณ</span>
                        <span class="${budgetPercent > 100 ? 'text-danger font-bold' : ''}">${budgetPercent.toFixed(1)}%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill ${budgetPercent > 100 ? 'fill-orange' : budgetPercent > 80 ? 'fill-orange' : 'fill-primary'}" 
                             style="width: ${Math.min(budgetPercent, 100)}%"></div>
                    </div>
                </div>

                <div class="progress-bar-group" style="margin-bottom:0">
                    <div class="progress-label-row">
                        <span>ความคืบหน้าของงาน (${completedTasks}/${totalTasks} งาน)</span>
                        <span>${progressPercent.toFixed(1)}%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill fill-green" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            `;
            projListContainer.appendChild(projItem);
        });
    }

    // 1.3 Render Urgent/Overdue Tasks
    const urgentTasksContainer = document.getElementById('urgentTasksList');
    urgentTasksContainer.innerHTML = '';

    const today = new Date();
    today.setHours(0,0,0,0);

    const urgentTasks = state.tasks.filter(task => {
        if (task.status === 'completed') return false;
        const dl = new Date(task.deadline);
        const diffDays = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 2; // Near deadline (<= 2 days) or overdue (< 0)
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    if (urgentTasks.length === 0) {
        urgentTasksContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px; color:var(--text-muted);">
                <i class="fa-solid fa-circle-check" style="font-size:32px; color:var(--color-success); margin-bottom:12px;"></i>
                <span>ไม่มีงานค้างที่ใกล้ถึงกำหนดในขณะนี้</span>
            </div>
        `;
    } else {
        urgentTasks.forEach(task => {
            const dl = new Date(task.deadline);
            const diffDays = Math.ceil((dl - today) / (1000 * 60 * 60 * 24));
            
            let badgeText = '';
            let badgeClass = '';
            if (diffDays < 0) {
                badgeText = `เลยกำหนด ${Math.abs(diffDays)} วัน`;
                badgeClass = 'overdue';
            } else if (diffDays === 0) {
                badgeText = 'กำหนดส่งวันนี้';
                badgeClass = 'near';
            } else {
                badgeText = `เหลืออีก ${diffDays} วัน`;
                badgeClass = 'near';
            }

            const assignee = state.users.find(u => u.username === task.assignedTo);
            const project = state.projects.find(p => p.id === task.project);

            const item = document.createElement('div');
            item.className = 'urgent-task-item';
            item.innerHTML = `
                <div class="urgent-task-left">
                    <span class="urgent-task-title" title="${task.title}">${task.title}</span>
                    <div class="urgent-task-meta">
                        <span><i class="fa-solid fa-folder"></i> ${project ? project.name : 'ทั่วไป'}</span>
                        <span><i class="fa-solid fa-user"></i> ${assignee ? assignee.name : 'ไม่ระบุ'}</span>
                    </div>
                </div>
                <div class="urgent-task-right">
                    <span class="urgent-days-pill ${badgeClass}">
                        <i class="fa-solid fa-circle-exclamation"></i> ${badgeText}
                    </span>
                    <span style="font-size:11px; font-weight:700; color:var(--text-main);">${formatCurrency(task.cost)}</span>
                </div>
            `;
            urgentTasksContainer.appendChild(item);
        });
    }

    // 1.4 Render Charts
    renderCharts();
}

// Render dynamic charts using Chart.js
function renderCharts() {
    const isDark = document.body.classList.contains('dark-theme');
    const textThemeColor = isDark ? '#9ca3af' : '#4b5563';
    const gridThemeColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

    // --- Chart 1: Budget Share (Spent vs Remaining) ---
    const ctxBudget = document.getElementById('budgetShareChart').getContext('2d');
    if (budgetChartInstance) {
        budgetChartInstance.destroy();
    }

    const projectLabels = state.projects.map(p => p.name);
    const spentData = state.projects.map(p => {
        return state.tasks.filter(t => t.project === p.id).reduce((sum, t) => sum + t.cost, 0);
    });
    const remainingData = state.projects.map(p => {
        const spent = state.tasks.filter(t => t.project === p.id).reduce((sum, t) => sum + t.cost, 0);
        return Math.max(0, p.budget - spent);
    });

    budgetChartInstance = new Chart(ctxBudget, {
        type: 'bar',
        data: {
            labels: projectLabels,
            datasets: [
                {
                    label: 'งบประมาณที่ใช้ (บาท)',
                    data: spentData,
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.75)' : 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                },
                {
                    label: 'งบประมาณคงเหลือ (บาท)',
                    data: remainingData,
                    backgroundColor: isDark ? 'rgba(16, 185, 129, 0.75)' : 'rgba(5, 150, 105, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor, font: { family: 'Kanit' } }
                },
                y: {
                    stacked: true,
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor, font: { family: 'Kanit' } }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textThemeColor, font: { family: 'Kanit', size: 11 } }
                }
            }
        }
    });

    // --- Chart 2: Workload distribution by User ---
    const ctxWorkload = document.getElementById('workloadChart').getContext('2d');
    if (workloadChartInstance) {
        workloadChartInstance.destroy();
    }

    const staffUsers = state.users.filter(u => u.role === 'staff');
    const userLabels = staffUsers.map(u => u.name);

    // Get task counts per status for each user
    const todoCounts = staffUsers.map(u => state.tasks.filter(t => t.assignedTo === u.username && t.status === 'todo').length);
    const inProgressCounts = staffUsers.map(u => state.tasks.filter(t => t.assignedTo === u.username && t.status === 'inprogress').length);
    const inReviewCounts = staffUsers.map(u => state.tasks.filter(t => t.assignedTo === u.username && t.status === 'inreview').length);
    const completedCounts = staffUsers.map(u => state.tasks.filter(t => t.assignedTo === u.username && t.status === 'completed').length);

    workloadChartInstance = new Chart(ctxWorkload, {
        type: 'bar',
        data: {
            labels: userLabels,
            datasets: [
                {
                    label: 'ที่จะทำ',
                    data: todoCounts,
                    backgroundColor: 'rgba(156, 163, 175, 0.65)'
                },
                {
                    label: 'กำลังดำเนินงาน',
                    data: inProgressCounts,
                    backgroundColor: 'rgba(59, 130, 246, 0.75)'
                },
                {
                    label: 'รอตรวจทาน',
                    data: inReviewCounts,
                    backgroundColor: 'rgba(245, 158, 11, 0.75)'
                },
                {
                    label: 'เสร็จสมบูรณ์',
                    data: completedCounts,
                    backgroundColor: 'rgba(16, 185, 129, 0.75)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor, font: { family: 'Kanit' } }
                },
                y: {
                    stacked: true,
                    grid: { color: gridThemeColor },
                    ticks: { color: textThemeColor, font: { family: 'Kanit' }, stepSize: 1 }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: textThemeColor, font: { family: 'Kanit', size: 11 } }
                }
            }
        }
    });
}

// 2. Manager Projects View
function renderProjectsView() {
    const tableBody = document.getElementById('projectsTableBody');
    tableBody.innerHTML = '';

    if (state.projects.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">ไม่มีโครงการย่อยในระบบ</td></tr>';
        return;
    }

    state.projects.forEach(project => {
        const projTasks = state.tasks.filter(t => t.project === project.id);
        const spent = projTasks.reduce((sum, t) => sum + t.cost, 0);
        const remaining = project.budget - spent;

        // Progress bar task success
        const completedCount = projTasks.filter(t => t.status === 'completed').length;
        const totalCount = projTasks.length;
        const successPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        // Find project lead
        const leadUser = state.users.find(u => u.username === project.lead);
        const leadName = leadUser ? leadUser.name : 'ไม่มี';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 700; color:var(--text-main)">${project.name}</div>
                <div style="font-size: 11px; color:var(--text-muted)">ID: ${project.id}</div>
            </td>
            <td>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="avatar" style="width:28px; height:28px; font-size:11px; background:linear-gradient(135deg, var(--color-primary), var(--color-info))">${leadUser ? leadUser.avatarText : '??'}</div>
                    <span>${leadName}</span>
                </div>
            </td>
            <td class="text-right font-bold" style="color:var(--text-main)">${formatCurrency(project.budget)}</td>
            <td class="text-right text-orange">${formatCurrency(spent)}</td>
            <td class="text-right font-bold ${remaining < 0 ? 'text-danger' : 'text-green'}">${formatCurrency(remaining)}</td>
            <td>
                <div style="display:flex; flex-direction:column; gap:4px; width: 140px;">
                    <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted)">
                        <span>เสร็จสิ้น ${completedCount}/${totalCount} งาน</span>
                        <span>${successPercent}%</span>
                    </div>
                    <div class="progress-track" style="height:6px;">
                        <div class="progress-fill fill-green" style="width: ${successPercent}%"></div>
                    </div>
                </div>
            </td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn-action edit" onclick="openProjectModal('${project.id}')" title="แก้ไขโครงการ">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action delete" onclick="handleDeleteProject('${project.id}')" title="ลบโครงการ">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 3. Member & Manager Kanban View
function renderKanbanView() {
    const isManager = state.currentUser.role === 'manager';

    // 3.1 Populate filters in Kanban Controls
    const projectFilter = document.getElementById('kanbanProjectFilter');
    const prevProjValue = projectFilter.value;
    projectFilter.innerHTML = '<option value="all">ทุกโครงการ/ฝ่าย</option>';
    
    // Staff user can only view their own project
    if (!isManager) {
        projectFilter.disabled = true;
        const myProj = state.projects.find(p => p.id === state.currentUser.project);
        if (myProj) {
            projectFilter.innerHTML = `<option value="${myProj.id}">${myProj.name}</option>`;
        }
    } else {
        projectFilter.disabled = false;
        state.projects.forEach(p => {
            projectFilter.innerHTML += `<option value="${p.id}" ${prevProjValue === p.id ? 'selected' : ''}>${p.name}</option>`;
        });
    }

    // 3.2 Filter Tasks
    const searchQuery = document.getElementById('kanbanSearchInput').value.toLowerCase();
    const filterProj = projectFilter.value;
    const filterPriority = document.getElementById('kanbanPriorityFilter').value;

    let filteredTasks = state.tasks;

    // Filter by User's project authority (if not manager)
    if (!isManager) {
        filteredTasks = filteredTasks.filter(t => t.project === state.currentUser.project);
    } else if (filterProj !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.project === filterProj);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === filterPriority);
    }

    // Filter by search text
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(t => 
            t.title.toLowerCase().includes(searchQuery) || 
            t.description.toLowerCase().includes(searchQuery)
        );
    }

    // 3.3 Clear Kanban Columns
    const cols = ['todo', 'inprogress', 'inreview', 'completed'];
    cols.forEach(status => {
        const area = document.getElementById(`cards${capitalizeFirst(status)}`);
        area.innerHTML = '';
        document.getElementById(`count${capitalizeFirst(status)}`).textContent = '0';
    });

    // 3.4 Populate cards
    const counts = { todo: 0, inprogress: 0, inreview: 0, completed: 0 };
    const today = new Date();
    today.setHours(0,0,0,0);

    filteredTasks.forEach(task => {
        counts[task.status]++;
        
        const area = document.getElementById(`cards${capitalizeFirst(task.status)}`);
        const assignee = state.users.find(u => u.username === task.assignedTo);
        const project = state.projects.find(p => p.id === task.project);

        // Calculate deadline notifications
        let dlClass = 'normal';
        let dlIcon = '<i class="fa-regular fa-calendar"></i>';
        const dlDate = new Date(task.deadline);
        const diffDays = Math.ceil((dlDate - today) / (1000 * 60 * 60 * 24));

        if (task.status !== 'completed') {
            if (diffDays < 0) {
                dlClass = 'overdue';
                dlIcon = '<i class="fa-solid fa-circle-exclamation text-danger"></i> เลยกำหนด';
            } else if (diffDays <= 2) {
                dlClass = 'near';
                dlIcon = `<i class="fa-solid fa-circle-exclamation text-warning"></i> อีก ${diffDays} วัน`;
            }
        }

        const card = document.createElement('div');
        card.className = `task-card`;
        card.id = task.id;
        card.draggable = true;
        card.setAttribute('ondragstart', 'dragTask(event)');
        
        card.innerHTML = `
            <div class="card-hover-actions">
                <button class="btn-card-action edit" onclick="openTaskModal('${task.id}')" title="แก้ไขงาน">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-card-action delete" onclick="handleDeleteTask('${task.id}')" title="ลบงาน">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="task-card-header">
                <span class="project-pill pill-${task.project}">${project ? project.name : 'ทั่วไป'}</span>
                <span class="priority-badge ${task.priority}" title="ระดับความสำคัญ: ${task.priority}"></span>
            </div>
            <div class="task-card-body">
                <div class="task-card-title">${task.title}</div>
                ${task.description ? `<div class="task-card-desc">${task.description}</div>` : ''}
            </div>
            <div class="task-card-footer">
                <div class="task-budget-info" title="งบประมาณในงาน">
                    <i class="fa-solid fa-coins"></i>
                    <span>${formatCurrency(task.cost)}</span>
                </div>
                <div class="task-deadline-pill ${dlClass}">
                    ${dlIcon}
                    <span style="font-size:10px">${formatDate(task.deadline)}</span>
                </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 8px; font-size:11px; color:var(--text-muted); align-items:center; gap:6px;">
                <div class="avatar" style="width:20px; height:20px; font-size:9px; background:linear-gradient(135deg, var(--color-accent), #ec4899)">${assignee ? assignee.avatarText : '??'}</div>
                <span style="font-size:10px">${assignee ? assignee.name : 'ไม่มี'}</span>
            </div>
        `;
        area.appendChild(card);
    });

    // Update column count headers
    cols.forEach(status => {
        document.getElementById(`count${capitalizeFirst(status)}`).textContent = counts[status];
    });
}

// 4. Manager Consolidated Tasks Table View
function renderAllTasksView() {
    const isManager = state.currentUser.role === 'manager';
    if (!isManager) return; // Prevent render if staff bypasses link

    const tableBody = document.getElementById('allTasksTableBody');
    tableBody.innerHTML = '';

    // Populate filter selectors once
    const projFilter = document.getElementById('tableProjectFilter');
    const userFilter = document.getElementById('tableUserFilter');

    if (projFilter.options.length <= 1) {
        state.projects.forEach(p => {
            projFilter.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });
        state.users.forEach(u => {
            if (u.role === 'staff') {
                userFilter.innerHTML += `<option value="${u.username}">${u.name}</option>`;
            }
        });
    }

    // Apply Filter values
    const query = document.getElementById('tableSearchInput').value.toLowerCase();
    const filterProj = projFilter.value;
    const filterUser = userFilter.value;
    const filterStatus = document.getElementById('tableStatusFilter').value;

    let filtered = state.tasks;

    if (filterProj !== 'all') filtered = filtered.filter(t => t.project === filterProj);
    if (filterUser !== 'all') filtered = filtered.filter(t => t.assignedTo === filterUser);
    if (filterStatus !== 'all') filtered = filtered.filter(t => t.status === filterStatus);
    
    if (query) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(query) || 
            (t.description && t.description.toLowerCase().includes(query))
        );
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">ไม่พบประวัติรายการงานตามตัวกรองที่กำหนด</td></tr>';
        return;
    }

    filtered.forEach(task => {
        const project = state.projects.find(p => p.id === task.project);
        const assignee = state.users.find(u => u.username === task.assignedTo);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight: 600; color:var(--text-main)">${task.title}</div>
                <div style="font-size:11px; color:var(--text-muted)">ID: ${task.id}</div>
            </td>
            <td><span class="project-pill pill-${task.project}">${project ? project.name : 'ทั่วไป'}</span></td>
            <td>
                <div style="display:flex; align-items:center; gap:6px;">
                    <div class="avatar" style="width:24px; height:24px; font-size:10px; background:linear-gradient(135deg, var(--color-accent), #ec4899)">${assignee ? assignee.avatarText : '??'}</div>
                    <span>${assignee ? assignee.name : 'ไม่มี'}</span>
                </div>
            </td>
            <td class="text-right font-bold" style="color:var(--text-main)">${formatCurrency(task.cost)}</td>
            <td><span style="font-size:13px">${formatDate(task.deadline)}</span></td>
            <td><span class="badge-priority ${task.priority}">${task.priority.toUpperCase()}</span></td>
            <td><span class="badge-status ${task.status}">${statusToThai(task.status)}</span></td>
            <td>
                <div style="display:flex; gap:6px;">
                    <button class="btn-action edit" onclick="openTaskModal('${task.id}')" title="แก้ไขงาน">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action delete" onclick="handleDeleteTask('${task.id}')" title="ลบงาน">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Convert status id to Thai word
function statusToThai(status) {
    switch(status) {
        case 'todo': return 'ที่จะทำ';
        case 'inprogress': return 'กำลังทำ';
        case 'inreview': return 'รอตรวจทาน';
        case 'completed': return 'เสร็จสมบูรณ์';
        default: return status;
    }
}

// Format Date string YYYY-MM-DD to readable Thai date
function formatDate(dateString) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: '2-digit' });
}

// ==========================================
// KANBAN DRAG AND DROP HANDLERS
// ==========================================

function dragTask(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.target.classList.add('dragging');
}

function allowDrop(ev) {
    ev.preventDefault();
    const col = ev.target.closest('.column-cards-area');
    if (col) {
        col.classList.add('dragover');
    }
}

// Clear visual drop indication
document.querySelectorAll('.column-cards-area').forEach(area => {
    area.addEventListener('dragleave', (e) => {
        area.classList.remove('dragover');
    });
});

function dropTask(ev) {
    ev.preventDefault();
    const area = ev.target.closest('.column-cards-area');
    if (!area) return;
    
    area.classList.remove('dragover');
    
    const taskId = ev.dataTransfer.getData("text/plain");
    const card = document.getElementById(taskId);
    if (!card) return;
    
    card.classList.remove('dragging');

    // Get column status
    const newStatus = area.parentElement.getAttribute('data-status');
    
    // Find task and update
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const task = state.tasks[taskIndex];
        
        // Safety check: Staff can only drag their own tasks
        if (state.currentUser.role === 'staff' && task.project !== state.currentUser.project) {
            showToast('คุณไม่มีสิทธิ์จัดการงานของฝ่ายอื่น', 'error');
            return;
        }

        if (task.status !== newStatus) {
            task.status = newStatus;
            saveStateToStorage();
            
            // Visual move
            area.appendChild(card);
            
            // Re-render to update counts and headers
            renderKanbanView();
            showToast(`อัปเดตสถานะงานเป็น: ${statusToThai(newStatus)}`, 'success');
        }
    }
}

// Global hook for vanilla drag handlers
window.allowDrop = allowDrop;
window.dropTask = dropTask;
window.dragTask = dragTask;

// ==========================================
// MODALS MANAGEMENT
// ==========================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Open and seed task modal form
function openTaskModal(taskId = null, defaultStatus = 'todo') {
    const isManager = state.currentUser.role === 'manager';
    const form = document.getElementById('taskForm');
    form.reset();

    // Setup project and assignee select fields
    const projectSelect = document.getElementById('taskProject');
    projectSelect.innerHTML = '';
    
    const assigneeSelect = document.getElementById('taskAssignee');
    assigneeSelect.innerHTML = '<option value="">-- เลือกผู้รับผิดชอบ --</option>';

    // Load available projects
    if (!isManager) {
        // Staff can only assign tasks to their own project
        const myProj = state.projects.find(p => p.id === state.currentUser.project);
        if (myProj) {
            projectSelect.innerHTML = `<option value="${myProj.id}">${myProj.name}</option>`;
        }
        document.getElementById('assigneeFormGroup').classList.add('hidden');
    } else {
        document.getElementById('assigneeFormGroup').classList.remove('hidden');
        state.projects.forEach(p => {
            projectSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });
        state.users.forEach(u => {
            if (u.role === 'staff') {
                assigneeSelect.innerHTML += `<option value="${u.username}">${u.name}</option>`;
            }
        });
    }

    if (taskId) {
        // Edit Mode
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Verify write access
        if (!isManager && task.project !== state.currentUser.project) {
            showToast('คุณไม่มีสิทธิ์แก้ไขงานของฝ่ายอื่น', 'error');
            return;
        }

        document.getElementById('taskModalTitle').textContent = 'แก้ไขรายละเอียดงาน';
        document.getElementById('taskIdField').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskProject').value = task.project;
        document.getElementById('taskCost').value = task.cost;
        document.getElementById('taskStartDate').value = task.startDate;
        document.getElementById('taskDeadline').value = task.deadline;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        if (isManager) {
            document.getElementById('taskAssignee').value = task.assignedTo || '';
        }
    } else {
        // Add Mode
        document.getElementById('taskModalTitle').textContent = 'สร้างงานใหม่';
        document.getElementById('taskIdField').value = '';
        document.getElementById('taskStatus').value = defaultStatus;
        
        // Date defaults
        const todayStr = new Date().toISOString().substring(0, 10);
        document.getElementById('taskStartDate').value = todayStr;
        document.getElementById('taskDeadline').value = todayStr;
    }

    // Trigger budget checking on open
    validateTaskCostLimit();
    openModal('taskModal');
}

// Validate task budget against project remaining budget
function validateTaskCostLimit() {
    const isManager = state.currentUser.role === 'manager';
    const taskId = document.getElementById('taskIdField').value;
    const projId = document.getElementById('taskProject').value;
    const costInput = document.getElementById('taskCost');
    const costValue = parseFloat(costInput.value) || 0;
    const warningEl = document.getElementById('projectBudgetWarning');

    if (!projId) return;

    const project = state.projects.find(p => p.id === projId);
    if (!project) return;

    // Calc spent of other tasks in the project
    const otherTasks = state.tasks.filter(t => t.project === projId && t.id !== taskId);
    const otherTasksSpent = otherTasks.reduce((sum, t) => sum + t.cost, 0);
    const projectRemaining = project.budget - otherTasksSpent;

    if (costValue > projectRemaining) {
        warningEl.className = 'input-helper danger';
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> งบที่ระบุเกินงบประมาณโครงการที่เหลืออยู่! (เหลือจัดสรร ฿${projectRemaining.toLocaleString('th-TH')})`;
    } else {
        warningEl.className = 'input-helper text-green';
        warningEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ภายในงบโครงการ (เหลือจัดสรร ฿${(projectRemaining - costValue).toLocaleString('th-TH')})`;
    }
}

// Handle Task Save
function handleTaskFormSubmit(e) {
    e.preventDefault();
    const isManager = state.currentUser.role === 'manager';
    const taskId = document.getElementById('taskIdField').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const project = document.getElementById('taskProject').value;
    const cost = parseFloat(document.getElementById('taskCost').value) || 0;
    const startDate = document.getElementById('taskStartDate').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;

    let assignedTo = '';
    if (isManager) {
        assignedTo = document.getElementById('taskAssignee').value;
    } else {
        assignedTo = state.currentUser.username; // Auto-assign to staff themselves
    }

    if (!assignedTo) {
        // If assignee is not specified, assign to the project lead automatically
        const proj = state.projects.find(p => p.id === project);
        if (proj) {
            assignedTo = proj.lead;
        }
    }

    if (taskId) {
        // Edit Task
        const taskIdx = state.tasks.findIndex(t => t.id === taskId);
        if (taskIdx !== -1) {
            state.tasks[taskIdx] = {
                ...state.tasks[taskIdx],
                title, description, project, cost, startDate, deadline, priority, status, assignedTo
            };
            showToast('ปรับปรุงข้อมูลงานเสร็จสิ้น', 'success');
        }
    } else {
        // New Task
        const newTask = {
            id: 'task-' + Date.now(),
            title, description, project, cost, startDate, deadline, priority, status, assignedTo
        };
        state.tasks.push(newTask);
        showToast('สร้างงานใหม่ในระบบแล้ว', 'success');
    }

    saveStateToStorage();
    closeModal('taskModal');
    renderView();
}

// Delete Task
function handleDeleteTask(taskId) {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบงานนี้ออกระบบอย่างถาวร?')) {
        const taskIdx = state.tasks.findIndex(t => t.id === taskId);
        if (taskIdx !== -1) {
            // Check write access
            if (state.currentUser.role === 'staff' && state.tasks[taskIdx].project !== state.currentUser.project) {
                showToast('คุณไม่มีสิทธิ์ลบงานของฝ่ายอื่น', 'error');
                return;
            }

            state.tasks.splice(taskIdx, 1);
            saveStateToStorage();
            showToast('ลบรายการงานเสร็จสิ้น', 'success');
            renderView();
        }
    }
}

// Bind Global click handlers
window.openTaskModal = openTaskModal;
window.handleDeleteTask = handleDeleteTask;

// --- PROJECT MODALS ---

function openProjectModal(projectId = null) {
    if (state.currentUser.role !== 'manager') {
        showToast('คุณไม่มีสิทธิ์จัดการข้อมูลโครงการย่อย', 'error');
        return;
    }

    const form = document.getElementById('projectForm');
    form.reset();

    const leadSelect = document.getElementById('projectLead');
    leadSelect.innerHTML = '<option value="">-- เลือกผู้รับผิดชอบหลัก --</option>';
    state.users.forEach(u => {
        if (u.role === 'staff') {
            leadSelect.innerHTML += `<option value="${u.username}">${u.name}</option>`;
        }
    });

    if (projectId) {
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;

        document.getElementById('projectModalTitle').textContent = 'แก้ไขข้อมูลโครงการ';
        document.getElementById('projectIdField').value = project.id;
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectBudget').value = project.budget;
        document.getElementById('projectLead').value = project.lead;
    } else {
        document.getElementById('projectModalTitle').textContent = 'เพิ่มโครงการใหม่ประจำปี';
        document.getElementById('projectIdField').value = '';
    }

    validateProjectBudgetQuota();
    openModal('projectModal');
}

// Validate project budget quota against global 1.2M THB budget
function validateProjectBudgetQuota() {
    const projId = document.getElementById('projectIdField').value;
    const budgetInput = document.getElementById('projectBudget');
    const budgetValue = parseFloat(budgetInput.value) || 0;
    const warningEl = document.getElementById('annualBudgetQuotaWarning');

    // Sum other project budgets
    const otherProjects = state.projects.filter(p => p.id !== projId);
    const otherBudgetsSum = otherProjects.reduce((sum, p) => sum + p.budget, 0);
    const quotaRemaining = state.budgetLimit - otherBudgetsSum;

    if (budgetValue > quotaRemaining) {
        warningEl.className = 'input-helper danger';
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> งบโครงการเกินวงเงินงบประมาณประจำปีคงเหลือ! (เหลือสิทธิ์จัดสรรสูงสุด ฿${quotaRemaining.toLocaleString('th-TH')})`;
    } else {
        warningEl.className = 'input-helper text-green';
        warningEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> ภายในงบประจำปีคงเหลือ (เหลือโควตาว่าง ฿${(quotaRemaining - budgetValue).toLocaleString('th-TH')})`;
    }
}

// Handle Project form save
function handleProjectFormSubmit(e) {
    e.preventDefault();
    if (state.currentUser.role !== 'manager') return;

    const projectId = document.getElementById('projectIdField').value;
    const name = document.getElementById('projectName').value;
    const budget = parseFloat(document.getElementById('projectBudget').value) || 0;
    const lead = document.getElementById('projectLead').value;

    if (projectId) {
        // Edit Mode
        const projIdx = state.projects.findIndex(p => p.id === projectId);
        if (projIdx !== -1) {
            state.projects[projIdx] = {
                ...state.projects[projIdx],
                name, budget, lead
            };
            showToast('บันทึกปรับปรุงข้อมูลโครงการแล้ว', 'success');
        }
    } else {
        // New Project
        const newProjId = 'proj-' + Date.now();
        const newProj = {
            id: newProjId,
            name, budget, lead
        };
        state.projects.push(newProj);
        showToast('เพิ่มโครงการย่อยใหม่เข้าระบบสำเร็จ', 'success');
    }

    saveStateToStorage();
    closeModal('projectModal');
    renderView();
}

// Delete Project
function handleDeleteProject(projectId) {
    if (state.currentUser.role !== 'manager') return;

    // Check if tasks exist under this project
    const hasTasks = state.tasks.some(t => t.project === projectId);
    let msg = 'คุณต้องการลบโครงการย่อยนี้ออกระบบใช่หรือไม่?';
    if (hasTasks) {
        msg = 'คำเตือน: มีรายการงานเกิดขึ้นภายใต้โครงการนี้แล้ว การลบโครงการจะลบงานที่เกี่ยวข้องออกทั้งหมด คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?';
    }

    if (confirm(msg)) {
        // Delete tasks under project
        state.tasks = state.tasks.filter(t => t.project !== projectId);
        
        // Delete project
        state.projects = state.projects.filter(p => p.id !== projectId);
        
        saveStateToStorage();
        showToast('ลบโครงการและงานที่เกี่ยวข้องเสร็จสิ้น', 'success');
        renderView();
    }
}

// Bind Global click handlers
window.openProjectModal = openProjectModal;
window.handleDeleteProject = handleDeleteProject;

// ==========================================
// TOAST SYSTEM
// ==========================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<i class="fa-solid fa-circle-info"></i>';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark"></i>';
    if (type === 'warning') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Fade out and remove
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}
