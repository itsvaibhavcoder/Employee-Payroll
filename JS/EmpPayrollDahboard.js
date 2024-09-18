$(document).ready(function () {
    fetchAndDisplayEmployees();

    // Search button click event
    $('#search-button').on('click', function () {
        const inputText = $('#search-input').val().trim().toLowerCase();
        searchEmployeeByName(inputText); // Call the search function when search button is clicked
    });

    // Optionally: Trigger search on keyup 
    // $('#search-input').on('keyup', function () {
    //     const inputText = $(this).val().trim().toLowerCase();
    //     searchEmployeeByName(inputText); // Call the search function on keyup
    // });
});

function fetchAndDisplayEmployees() {
    $.ajax({
        url: 'http://localhost:3000/employees',
        method: 'GET',
        success: function (data) {
            populateEmployeeTable(data);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching employees:', error);
        }
    });
}

function searchEmployeeByName(inputText) {
    $.ajax({
        url: 'http://localhost:3000/employees',
        method: 'GET',
        success: function (data) {
            if (!inputText) {
                populateEmployeeTable(data); 
                return;
            }

            const filteredEmployees = data.filter(function (employee) {
                return employee.name.toLowerCase().includes(inputText);
            });
            populateEmployeeTable(filteredEmployees);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching employees:', error);
        }
    });
}


function populateEmployeeTable(employees) {
    const $tableBody = $('#display tbody');
    $tableBody.empty(); 

    employees.forEach(function (employee) {
        const $row = createEmployeeRow(employee);
        $tableBody.append($row);
    });
}


function createEmployeeRow(employee) {
    let departmentLabels = '';
    employee.departments.forEach(function (dept) {
        departmentLabels += `<span class="dept-label">${dept}</span>`;
    });

    let formattedDate = employee.startDate;

    const $row = `
        <tr id="row-${employee.id}">
            <td class="emp-info">
                <img src="${employee.profile}" alt="Employee" class="emp-img" />
                <span>${employee.name}</span>
            </td>
            <td>${employee.gender}</td>
            <td>${departmentLabels}</td>
            <td>₹ ${employee.salary}</td>
            <td>${formattedDate}</td>
            <td class="action-buttons">
                <button onclick="deleteEmployee('${employee.id}')" class="action-btn"><img src="../assets/icons8-delete-30.png" alt="Delete"/></button>
                <button onclick="editEmployee('${employee.id}')" class="action-btn"><img src="../assets/icons8-edit-24.png" alt="Edit"/></button>
            </td>
        </tr>
    `;

    return $row;
}

function deleteEmployee(id) {
    $.ajax({
        url: `http://localhost:3000/employees/${id}`,
        method: 'DELETE',
        success: function () {
            $(`#row-${id}`).remove();
            console.log(`Employee with ID ${id} deleted successfully.`);
            refreshPage();
        },
        error: function (xhr, status, error) {
            console.error('Error deleting employee:', error);
        }
    });
}

function editEmployee(id) {
    localStorage.setItem('editEmployeeId', id);
    window.location.href = './EmpPayrollRegister.html';
}

function refreshPage() {
    location.reload();
}
