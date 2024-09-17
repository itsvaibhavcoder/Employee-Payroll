const namePattern = /^[a-zA-Z\s'-]{3,}$/;

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

    fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empDataObj),
      })
      .then((response)=>{
        if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          return response.json();
      })
      .then((data)=>{
        alert("Employee added successfully!");
        empForm[0].reset();
      })
      .catch((error)=>{
        console.error("Error adding employee:", error);
      });
    clearForm();
});

$("#cancelBtn, #resetButton").on("click", function (e) {
    e.preventDefault();
    clearForm();
});
