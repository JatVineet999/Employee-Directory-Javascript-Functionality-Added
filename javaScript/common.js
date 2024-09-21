
let isSidebarCollapsed = true;
function applyCollapsedStyles() {
    const elements = document.querySelectorAll('.container, .app-update, .sidebar, .roles-selection-menu, .roles-selected-menu, .role-management-dashboard-heading, .all-dashboard-heading, .roles-selection-menu-icon, .sidebar-handle-icon');
    elements.forEach(element => {
        element.classList.toggle('collapsed', isSidebarCollapsed);
    });
    const logoImage = document.querySelector(".logo");
    const iconImages = document.getElementsByClassName("iconImages");
    const selectedIconImage = document.getElementById("selectedIconImage")
    if (isSidebarCollapsed) {
        logoImage.src = "images/tezo-logo-icon.png";
        for (let i = 0; i < iconImages.length; i++) {
            iconImages[i].style.marginLeft = "18%";
        }
        selectedIconImage.style.marginLeft = "55%";
    }
    else {
        logoImage.src = "images/tezo-logo.svg";
        for (let i = 0; i < iconImages.length; i++) {
            iconImages[i].style.marginLeft = "0%";
        }
        selectedIconImage.style.marginLeft = "0%";

    }

}
function layoutChange() {
    isSidebarCollapsed = !isSidebarCollapsed;
    applyCollapsedStyles();
}

function checkWidth() {
    if (window.innerWidth < 800) {
        layoutChange();
    }
}
// Initial check when the page loads
checkWidth();
// Listen for window resize events
window.addEventListener('resize', checkWidth);
//common global functions to access local storage
function retrieveDataFromLocalStorage() {
    const employees = JSON.parse(localStorage.getItem('employeeDetailsDataArray')) || [];
    return employees;
}
function setDataInLocalStorage(data) {
    localStorage.setItem('employeeDetailsDataArray', JSON.stringify(data));
}
function getDepartmentsAndRolesFromLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem('departmentsAndRoles'));
    if (!storedData) {
        localStorage.setItem('departmentsAndRoles', JSON.stringify(departmentsAndRoles));
        return departmentsAndRoles;
    }

    return storedData;
}

function setDepartmentsAndRolesInLocalStorage(departmentsAndRoles) {
    localStorage.setItem('departmentsAndRoles', JSON.stringify(departmentsAndRoles));
}
//structure for departmentsAndRoles
const departmentsAndRoles = [
    {
        department: 'UI/UX',
        roles: ['UI Designer', 'UX Designer']
    },
    {
        department: 'Software-Development',
        roles: ['Software-Development Engineer', 'Full-stack Developer']
    },
];

//function to dynamically insert roles
function createRoleSelector(department = "UI/UX") {
    const departmentsAndRolesData = getDepartmentsAndRolesFromLocalStorage();
    const roleContainer = document.getElementById('rolesContainer');
    roleContainer.innerHTML = '';
    const selectedDepartmentData = departmentsAndRolesData.find(data => data.department && data.department.includes(department));
    if (selectedDepartmentData && selectedDepartmentData.roles) {
        roleContainer.innerHTML = `
            <label for="role" class="form-input-label" id="roles">Job Title</label><br />
            <select name="role" id="role" class="emp-info-selector">
                ${selectedDepartmentData.roles.map(role => `<option value="${role}">${role}</option>`).join('')}
            </select>
        `;
    }
}




