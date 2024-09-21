document.addEventListener("DOMContentLoaded", function () {
  //alphabetical filter autoPopulate and filter
  const filterDiv = document.getElementById("alphabeticalFilter");
  for (let i = 1; i <= 26; i++) {
    const charCode = String.fromCharCode(64 + i);
    filterDiv.insertAdjacentHTML(
      "beforeend",
      `
        <li onclick="handleAlphabeticalFilter('${charCode}')" class="filterAlphabets" id="${charCode}">${charCode}</li>
    `
    );
  }
  //intial call to reset all filters upon page load
  filterTableData();
});
// Initialize selectedFilter//global object
var selectedFilter = {
  char: [],
  status: [],
  location: [],
  department: [],
};
//function to export Data
function exportTableDataToCSV() {
  const employeeDetailsDataArray = retrieveDataFromLocalStorage();
  if (employeeDetailsDataArray.length === 0) return;
  const headers = Object.keys(employeeDetailsDataArray[0]).filter(
    (header) => header !== "img" && header !== "isChecked"
  );
  const csvContent = employeeDetailsDataArray
    .map((employee) =>
      headers.map((header) => `"${employee[header]}"`).join(",")
    )
    .join("\n");
  const CSVFile = new Blob([headers.join(",") + "\n" + csvContent], {
    type: "csv",
  });
  const url = window.URL.createObjectURL(CSVFile);
  const temp_link = document.createElement("a");
  temp_link.href = url;
  temp_link.download = "employeeTable.csv";
  document.body.appendChild(temp_link);
  temp_link.click();
  document.body.removeChild(temp_link);
}
// add-employee in table
function handleAddEmployee() {
  window.location.href = "add-employee.html";
}
// function for creating and adding new employee
function insertEmployeeToTable(data) {
  const tableBody = document.getElementById("employeeTableBody");
  const tr = document.createElement("tr");
  tr.classList.add("employee-table-row");
  tr.innerHTML = `
        <td class="selected-employee">
            <input type="checkbox" ${
              data.isChecked ? "checked" : ""
            } name="select" class="select" id="${
    data.empNo
  }" onchange="updateTableCheckbox('${data.empNo}',this.checked),false">
        </td>
        <td class="d-flex jus-content-start emp-profile">
            <div class="emp-profile-container">
                <img src="${
                  data.img || "/images/profile-pic.png"
                }" alt="employee-image" class="employee-img">
            </div>
            <div class="employee-profile d-flex flex-col">
                <span class="employee-name">${data.fname} ${data.lname}</span>
                <span class="employee-email">${data.email}</span>
            </div>
        </td>
        <td class="employee-location">${data.location}</td>
        <td class="employee-department">${data.dept}</td>
        <td class="employee-role">${data.role}</td>
        <td class="employee-no">${data.empNo}</td>
        <td class="employee-status">
            <span class="employee-status-value">${
              data.status || "Active"
            }</span>
        </td>
        <td class="employee-join-dt">${data.joinDate}</td>
        <td class="row-edit-container">
            <button class="three-dots" onclick="showEdit('${data.empNo}x')">
                <img src="${
                  data.dots || "/images/load-more.png"
                }" alt="three-dot">
            </button>
            <div class="menu" id="${data.empNo}x">
            <ul><li onclick="redirectToEditEmployee('${data.empNo}',false);">
Edit</li><li onclick="redirectToEditEmployee('${
    data.empNo
  }',true)">View</li><li id="${data.empNo}"  onclick="handleDelete('${
    data.empNo
  }')">Delete</li>
            </ul>
            </div>
        </td>
    `;
  tableBody.appendChild(tr);
}
//function to toggle display style of edit-menu
function showEdit(menuId) {
  let menu = document.getElementById(menuId);
  if (!menu) return;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
  document.addEventListener("click", function closeMenu(event) {
    if (event.target !== button && !menu.contains(event.target)) {
      menu.style.display = "none";
    }
  });
}
//redirect to edit-page
function redirectToEditEmployee(employeeId, check) {
  window.location.href = `/add-employee.html?empNo=${employeeId}&view=${check}`;
}
//hadnling delete functionality and row check
//updatingfromisChecked
function updateTableCheckbox(empNo, check, selectAll) {
  let data = retrieveDataFromLocalStorage();
  let flag = false; // Initialize flag to false
  data = data.map((employee) => {
    if (selectAll || employee.empNo === empNo) {
      employee.isChecked = check;
    }
    if (employee.isChecked) {
      flag = true; // Set flag to true if isChecked is true
    }
    return employee;
  });
  setDataInLocalStorage(data);
  updateTable(data);
  changeTableDeleteBtnBG(check);

  return flag; // Return flag value
}
//delete
function changeTableDeleteBtnBG(value) {
  var btnDelete = document.getElementById("btnDelete");
  btnDelete.style.backgroundColor = value ? "red" : "#F89191";
}
function handleDelete(empNo = null) {
  let employeeDetailsDataArray = retrieveDataFromLocalStorage();
  if (empNo) {
    employeeDetailsDataArray = employeeDetailsDataArray.filter(
      (employee) => employee.empNo !== empNo
    );
  } else {
    employeeDetailsDataArray = employeeDetailsDataArray.filter(
      (employee) => employee.isChecked !== true
    );
  }
  setDataInLocalStorage(employeeDetailsDataArray);
  updateTable(employeeDetailsDataArray);
  changeTableDeleteBtnBG(false);
  const employeeCheckbox = document.getElementById("employeeSelect");
  if (employeeCheckbox.checked) {
    employeeCheckbox.checked = !employeeCheckbox.checked;
  }
  updateTable(employeeDetailsDataArray);
}
//filter-menu
//reset-alphabetical-filter
function resetSelectedFilter() {
  [...document.getElementsByClassName("filterAlphabets")].forEach((li) => {
    li.classList.remove("isActive");
  });
  selectedFilter.char = [];
  filterTableData();
}
//alphabetical filter
function handleAlphabeticalFilter(letter) {
  [...document.getElementsByClassName("filterAlphabets")].forEach((li) => {
    li.classList.remove("isActive");
  });
  if (selectedFilter.char.indexOf(letter) === -1) {
    selectedFilter.char = [letter];
    filterTableData();
    document.getElementById(letter).classList.add("isActive");
  } else {
    selectedFilter.char = [];
    filterTableData();
    document.getElementById(letter).classList.remove("isActive");
  }
}
//drop-down filter
//function to reset dropdown-filter
function resetDropDownFilters() {
  const dropdownIds = [
    "statusDropdown",
    "locationDropdown",
    "departmentDropdown",
  ];
  const filtersToReset = ["Status", "Location", "Department"];
  dropdownIds.forEach((id, index) => {
    const dropdown = document.getElementById(id);
    dropdown.value = filtersToReset[index];
  });
  selectedFilter.status = [];
  selectedFilter.location = [];
  selectedFilter.department = [];
  updateFilterButtonsStyle();
  filterTableData();
}
// Function to update the style of filter buttons
function updateFilterButtonsStyle() {
  const filterButtons = document.getElementById("fitlerButtons");
  const locationDropdownValue = selectedFilter.location;
  const statusDropdownValue = selectedFilter.status;
  const departmentDropdownValue = selectedFilter.department;
  console.log("s", statusDropdownValue);
  console.log("l", locationDropdownValue);
  console.log("d", departmentDropdownValue);
  if (
    locationDropdownValue !== "Location" ||
    statusDropdownValue !== "Status" ||
    departmentDropdownValue !== "Department"
  ) {
    filterButtons.style.display = "flex";
  } else {
    filterButtons.style.display = "none";
  }
}
// Add event listener to apply filter button
function applyFilter() {
  setFilterValue("department", "departmentDropdown");
  setFilterValue("location", "locationDropdown");
  setFilterValue("status", "statusDropdown");
  filterTableData();
}
function setFilterValue(filterKey, dropdownId) {
  const selectedValue = document.getElementById(dropdownId).value;
  selectedFilter[filterKey] =
    selectedValue !== "Department" &&
    selectedValue !== "Location" &&
    selectedValue !== "Status"
      ? [selectedValue]
      : [];
}
//update table
function updateTable(displayFormData) {
  const tableBody = document.getElementById("employeeTableBody");
  tableBody.innerHTML = "";
  displayFormData.forEach((employee) => {
    insertEmployeeToTable(employee);
  });
  const noDataRow = document.getElementById("noDataRow");
  if (displayFormData.length === 0 && !noDataRow) {
    const noDataRowHTML = `
        <div class="no-data-row" id="noDataRow">
            <p>No Data To Show</p>
        </div>`;
    document
      .getElementById("employeeDetailsContainer")
      .insertAdjacentHTML("beforeend", noDataRowHTML);
  } else if (displayFormData.length > 0 && noDataRow) {
    noDataRow.parentNode.removeChild(noDataRow);
  }
}
//filter displaydata
function filterTableData() {
  const employeeDetailsDataArray = retrieveDataFromLocalStorage();
  const { char, status, location, department } = selectedFilter;
  const displayFormData = employeeDetailsDataArray.filter((data) => {
    const fnameInitial = data.fname.charAt(0).toUpperCase();
    const matchesChar =
      char.length === 0 || fnameInitial === char[0].toUpperCase();
    const matchesStatus = status.length === 0 || status.includes(data.status);
    const matchesLocation =
      location.length === 0 || location.includes(data.location);
    const matchesDepartment =
      department.length === 0 || department.includes(data.dept);
    return matchesChar && matchesStatus && matchesLocation && matchesDepartment;
  });
  updateTable(displayFormData);
}

//sort-function
let sortAscending = true;
function sortTableDataByKey(key) {
  let displayFormData = retrieveDataFromLocalStorage();
  displayFormData.sort((a, b) => {
    const valueA = getValueForKey(a, key);
    const valueB = getValueForKey(b, key);
    if (sortAscending) {
      return compareValues(valueA, valueB);
    } else {
      return compareValues(valueB, valueA);
    }
  });
  updateTable(displayFormData);
  sortAscending = !sortAscending;
}
function getValueForKey(obj, key) {
  switch (key) {
    case "empName":
      return obj["fname"] + " " + obj["lname"];
    case "location":
    case "dept":
    case "role":
    case "joinDate":
      return obj[key];
    case "empNo":
      return parseInt(obj[key].match(/\d+/)[0]);
    default:
      return "";
  }
}

function compareValues(valueA, valueB) {
  if (valueA === "" && valueB === "") {
    return 0;
  } else if (valueA === "") {
    return 1;
  } else if (valueB === "") {
    return -1;
  } else if (!isNaN(valueA) && !isNaN(valueB)) {
    return parseInt(valueA) - parseInt(valueB);
  } else {
    return valueA.localeCompare(valueB);
  }
}
