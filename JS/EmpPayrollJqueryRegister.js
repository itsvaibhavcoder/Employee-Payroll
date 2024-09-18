const namePattern = /^[a-zA-Z\s'-]{3,}$/;
$(document).ready(function () {
    const editEmployeeId = localStorage.getItem('editEmployeeId');
    if (editEmployeeId) {
        $.ajax({
            url: `http://localhost:3000/employees/${editEmployeeId}`,
            method: 'GET',
            success: function (data) {
                populateFormWithEmployeeData(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching employee data:', error);
            }
        });
    }
});

function validateName(name) {
    if (!namePattern.test(name)) {
        $("#nameError").show();
        $("#nameError").text("Name must be at least 3 characters long and contain only letters, spaces, hyphens, or apostrophes.");
        return false;
    } 
    else {
        $("#nameError").hide();
        return true;
    }
}

function populateFormWithEmployeeData(employee) {
    $("#emp-name").val(employee.name);
    $(`[name='profile'][value='${employee.profile}']`).prop('checked', true);
    $(`[name='gender'][value='${employee.gender}']`).prop('checked', true);

    employee.departments.forEach(function (dept) {
        $(`[name='${dept.toLowerCase()}']`).prop('checked', true);
    });

    $("#salary").val(employee.salary);
    const [day, month, year] = employee.startDate.split('-');
    $("#day").val(day);
    $("#month").val(month);
    $("#year").val(year);
    $("#notes").val(employee.notes);
}

function clearForm() {
    $("#emp-form")[0].reset();
    $("#nameError").hide();
}

$("#submitButton").on("click", function (e) {
    e.preventDefault();
    const nameVal = $("#emp-name").val().trim();

    if (!validateName(nameVal)) {
        return;
    }

    let selectedProfile = $("[name='profile']:checked").val() || "";
    let selectedGender = $("[name='gender']:checked").val() || "";

    let selectedDepartments = [];
    $(".checkbox:checked").each(function () {
        selectedDepartments.push($(this).val());
    });

    const selectedSalary = $("#salary").val();
    const selectedStartDate = `${$("#day").val()}-${$("#month").val()}-${$("#year").val()}`;
    const notesVal = $("#notes").val();

    const empDataObj = {
        name: nameVal,
        profile: selectedProfile,
        gender: selectedGender,
        departments: selectedDepartments,
        salary: selectedSalary,
        startDate: selectedStartDate,
        notes: notesVal,
    };

    const editEmployeeId = localStorage.getItem('editEmployeeId');
    if (editEmployeeId) {
        $.ajax({
            url: `http://localhost:3000/employees/${editEmployeeId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(empDataObj),
            success: function (data) {
                alert("Employee updated successfully!");
                clearForm();
                localStorage.removeItem('editEmployeeId');
                window.location.href = './EmpPayrollDahboard.html';
            },
            error: function (xhr, status, error) {
                console.error("Error updating employee:", error);
            }
        });
    } 
    else {
        $.ajax({
            url: "http://localhost:3000/employees",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(empDataObj),
            success: function (data) {
                alert("Employee added successfully!");
                clearForm();
                window.location.href = './EmpPayrollDahboard.html';
            },
            error: function (xhr, status, error) {
                console.error("Error adding employee:", error);
            }
        });
    }
});


$("#cancelBtn, #resetButton").on("click", function (e) {
    e.preventDefault();
    clearForm();
    localStorage.removeItem('editEmployeeId');
});

