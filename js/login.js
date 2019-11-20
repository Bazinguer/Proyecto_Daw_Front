<<<<<<< HEAD

=======
window.onload = eventsLoad;

function eventsLoad() {
	checkCookie();
	document.getElementById("btnLogin").addEventListener("click", validateLogin, true);
}

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

		if (confirm("Todo validado correctamente.")) {

			alert("Petición de usuario: \n email: " + email.value + " \n password: " + password.value);

			//document.getElementById("register-validation").submit();        
		}

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
		alertMessage.innerHTML = "El correo introducido no es válido.";
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
		alertMessage.innerHTML = "La contraseña no puede ir vacía."
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

function checkRemember(element) {
	var isChecked = element.checked;

	if (isChecked) {
		return true;

	} else {
		return false;
	}
}

function getCookie() {
	//Esta función la usamos para recuperar la cookie
	var cookie = document.cookie;
	var resultado = cookie.split('=');
	return resultado[1];
}

function checkCookie() {
	var mail = getCookie("email");

	if (mail === "undefined") {
		document.getElementById("emailLogin").value = getCookie("email");
	} else {
		document.getElementById("emailLogin").value = mail;
	}

}
>>>>>>> master
