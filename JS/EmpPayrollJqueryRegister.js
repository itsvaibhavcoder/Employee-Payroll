const namePattern = /^[a-zA-Z\s'-]{3,}$/;
('editEmployeeId');
$(document).ready(function () {
    //fetchAndDisplayEmployees();
    //Check inside the ls edit data is there or not 
    // If it is there set input field value using that data
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
    
    //Check if you have data present in lS if it there instead post call put api and clear the LS else do post part
    $.ajax({
        url: "http://localhost:3000/employees",
        type: "POST", 
        contentType: "application/json", 
        data: JSON.stringify(empDataObj),
        success: function (data) {
            alert("Employee added successfully!");
            clearForm(); 
            //window.location.href = 'Pages/EmpPayrollDahboard.html';
        },
        error: function (xhr, status, error) {
            console.error("Error adding employee:", error);
        }
    });
});

$("#cancelBtn, #resetButton").on("click", function (e) {
    e.preventDefault();
    clearForm();
});
