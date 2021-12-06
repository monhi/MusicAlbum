function SubmitNewUser() 
{
    const u = document.getElementById("newusername").value;
    const p1 = document.getElementById("newpassword").value;
    const p2 = document.getElementById("retypenewpassword").value;

    if (u == "") {
        document.getElementById("newusernamenotify").textContent = "User name is empty";
        document.getElementById("newusernamenotify").style.color = "Red";
        setTimeout(() => {
            document.getElementById("newusernamenotify").textContent = "New username";
            document.getElementById("newusernamenotify").style.color = "Black";

        }, 2000);
        return;
    }

    if (p1 == "") {
        document.getElementById("newpasswordnotify").textContent = "Password is empty";
        document.getElementById("newpasswordnotify").style.color = "Red";
        setTimeout(() => {
            document.getElementById("newpasswordnotify").textContent = "New password";
            document.getElementById("newpasswordnotify").style.color = "Black";
        }, 2000);
        return;
    }

    if (p2 == "") {
        document.getElementById("retypenewpasswordnotify").textContent = "Second password is empty";
        document.getElementById("retypenewpasswordnotify").style.color = "Red";

        setTimeout(() => {
            document.getElementById("retypenewpasswordnotify").textContent = "Retype new password";
            document.getElementById("retypenewpasswordnotify").style.color = "Black";
        }, 2000);
        return;
    }

    if (p1 != p2) {
        document.getElementById("newpasswordnotify").textContent = "password mismatch";
        document.getElementById("newpasswordnotify").style.color = "Red";


        document.getElementById("retypenewpasswordnotify").textContent = "password mismatch";
        document.getElementById("retypenewpasswordnotify").style.color = "Red";

        setTimeout(() => {
            document.getElementById("newpasswordnotify").textContent = "New password";
            document.getElementById("newpasswordnotify").style.color = "Black";

            document.getElementById("retypenewpasswordnotify").textContent = "Retype new password";
            document.getElementById("retypenewpasswordnotify").style.color = "Black";
        }, 2000);
        return;
    }

    fetch("/admin/newuser", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: u,
            pass1: p1,
            pass2: p2
        })
    })
        .then(res => res.json())
        .then(data => {
            const { result, param } = data;
            document.getElementById("addnewuserresult").textContent = "   " + result + " : " + param;
            if (result.toLowerCase() == "success") {
                document.getElementById("addnewuserresult").style.color = "Green";
            }
            else {
                document.getElementById("addnewuserresult").style.color = "Red";
            }
            document.getElementById("addnewuserresult").style.fontSize = "Large";
            setTimeout(() => { document.getElementById("addnewuserresult").textContent = "" }, 2000);

        })
        .catch(err => {
            document.getElementById("addnewuserresult").textContent = err;
            document.getElementById("addnewuserresult").style.color = "Red";
            document.getElementById("addnewuserresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("addnewuserresult").textContent = "" }, 2000);
        });
}

function SubmitRefreshUsers() {
    fetch("/admin/refresh", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    })
        .then(res => res.json())
        .then(users => {


            let selectAge = document.getElementById("currentUsers");
            let contents;

            users.forEach((o) => {
                contents += "<option>" + o.name + "</option>";
            });
            selectAge.innerHTML = contents;

            document.getElementById("editusersresult").textContent = "Refresh done!";
            document.getElementById("editusersresult").style.color = "Green";
            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);
        })
        .catch(err => {
            document.getElementById("editusersresult").textContent = err;
            document.getElementById("editusersresult").style.color = "Red";
            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);
        });

}

function SubmitChangePassword() {
    const u = document.getElementById("currentUsers").value;
    const p1 = document.getElementById("setnewpassword").value;
    const p2 = document.getElementById("setretypenewpassword").value;

    if (p1 == "") {
        document.getElementById("setnewpasswordnotify").textContent = "Password is empty";
        document.getElementById("setnewpasswordnotify").style.color = "Red";

        setTimeout(() => {
            document.getElementById("setnewpasswordnotify").textContent = "Change password";
            document.getElementById("setnewpasswordnotify").style.color = "Black";

        }, 2000);
        return;
    }

    if (p2 == "") {
        document.getElementById("setretypenewpasswordnotify").textContent = "Second password is empty";
        document.getElementById("setretypenewpasswordnotify").style.color = "Red";
        setTimeout(() => {
            document.getElementById("setretypenewpasswordnotify").textContent = "Retype new password";
            document.getElementById("setretypenewpasswordnotify").style.color = "Black";
        }, 2000);
        return;
    }

    if (p1 != p2) {
        document.getElementById("setnewpasswordnotify").textContent = "password mismatch";
        document.getElementById("setnewpasswordnotify").style.color = "Red";

        document.getElementById("setretypenewpasswordnotify").textContent = "password mismatch";
        document.getElementById("setretypenewpasswordnotify").style.color = "Red";

        setTimeout(() => {
            document.getElementById("setnewpasswordnotify").textContent = "Change password";
            document.getElementById("setnewpasswordnotify").style.color = "Black";
            document.getElementById("setretypenewpasswordnotify").textContent = "Retype new password";
            document.getElementById("setretypenewpasswordnotify").style.color = "Black";
        }, 2000);
        return;
    }

    fetch("/admin/changepassword", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: u,
            pass1: p1,
            pass2: p2
        })
    })
        .then(res => res.json())
        .then(data => {
            const { result, param } = data;
            document.getElementById("editusersresult").textContent = "   " + result + " : " + param;
            if (result.toLowerCase() == "success") {
                document.getElementById("editusersresult").style.color = "Green";
            }
            else {
                document.getElementById("editusersresult").style.color = "Red";
            }

            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);

        })
        .catch(err => {
            document.getElementById("editusersresult").textContent = err;
            document.getElementById("editusersresult").style.color = "Red";
            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);
        });
}

function SubmitDeleteUser() {
    var u = document.getElementById("currentUsers").value;
    u = u.toLowerCase();
    if (u == "admin") {
        document.getElementById("editusersresult").textContent = "can not delete admin.";
        document.getElementById("editusersresult").style.color = "Red";
        document.getElementById("editusersresult").style.fontSize = "large";
        setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);
        return;
    }

    fetch("/admin/deleteuser", {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: u
        })
    })
        .then(res => res.json())
        .then(data => {
            const { result, param } = data;
            document.getElementById("editusersresult").textContent = "   " + result + " : " + param;
            if (result.toLowerCase() == "success") {
                document.getElementById("editusersresult").style.color = "Green";
            }
            else {
                document.getElementById("editusersresult").style.color = "Red";
            }

            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);

        })
        .catch(err => {
            document.getElementById("editusersresult").textContent = err;
            document.getElementById("editusersresult").style.color = "Red";
            document.getElementById("editusersresult").style.fontSize = "large";
            setTimeout(() => { document.getElementById("editusersresult").textContent = "" }, 2000);
        });
}