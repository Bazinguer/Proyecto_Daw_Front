window.onload = eventsLoad;
/***************************** EVENTOS ********************************/

function eventsLoad() {
    console.log(window.location.href);

    if (window.location.href === "http://127.0.0.1:5500/index.html") {
        if (!sessionStorage.getItem("user")) {
            window.location.href = "http://127.0.0.1:5500/login.html";
        }
    }

    //Cargamos todolos eventos
    //evento logo
    document.getElementById("logoApp").addEventListener("click", loadTabPanel, true);
    //evento buscador principal
    document.getElementById("globalSearch").addEventListener("click", globalSearch, true);
    //evento Configuración
    document.getElementById("config").addEventListener("click", editConfig, true);
    //evento contacta
    document.getElementById("contacta").addEventListener("click", contacta, true);
    //evento cerrarSesión
    document.getElementById("logOut").addEventListener("click", logOut, true);
    //evento buscador nick
    document.getElementById("serchBynick").addEventListener("click", serchByNick, true);
    //evento crearPerfil (+)
    document.getElementById("createProfile").addEventListener("click", createProfile, true);
    //evento cambioPerfil (V)
    document.getElementById("changeProfile").addEventListener("click", changeProfile, true);
    //evento deletePerfil (X)
    document.getElementById("deleteProfile").addEventListener("click", deleteProfile, true);


    if (!sessionStorage.getItem("petprofiles") && !sessionStorage.getItem("listpetprofiles") && sessionStorage.getItem("user")) {
        choosePetProfile(false);
        choosePetProfile(true);
    } else if (!sessionStorage.getItem("petprofiles") && sessionStorage.getItem("listpetprofiles") && sessionStorage.getItem("user")) {
        choosePetProfile(true);       
    } else{
        loadTabPanel();
    }


}


function globalSearch() {
    //primero cargamos formulario de busqueda,y evento del btn de búsqueda 
    //si lanza busqueda, primero cargarmos la card,
    //hacemos peticion a Api y se muestra resultado con innerHtml con tantas card como resultados arroje la APi

    fetch('globalSearch.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento
                    document.getElementById("btnserchGlobal").addEventListener("click", function () {
                        //event.preventDefault();

                        let raza = document.getElementById("inputRaza");
                        let sexo = document.getElementById("inputSexo");
                        let edad = document.getElementById("inputEdad");
                        //lanzamos peticion para traer resultados de la búsqueda
                        alert("Se busca por raza, sexo y edad: " + "\n" +
                            raza.value + ", " + sexo.value + ", " + edad.value)

                        //se van añadiendo las cartas de los perfiles al div id=resultadoBusqueda
                        document.getElementById("resultadoBusqueda").innerHTML = "No existen más resultados";
                        return true;


                    }, true);

                });

            } else {
                console.log('Respuesta de red OK.');
                return false;
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            return false;
        });



}

function serchByNick(event) {
    event.preventDefault();
    let nick = document.getElementById("searchNick");

    if (nick.value == "" || nick.value == null) {
        alert("El nick no puede estar vacío.")
    } else {
        alert("buscando");

        //document.getElementById("editUserForm").submit();
    }

}

function createProfile() {

    fetch('formcreateProfile.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento 
                    //eventos de los botonos Aceptar (envía form) y volver.
                    //document.getElementById("").addEventListener("click", saveChanges, true);
                    //cargamos eventos que tiene el fragmento
                    document.getElementById("btnCreateProfile").addEventListener("click", validateProfile, true);
                    document.getElementById("btnVolver").addEventListener("click", function () {
                        loadTabPanel();
                    }, true);

                });

            } else {
                console.log('Respuesta de red OK.');
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });


}

function changeProfile() {
    //se mandará una petición a la Api para conseguir el perfil 
    //si todo sale bien se cargará la nueva info en pantalla
}

function deleteProfile() {
    if (confirm("¿Está seguro que desea borrar el perfil seleccionado?")) {
        //si confirmar se envia el delete a la APi y se quita de la lista
    }
}

function editConfig() {
    //primero cargamos formulario de modificar,y evento del btn modificar y salir 
    //si modifica, lanzamos peticion a Api
    //si sale ok enseñamos aviso de que se cambió correctamente y cargamos tabPanel

    fetch('formEditUser.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento
                    document.getElementById("btnModificar").addEventListener("click", validateEditUser, true);
                    document.getElementById("btnSalir").addEventListener("click", function () {
                        //window.location.href = "http://127.0.0.1:5500/index.html"; 
                        loadTabPanel();
                    }, true);


                });

            } else {
                console.log('Respuesta de red OK.');
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });

}

function contacta() {

    fetch('contacta.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento
                    document.getElementById("closeContact").addEventListener("click", function () {
                        //window.location.href = "http://127.0.0.1:5500/index.html";
                        loadTabPanel();
                    }, true);

                });

            } else {
                console.log('Respuesta de red OK.');
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });


}

function logOut() {
    //Se elimina el sessionstorage y se envia a login.html
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("listpetprofiles");
    sessionStorage.removeItem("petprofiles");
    sessionStorage.clear();
    window.location.href = "http://127.0.0.1:5500/login.html";

}

