///-------client == admin||user----------///
var deleteevent = document.getElementById("deleteevent");
var userdata = document.getElementById("userdata");
var editevent = document.getElementById("editevent");
var register = document.getElementById("register");

var registered = true;
clientType("user");

function clientType(client) {
    if (client === "admin") {
      editevent.style.display = "block";
      deleteevent.style.display = "block";
      userdata.style.display = "block";
      register.style.display = "none";
    } else {
        editevent.style.display = "none";
        deleteevent.style.display = "none";
        userdata.style.display = "none";
        register.style.display = "block";
        if (registered == true){
            register.querySelector('.button').innerText = "Registered";
        }
    }
  }