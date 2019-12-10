window.onload = eventsLoad;

/***************************** EVENTOS ********************************/
function eventsLoad() {
    console.log(window.location.href);
    switch (window.location.href) {
        case "http://127.0.0.1:5500/login.html":

            //Si existe usuario en sesión se redirecciona a index.
            //Si no existe se carga normal el login.html
            if (sessionStorage.getItem("user")) {
                window.location.href = "http://127.0.0.1:5500/index.html";
                break;

            } else {
                checkCookie();
                document.getElementById("btnLogin").addEventListener("click", validateLogin, true);
            }
            break;

        case "http://127.0.0.1:5500/register.html":

            //Si existe usuario en sesión se redirecciona a index.
            //Si no existe se carga normal el register.html
            if (sessionStorage.getItem("user")) {
                window.location.href = "http://127.0.0.1:5500/index.html";
            } else {
                document.getElementById("btnRegister").addEventListener("click", validateRegistration, true);
            }
            break;

        case "http://127.0.0.1:5500/index.html":

            //Si NO existe usuario en sesión se redirecciona a login.          
            if (!sessionStorage.getItem("user")) {
                window.location.href = "http://127.0.0.1:5500/login.html";
            }
            break;

        default:
            alert("NO coincide ningunha url");
            break;
    }
}

/***************************** INPUTS ********************************/
function validateName(element) {
  
    let string = element.value;
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
 
    if (string == "" || string == null) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Este campo es obligatorio.";
        element.focus();
        element.classList.add("error");
        return false;
    } else if (string.length < 3) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Debe tener minímo 3 carácteres.";
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
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let valor = element.value;
    let expReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/;

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
    let string = element.value;
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let message = "";

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
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let string = element.value;
    let stringCompare = elementCompare.value;

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
    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let valor = element.value;
    let ano = parseInt(valor.substring(0, 4));
    let mes = parseInt(valor.substring(5, 7)) - 1;
    let dia = parseInt(valor.substring(8, valor.length));

    let fch = new Date(ano, mes, dia);
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
    let errores = listElements;
    for (let i = 0; i < errores.length; i++) {
        errores[i].classList.remove("error");
    }
}

/***************************** CHEKS ********************************/
function validateTerms(element) {

    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let isChecked = element.checked;

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
    let isChecked = element.checked;

    if (isChecked) {
        return true;

    } else {
        return false;
    }
}

/**************************************
 *********** VALIDAR LOGIN ************
 **************************************/
function validateLogin() {  

    let email = document.getElementById("emailLogin");
    let password = document.getElementById("passwordLogin");

    //provisional
    let name = "prueba";
    let bornDate = "20190202";


    let check = document.getElementById("remember");

    if (checkRemember(check)) {
        document.cookie = "email = " + email.value;
    } else {
        document.cookie = "email = ";
    }


    //si todo valida, enviamos petición de buscar usuario
    if (validateMail(email) && validatePassword(password)) {

        cleanErrores(document.getElementsByTagName("input"));

        if (confirm("Todo validado correctamente.")) {

            //Se realiza la petición a la API 
            //Si todo sale correcto, se recoge el usuario que devuelve la API
            //Se guarda en el localStorage y se redirige a index.html

            alert("Petición de usuario: \n email: " + email.value + " \n password: " + password.value);
            //document.getElementById("register-validation").submit();  

            fetch("http://localhost:8080/api/v0/users/login?email="+ email.value +"&password=" + password.value)
            .then(function (response) {
                if (response.ok) {
        
                    response.json().then(function (myJson) {

                        console.log(myJson);

                        sessionStorage.setItem('user', JSON.stringify(myJson));

                        window.location.href = "http://127.0.0.1:5500/index.html";

        
                    });
        
                } else {
                    console.log('Respuesta de red OK.');
                }
            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
                console.log('http://localhost:8080/api/v0/users/login?' + email.value + password.value);
            });

/*
            const logUser = new User(name, email.value, password.value, bornDate);


            //ahora guardamos el usuario en el sessionStorage
            sessionStorage.setItem('user', JSON.stringify(logUser));

            //recuperamos usuario del sessionStorage 
            var userReg = JSON.parse(sessionStorage.getItem('user'));

            console.log(userReg)

            window.location.href = "http://127.0.0.1:5500/index.html";
*/
        }

    }
}

/**************************************
 ********* VALIDAR REGISTRO ***********
 **************************************/
