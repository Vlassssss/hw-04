const fetchUsersBtn = document.querySelector(".btn");
        const userList = document.querySelector(".user-list");
        const userLimitInput = document.querySelector(".user-limit");

        fetchUsersBtn.addEventListener("click", () => {
            const limit = parseInt(userLimitInput.value, 10);
            fetchUsers()
                .then((users) => {
                    if (isNaN(limit) || limit < 1) {
                        renderUsers(users); // Default behavior: render all users
                    } else {
                        renderUsers(users.slice(0, limit)); // Render only the specified number of users
                    }
                })
                .catch((error) => console.log(error));
        });

        function fetchUsers() {
            return fetch("https://jsonplaceholder.typicode.com/users").then(
                (response) => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                }
            );
        }

        function renderUsers(users) {
            const markup = users
                .map((user) => {
                    return `<li>
                        <p><b>Name</b>: ${user.name}</p>
                        <p><b>Email</b>: ${user.email}</p>
                        <p><b>Company</b>: ${user.company.name}</p>
                    </li>`;
                })
                .join("");
            userList.innerHTML = ""; // Clear the list before adding new users
            userList.insertAdjacentHTML("beforeend", markup);
        }
// ==========================
document.getElementById('allButton').addEventListener('click', function() {
    fetchAndFilterData('all');
});

document.getElementById('completedButton').addEventListener('click', function() {
    fetchAndFilterData('completed');
});

document.getElementById('notCompletedButton').addEventListener('click', function() {
    fetchAndFilterData('notCompleted');
});

function fetchAndFilterData(status) {
    fetch('https://6633e447f7d50bbd9b4b04cb.mockapi.io/Lab4')
        .then(response => response.json())
        .then(data => {
            const processesList = document.querySelector('.processes__list');

            processesList.innerHTML = '';
            data.forEach(item => {
                if ((status === 'completed' && item.Completed) || (status === 'notCompleted' && !item.Completed) || status === 'all') {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div class="data__item">
                            <div class="data__inner">
                                <p class="data__title">ID: ${item.id}</p>
                                <h1 class="data__title">Task: ${item.Title}</h1>
                            </div>
                            <p class="data__text">${item.Completed ? 'Completed' : 'Not Completed'}</p>
                        </div>
                            <button class="processes__delete-btn" data-id="${item.id}">Delete</button>                 
                    `;
                    processesList.appendChild(listItem);
                }
            });

            const deleteButtons = document.querySelectorAll('.processes__delete-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = button.getAttribute('data-id');
                    deleteItem(itemId);
                });
            });

        })
        .catch(error => console.error('Error fetching data:', error));
}

function deleteItem(itemId) {
    fetch(`https://6633e447f7d50bbd9b4b04cb.mockapi.io/Lab4/${itemId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Item deleted successfully:', data);
            // Оновлення списку після видалення елементу
            fetchAndFilterData('all');
        })
        .catch(error => {
            console.error('Error deleting item:', error);
        });
}

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const taskTitle = document.getElementById('taskTitle').value;
    const taskStatus = document.querySelector('input[name="taskStatus"]:checked').value;

    postData(taskTitle, taskStatus);

    document.getElementById('taskTitle').value = '';
    document.getElementById('active').checked = false;
    document.getElementById('completed').checked = false;
});

function postData(title, status) {
    fetch('https://6633e447f7d50bbd9b4b04cb.mockapi.io/Lab4', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Title: title,
            Completed: status === 'completed' ? true : false,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Task added successfully:', data);
            fetchAndFilterData('all');
        })
        .catch(error => {
            console.error('Error adding task:', error);
        });
}

fetchAndFilterData('all');