//Elegir Perfil Mascota
function choosePetProfile(booleano) {
    //recuperamos usuario del sessionStorage 
    var userReg = JSON.parse(sessionStorage.getItem('user'));

    if (!booleano) {
        fetch('http://localhost:8080/api/v0/petprofile/listprofile?userId=' + userReg.id)
            .then(function (response) {
                if (response.ok) {

                    response.json().then(function (myJson) {

                        console.log(myJson);
                        sessionStorage.setItem('listpetprofiles', JSON.stringify(myJson));
                        location.reload();
                    });

                } else {
                    console.log('Respuesta de red OK.');
                }
            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
    } else {


        fetch('chooseProfile.html')
            .then(function (response) {
                if (response.ok) {

                    response.text().then(function (miText) {

                        document.getElementById("changeContent").innerHTML = miText

                        var listpetprofiles = JSON.parse(sessionStorage.getItem("listpetprofiles"));

                        let string = "<div class='col-md-3 text-center mx-auto'><h2 class='h1-responsive font-weight-bold my-4'>Perfil</h2><ul class='list-unstyled mb-0'>";
                        for (let i = 0; i < listpetprofiles.length; i++) {
                            string += "<li class='pt-2'><button href='' class ='selectPetprofile btn btn-outline-secondary'> @" + listpetprofiles[i].nick + "</button></li>";
                        }
                        string += "</ul></div>";
                        document.getElementById("listPets").innerHTML = string;

                        let arrayElments = document.getElementsByClassName("selectPetprofile");
                        console.log(arrayElments);
                        for (let i = 0; i < arrayElments.length; i++) {
                            arrayElments[i].addEventListener("click", function () {
                                //peticion a getPetProfile by id
                                //gardamos en petprofile session   
                                console.log(listpetprofiles[i].id);

                                fetch('http://localhost:8080/api/v0/petprofile?petProfileId=' + listpetprofiles[i].id)
                                    .then(function (response) {
                                        if (response.ok) {

                                            response.json().then(function (myJson) {
                                                console.log(myJson);
                                                sessionStorage.setItem('petprofiles', JSON.stringify(myJson));
                                                location.reload();
                                            });

                                        } else {
                                            console.log('Respuesta de red OK.');
                                            if (confirm("Hubo un problema al cargar los perfiles. Inténtalo de nuevo o sale de la App")) {
                                                logOut();
                                            } else {
                                                location.reload();
                                            };
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log('Hubo un problema con la petición Fetch:' + error.message);
                                    });

                            }, true);
                        }

                    });

                } else {
                    console.log('Respuesta de red OK.');
                }
            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
    }

}

//carga el tabPanel de la página
function loadTabPanel() {

    //Se deberá lanzar una petición a la Api para cargar la info del perfil y sus fotos   
    //Si no se trata del perfil almacenado en la sesión se deshanilitarán el edit del perfil y la opcion de eliminar/subir fotos
    fetch('tabPanel.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento 
                    //evento editarPerfil ([->])
                    document.getElementById("createProfile").addEventListener("click", createProfile, true);
                    document.getElementById("photos-tab").addEventListener("click", searchPhotos, true);

                    //recuperamos valores del sessionStorage = petprofiles para pintarlos                        
                    let infoProfile = JSON.parse(sessionStorage.getItem("petprofiles"));

                    let year = parseInt(infoProfile.petBornDate.substring(0, 4));
                    let today = new Date();
                    let yearActual = today.getFullYear();
                    let agePet = yearActual - year;

                    if (infoProfile.sexo == "h") {
                        document.getElementById("valueSex").innerHTML = "<strong>" + infoProfile.sexo + "</strong>";
                    } else {
                        document.getElementById("valueSex").innerHTML = "<strong>" + infoProfile.sexo + "</strong>";
                    }
                    document.getElementById("valueRaza").innerHTML = "<strong>" + infoProfile.raza + "</strong>";
                    document.getElementById("valueAge").innerHTML = "<strong>" + agePet + "</strong>";

                    document.getElementById("valueNickCard").innerHTML = "<strong>" + infoProfile.nick + "</strong>";
                    document.getElementById("valueCard").innerHTML = "<strong>" + infoProfile.description + "</strong>";

                    document.getElementById("valueNickColum").innerHTML = "@" + infoProfile.nick;    
                    

                    fetch('http://localhost:8080/api/v0/follow?idFollow=' + infoProfile.id)
                        .then(function (response) {
                            if (response.ok) {

                                response.json().then(function (myJson) {

                                    document.getElementById("valueSeguidos").innerHTML = "<strong>" + myJson.length + "</strong>";

                                });

                            } else {
                                console.log('Respuesta de red OK.');
                            }
                        })
                        .catch(function (error) {
                            console.log('Hubo un problema con la petición Fetch:' + error.message);
                        });

                    fetch('http://localhost:8080/api/v0/follow/listfollow?idFollow=' + infoProfile.id)
                        .then(function (response) {
                            if (response.ok) {

                                response.json().then(function (myJson) {

                                    document.getElementById("valueSeguidores").innerHTML = "<strong>" + myJson.length + "</strong>";

                                });

                            } else {
                                console.log('Respuesta de red OK.');
                            }
                        })
                        .catch(function (error) {
                            console.log('Hubo un problema con la petición Fetch:' + error.message);
                        });

                });

            } else {
                console.log('Respuesta de red OK.');
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });

}


function searchPhotos() {
    alert("pulsado");
    //Se lanza petición de busqueda a la api y se cargan todas las fotos del perfil en el que nos encontremos
}