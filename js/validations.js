window.onload = eventsLoad;

/***************************** EVENTOS ********************************/
function eventsLoad() {
    console.log(window.location.href);
    switch (window.location.href) {
        case "http://127.0.0.1:5500/login.html":
            checkCookie();
            document.getElementById("btnLogin").addEventListener("click", validateLogin, true);
            break;
        case "http://127.0.0.1:5500/register.html":
            document.getElementById("btnRegister").addEventListener("click", validateRegistration, true);
            break;
        default:
            alert("NO coincide ningunha url");
            break;
    }
}

/***************************** INPUTS ********************************/
function validateName(element) {
    var string = element.value;
    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");

    if (string == "" || string == null) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "El nombre es obligatorio.";
        element.focus();
        element.classList.add("error");
        return false;
    } else if (string.length < 3) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "El nombre tiene que tener minímo 3 carácteres.";
        element.focus();
        element.classList.add("error");
        return false;
    } else {
        alertMessage.innerHTML = "";
        element.classList.remove("error");
        alert.style.display = "none";
        return true;
    }

}

function validateMail(element) {
    //estructura de un mail:  nombre de usuario + @ + servidor + dominio
    //[a-zA-Z0-9._-]+ hace que se repitan letras, números, puntos (.), guiones bajos (_) o guiones (-).
    //a continuación la @ (solo una): +@
    //repetimos la primera [a-zA-Z0-9._-]+
    //el dominio irá al final,tras un punto y podrá tener 2,3,4 letras (.es,.com,.info....): \.([a-zA-Z]{2,4})+$
    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");
    var valor = element.value;
    var expReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/;

    if (!expReg.test(valor)) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "El mail introducido no es correcto.";
        element.classList.add("error");
        element.focus();
        return false;
    } else {
        alertMessage.innerHTML = "";
        element.classList.remove("error");
        alert.style.display = "none";
        return true;
    }
}

function validatePassword(element) {
    //recogemos el valor y el nombre del input para saber el element que tratamos 
    //y poder devolverle el foco      
    var string = element.value;
    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");
    var message = "";

    if (string == "" || string == null) {
        alert.style.display = "inline";
        element.classList.add("error");

        if (element.id == "repeatPassword") {
            message = "Las contraseñas no coinciden.";
        } else {
            message = "La contraseña no puede ir vacía.";
        }

        alertMessage.innerHTML = message;
        element.focus();
        return false;

    } else if (string.length < 5) {
        alert.style.display = "inline";

        if (element.id == "repeatPassword") {
            message = "Las contraseñas no coinciden.";
        } else {
            message = "La contraseña debe tener un minímo de 5 carácteres.";
        }

        alertMessage.innerHTML = message;
        element.focus();
        element.classList.add("error");
        //element.className = "error";
        return false;
    } else {
        alertMessage.innerHTML = "";
        element.classList.remove("error");
        alert.style.display = "none";
        element.placeholder = "";
        return true;
    }

}

function validateRepeatPassword(element, elementCompare) {
    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");
    var string = element.value;
    var stringCompare = elementCompare.value;

    if (string === stringCompare) {
        alertMessage.innerHTML = "";
        elementCompare.classList.remove("error");
        alert.style.display = "none";
        elementCompare.placeholder = "";
        return true;

    } else {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Las contraseñas no coinciden.";
        elementCompare.classList.add("error");
        elementCompare.placeholder = "Las contraseñas deben coincidir.";
        elementCompare.focus();
        return false;
    }

}

function validateBornDate(element) {

    //para validater la fecha, compruebo si puedo construir una fecha con 
    //los datos que facilita el usuario. De no ser capaz de construirla habrá un error
    //por el formato gracias al type="date" ya va en formato dd/mm/aaaa.
    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");
    var valor = element.value;
    var ano = parseInt(valor.substring(0, 4));
    var mes = parseInt(valor.substring(5, 7)) - 1;
    var dia = parseInt(valor.substring(8, valor.length));

    var fch = new Date(ano, mes, dia);
    //console.log(fch);
    //console.log(isNaN(fch));

    if (isNaN(fch)) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Error al seleccionar la fecha de nacimiento.";
        element.classList.add("error");
        element.focus();
        return false;

    } else if (ano > 2003) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Para poder usar la aplicación debe tener más de 16 años";
        element.classList.add("error");
        element.focus();
        return false;

    } else {
        alertMessage.innerHTML = "";
        element.classList.remove("error");
        alert.style.display = "none";
        return true;
    }

}

function cleanErrores(listElements) {
    //limpiamos algún posible error de otra parte del formulario
    var errores = listElements;
    for (var i = 0; i < errores.length; i++) {
        errores[i].classList.remove("error");
    }
}

/***************************** CHEKS ********************************/
function validateTerms(element) {

    var alert = document.getElementById("alert");
    var alertMessage = document.getElementById("alertMessage");
    var isChecked = element.checked;

    console.log(isChecked);

    if (isChecked) {
        alertMessage.innerHTML = "";
        element.classList.remove("error");
        alert.style.display = "none";
        return true;

    } else {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Debe aceptar los términos y condiciones.";
        element.classList.add("error");
        element.focus();
        return false;

    }
}

function checkRemember(element) {
    var isChecked = element.checked;

    if (isChecked) {
        return true;

    } else {
        return false;
    }
}

/**************************************
 *********** VALIDAR LOGIN ************
 **************************************/
function validateLogin(event) {
    event.preventDefault();

    var email = document.getElementById("emailLogin");
    var password = document.getElementById("passwordLogin");

    var check = document.getElementById("remember");

    if (checkRemember(check)) {
        document.cookie = "email = " + email.value;
    } else {
        document.cookie = "email = ";
    }


    //si todo valida, enviamos petición de buscar usuario
    if (validateMail(email) && validatePassword(password)) {

        cleanErrores(document.getElementsByTagName("input"));

        if (confirm("Todo validado correctamente.")) {

            alert("Petición de usuario: \n email: " + email.value + " \n password: " + password.value);
            //document.getElementById("register-validation").submit();        
        }

    }
}

/**************************************
 ********* VALIDAR REGISTRO ***********
 **************************************/
function validateRegistration(event) {
    event.preventDefault();

    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    var repeatPassword = document.getElementById("repeatPassword");
    var bornDate = document.getElementById("bornDate");
    var agree = document.getElementById("agree");

    //si todo valida, enviamos petición de buscar usuario
    if (validateName(name) && validateMail(email) &&
        validatePassword(password) && validatePassword(repeatPassword) &&
        validateRepeatPassword(password, repeatPassword) && validateBornDate(bornDate) &&
        validateTerms(agree)) {

        if (confirm("Todo validado correctamente.")) {

            var newUser = new User(name, email, password, bornDate);

            /**
            newUser.name = name;
            newUser.email = email;
            newUser.password = password;
            newUser.bornDate = bornDate;
             */


            alert(newUser.toString);

            //document.getElementById("register-validation").submit();

        }


    }
}

/**************************************
 ************** COOKIES ***************
 **************************************/
function getCookie() {
    //Esta función la usamos para recuperar la cookie
    var cookie = document.cookie;
    var resultado = cookie.split('=');
    return resultado[1];
}

function checkCookie() {
    var mail = getCookie("email");

    if (mail === undefined) {
        document.getElementById("emailLogin").value = "";
    } else {
        document.getElementById("emailLogin").value = mail;
    }

}