//reset function
document.addEventListener('DOMContentLoaded', function () {
  //initial-call to create-roles-dropdown
  createRoleSelector();
  //handling form submission
  const addEmpForm = document.getElementById("submit");
  addEmpForm.addEventListener('click', handleFormSubmission);
  //for-edit-mode/view-mode
  const urlParams = new URLSearchParams(window.location.search);
  const empNo = urlParams.get('empNo');
  const view = urlParams.get('view');
  if (empNo) {
    fetchAndPopulateEmployeeData(empNo, view);
  }
});
// Function to fetch and autopopulate form fields based on empNo
function fetchAndPopulateEmployeeData(empNo, view) {
  const existingData = retrieveDataFromLocalStorage();
  const selectedEmployee = existingData.find(employee => employee.empNo === empNo);

  if (selectedEmployee) {
    const form = document.getElementById('add-employee-form');
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      if (selectedEmployee.hasOwnProperty(key)) {
        if (key === 'img') {
          displayImagePreview(selectedEmployee[key]);
        }
        else {
          const element = document.getElementById(key);
          if (element) {
            element.value = selectedEmployee[key];
          }
        }
        if (key === 'dept') {
          createRoleSelector(selectedEmployee[key]);
        }
      }
    }

    const roleInput = document.getElementById('role');
    const deptInput = document.getElementById('dept');
    if (roleInput) {
      deptInput.value = selectedEmployee.dept;
      roleInput.value = selectedEmployee.role;
    }

    // Disable empNo input field
    disableFormInputFields(view);
  }
}

function disableFormInputFields(view) {
  const empNoInput = document.getElementById('empNo');
  if (view === 'true') {
    // Disable all input elements
    document.querySelectorAll('input').forEach(input => input.disabled = true);
    updateSubmitButtonLabel("view");
  } else {
    // Disable only the empNoInput element
    empNoInput.disabled = true;
    updateSubmitButtonLabel("edit");
  }
}
function updateSubmitButtonLabel(check) {
  const submitButton = document.getElementById('submit');
  if (check === "edit") {
    submitButton.innerText = 'Update';
    modifyCancelButton();
  }
  else {
    const addEmployeeBtn = document.getElementById('submit');
    addEmployeeBtn.style.display = "none";
    modifyCancelButton(true);
  }
}
function modifyCancelButton(check) {
  const backButton = document.getElementById('btnCancel');
  if (check) {
    backButton.innerText = 'Back';
    backButton.onclick = function (event) {
      window.location.href = '/employees.html';
    };
  } else {
    backButton.onclick = function (event) {
      window.location.reload(true);
    };
  }
}
//form-validation funciton
function validateForm(event) {
  event.preventDefault();
  const requiredFieldIds = ["empNo", "fname", "lname", "email", "joinDate"];
  let flag = true;
  requiredFieldIds.forEach((id) => {
    const field = document.getElementById(id);
    const errorMessage = field.nextElementSibling;
    if (!field || field.type === 'file') return;
    const isEmpty = field.value.trim() === "";
    const pattern = field.getAttribute('pattern');
    if (isEmpty || (pattern && !new RegExp(pattern).test(field.value.trim()))) {
      errorMessage.textContent = isEmpty ? "⚠ This Field is required" : "⚠" + field.getAttribute('title');
      errorMessage.classList.add('show');
      field.classList.add('error');
      flag = false;
    } else {
      errorMessage.classList.remove('show');
      field.classList.remove('error');
    }
  });
  return flag;
}

function handleFormSubmission(e) {
  e.preventDefault();
  if (!validateForm(e)) return false;
  const addEmpForm = document.getElementById("add-employee-form");
  const existingData = retrieveDataFromLocalStorage();
  // const empNoInput = document.getElementById('empNo');
  const formData = Object.fromEntries(new FormData(addEmpForm));
  formData.status = "Active";
  formData.isChecked = false;
  const profileImageFile = document.getElementById("img").files[0];
  const urlParams = new URLSearchParams(window.location.search);
  const empNo = urlParams.get('empNo');

  if (empNo) {
    const existingIndex = existingData.findIndex(employee => employee.empNo === empNo);
    const existingEmployee = existingData[existingIndex];
    formData.empNo = empNo;
    formData.img = existingEmployee.img;
    existingData.splice(existingIndex, 1);

  }

  if (profileImageFile != undefined) {
    readProfileImageFile(profileImageFile)
      .then(base64 => {
        formData.img = base64;
        existingData.push(formData);
        pushDataToLocalStorage(existingData);
      })
      .catch(error => {
        console.error("Error reading file:", error);
      });
  }
  else {
    existingData.push(formData);
    pushDataToLocalStorage(existingData);
  }
}


//function to read the file
function readProfileImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
//pushin-data to local storage and submission
function pushDataToLocalStorage(data) {
  const json = JSON.stringify(data);
  localStorage.setItem('employeeDetailsDataArray', json);
  window.location.href = '/employees.html';
}
//profile-preview
function displayImagePreview(source) {
  if (source) { document.getElementById("defaultProfile").src = source; }
  else {
    const image = document.getElementById("img").files[0];
    if (image) {
      const url = URL.createObjectURL(image);
      document.getElementById("defaultProfile").src = url;
    }
  }
}
//function to restrict size of image file
function restrictImageSize(e) {
  let input = document.getElementById("img");
  let file = e.target.files[0];
  if (file && file.size > 5 * 1024 * 1024) {
    alert("File size exceeds the limit of 5MB.");
    input.value = "";
  }
  else {
    displayImagePreview();
  }
}
