function addEmployeeProfile(data) {
  const employeesDiv = document.getElementById("employeesAvailable");
  if (employeesDiv) {
    const template = `
        <div class="flex-container">
        <div class="emp-info-container">
           <div class="emp-profile-container">
          <img src="${
            data.img
          }" alt="employee-image" class="employee-img" /></div>
            <span class="employee-name">${
              data.fname.charAt(0).toUpperCase() +
              data.fname.slice(1).toLowerCase()
            } ${
      data.lname.charAt(0).toUpperCase() + data.lname.slice(1).toLowerCase()
    }</span>
        </div>
        <div class="selected-employee">
          <input type="checkbox" name="select" class="select" id="${
            data.empNo
          }" />
        </div>
        </div>
    `;
    employeesDiv.innerHTML += template;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const addRoleForm = document.getElementById("addRoleForm");
  addRoleForm.addEventListener("submit", handleFormSubmission);
  //search-employees-to-assign
  function updateEmployeeAvailable() {
    const searchInput = document.getElementById("assignEmp");
    const employeesAvailable = document.getElementById("employeesAvailable");
    searchInput.addEventListener("input", updateEmployeeAvailable);
    const searchTerm = searchInput.value.toLowerCase();
    const employeeDetailsDataArray = retrieveDataFromLocalStorage();

    employeesAvailable.innerHTML = "";

    employeeDetailsDataArray
      .filter((employeeData) =>
        employeeData.fname.toLowerCase().startsWith(searchTerm)
      )
      .forEach(addEmployeeProfile);
  }
  updateEmployeeAvailable();
});

function handleFormSubmission(event) {
  event.preventDefault();
  const addRoleForm = document.getElementById("addRoleForm");
  const formData = Object.fromEntries(new FormData(addRoleForm));
  console.log(new FormData(addRoleForm));
  const selectedEmployees = getSelectedEmployees();
  const existingData = retrieveDataFromLocalStorage();
  const departmentsAndRoles = getDepartmentsAndRolesFromLocalStorage();
  selectedEmployees.forEach((empNo) => {
    const existingIndex = existingData.findIndex(
      (employee) => employee.empNo === empNo
    );
    if (existingIndex !== -1) {
      const employee = existingData[existingIndex];
      employee.role = formData.role;
      employee.dept = formData.dept;
      employee.description = formData.description;
      employee.location = formData.location;
    }
  });
  const selectedDepartment = formData.dept;
  const selectedRoles =
    departmentsAndRoles.find((data) => data.department === selectedDepartment)
      ?.roles || [];
  if (!selectedRoles.includes(formData.role)) {
    const selectedDepartmentData = departmentsAndRoles.find(
      (data) => data.department === selectedDepartment
    );
    if (selectedDepartmentData) {
      selectedDepartmentData.roles.push(formData.role);
    }
  }
  setDataInLocalStorage(existingData);
  setDepartmentsAndRolesInLocalStorage(departmentsAndRoles);
  window.location.href = "/employees.html";
}

//funciton to get employees selected for new role assignment
function getSelectedEmployees() {
  const checkboxes = document.getElementsByClassName("select");
  const selectedEmployees = [];

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      selectedEmployees.push(checkbox.id);
    }
  }

  return selectedEmployees;
}