function validateRegistration() {

    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let repeatPassword = document.getElementById("repeatPassword");
    let bornDate = document.getElementById("bornDate");
    let agree = document.getElementById("agree");

    //si todo valida, enviamos petición de buscar usuario
    if (validateName(name) && validateMail(email) &&
        validatePassword(password) && validatePassword(repeatPassword) &&
        validateRepeatPassword(password, repeatPassword) && validateBornDate(bornDate) &&
        validateTerms(agree)) {

        if (confirm("Todo validado correctamente.")) {

            //Se realiza la petición a la API 
            //Si todo sale correcto, se recoge el usuario que devuelve la API (o el que se envió)
            //Se guarda en el localStorage y se redirige a index.html      



            /*

            const newUser = new User(name.value, email.value, password.value, bornDate.value);


            ahora guardamos el usuario en el sessionStorage
            sessionStorage.setItem('user', JSON.stringify(newUser));

            var userReg = JSON.parse(sessionStorage.getItem('user'));

            console.log(userReg)

         

            newUser.name = name;
            newUser.email = email;
            newUser.password = password;
            newUser.bornDate = bornDate;
             */

            /* 

            // Guardar el array en el localStorage

            // El arreglo:
            var array = [1, 2, 3];
            // Se guarda en localStorage despues de JSON stringificarlo 
            localStorage.setItem('myArray', JSON.stringify(array));

            // Obtener el arreglo de localStorage

            var array = localStorage.getItem('myArray');
            // Se parsea para poder ser usado en js con JSON.parse :)
            array = JSON.parse(array);

             */


            //document.getElementById("register-validation").submit();

        }


    }
}

/**************************************
 ****** VALIDAR EDITAR USUARIO ********
 **************************************/
function validateEditUser(event) {
    event.preventDefault();

    let name = document.getElementById("nameEdit");
    let password = document.getElementById("passwordEdit");
    let repeatPassword = document.getElementById("repeatpasswordEdit");

    //si todo valida, enviamos petición de buscar usuario
    if (validateName(name) && validatePassword(password) &&
        validatePassword(repeatPassword) && validateRepeatPassword(password, repeatPassword)) {

        //Se realiza la petición de modificacion a la API, recogiendo los valores del form y sessionStorage 
        //Si todo sale correcto, se recoge el usuario modificado que devuelve la API
        //Se guarda en el localStorage y se redirige a index.html

        var userModif = JSON.parse(sessionStorage.getItem('user'));
        userModif.name = name.value;
        userModif.password = password.value;

        userModif = new User(userModif.name, userModif.email, userModif.password, userModif.bornDate);

        console.log("Se crea el usuario: \n{" +
            "name: " + userModif.name + " \n" +
            "email: " + userModif.email + " \n" +
            "password: " + userModif.password + " \n" +
            "bornDate: " + userModif.bornDate + " \};");


        //se lanza el formulario 
        //document.getElementById("editUserForm").submit();

        //Si todo sale ok se guarda el usuario que devuelve la petición en el sessionStorage
        //y se redirecciona para index.html


        window.location.href = "http://127.0.0.1:5500/index.html";

    }
}


/**************************************
 ****** VALIDAR EDITAR PEERFIL ********
 **************************************/
function validateProfile(event) {

    event.preventDefault();

    var radioChecekd = false;

    let nick = document.getElementById("nickEdit");
    let raza = document.getElementById("razaEdit");
    let bornPetDate = document.getElementById("bornPetDate");
    let description = document.getElementById("descriptionProfile");
    let sexo = document.getElementsByName("sexo");

    for (i = 0; i < sexo.length; i++) {
        if (sexo[i].checked) {
            var valorSexo = sexo[i].value;
            radioChecekd = sexo[i].checked;           
        }       
    }
  

    if (validateName(nick) && radioChecekd && validateName(raza) &&
    validateBornDatePet(bornPetDate) && validateName(description)) {
        
        alert("Todo validado correctamente")
        //Si valida correctamente, se crea o edita el perfil
        alert("Se crea el perfil: \n{" +
        "nick: " + nick.value + " \n" +
        "sexo: " + valorSexo  + " \n" +
        "raza: " + raza.value + " \n" +
        "description: " + description.value + " \n" +
        "bornDate: " + bornPetDate.value + " \};");


    //se lanza el formulario 
    //document.getElementById("editProfileForm").submit();

    //Si todo sale ok se guarda el perfil y se añade a la lista de perfiles que devuelve la petición en el sessionStorage
    //y se redirecciona para index.html


    window.location.href = "http://127.0.0.1:5500/index.html";
        

    }

    else{
        alert("Debe cubrir todos los campos del formulario.")
    }

    
}


function validateBornDatePet(element) {

    let alert = document.getElementById("alert");
    let alertMessage = document.getElementById("alertMessage");
    let valor = element.value;
    let ano = parseInt(valor.substring(0, 4));
    let mes = parseInt(valor.substring(5, 7)) - 1;
    let dia = parseInt(valor.substring(8, valor.length));

    let fch = new Date(ano, mes, dia);
    //console.log(fch);
    //console.log(isNaN(fch));

    if (isNaN(fch)) {
        alert.style.display = "inline";
        alertMessage.innerHTML = "Error al seleccionar la fecha de nacimiento.";
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





/**************************************
 ************** COOKIES ***************
 **************************************/
function getCookie() {
    //Esta función la usamos para recuperar la cookie
    let cookie = document.cookie;
    let resultado = cookie.split('=');
    return resultado[1];
}

function checkCookie() {
    let mail = getCookie("email");

    if (mail === undefined) {
        document.getElementById("emailLogin").value = "";
    } else {
        document.getElementById("emailLogin").value = mail;
    }

}

