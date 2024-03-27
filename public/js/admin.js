const allUsers = JSON.parse(document.getElementById("allUsersList").value);
const privilegedUsers = JSON.parse(document.getElementById("privilegedUsersList").value);
const allUsersTableBody = document.getElementById("allUsersTableBody");
const privilegedUsersTableBody = document.getElementById("privilegedUsersTableBody");
const searchInputPrivilegedUsers = document.getElementById("searchInputPrivilegedUsers");
const searchInputAllUsers = document.getElementById("searchInputAllUsers");

function renderPrivilegedUsers(users) {
    privilegedUsersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/remove-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to remove privileged access from this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToRemoveAccess" value="${user._id}">
                        <button type="submit" class="btn btn-primary">Revoke Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        privilegedUsersTableBody.appendChild(row);
    });
}

function renderAllUsers(users) {
    allUsersTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/provide-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to provide privileged access to this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToProvideAccess" value="${user._id}">
                        <button type="submit" class="btn btn-primary">Provide Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        allUsersTableBody.appendChild(row);
    });
}

searchInputPrivilegedUsers.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const filteredUsers = privilegedUsers.filter(user => user.username.toLowerCase().includes(searchText));
    renderPrivilegedUsers(filteredUsers);
});

searchInputAllUsers.addEventListener("input", function () {
    const searchText = this.value.toLowerCase();
    const filteredUsers = allUsers.filter(user => user.username.toLowerCase().includes(searchText));
    renderAllUsers(filteredUsers);
});

// Initial rendering of the users
renderAllUsers(allUsers);
renderPrivilegedUsers(privilegedUsers);