window.onload = eventsLoad;

function eventsLoad() {
    document.getElementById("btnRegister").addEventListener("click", validateRegistration, true);
}

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

            var newUser = new User(name,email,password,bornDate);

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

    if (string == "" || string == null) {
        alert.style.display = "inline";
        element.classList.add("error");
        alertMessage.innerHTML = "Las contraseñas no pueden ir vacías."
        element.focus();
        return false;

    } else if (string.length < 5) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Las contraseñas deben tener un minímo de 5 carácteres.";
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