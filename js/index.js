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

    if (!sessionStorage.getItem("petprofiles") && !sessionStorage.getItem("listpetprofiles") && sessionStorage.getItem("user")) {
        choosePetProfile(false);
        choosePetProfile(true);
    } else if (!sessionStorage.getItem("petprofiles") && sessionStorage.getItem("listpetprofiles") && sessionStorage.getItem("user")) {
        choosePetProfile(true);
    } else {
        loadTabPanel();
    }
    
    cardColumn();
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

function deleteProfile() {

    let customProfile = document.getElementsByName("custom");

    for (i = 0; i < customProfile.length; i++) {
        if (customProfile[i].checked) {
            var valorCustomId = customProfile[i].value;
            var valorCustom = customProfile[i].id;
        }
    }

    if (confirm("¿Está seguro que desea borrar el perfil seleccionado?")) {
        var url = "http://localhost:8080/api/v0/petprofile?id=" + valorCustomId + "&nick=" + valorCustom;
        fetch(url, {
                method: 'DELETE',
            }).then(function (response) {
                if (response.ok) {

                    response.text().then(function (myText) {

                        console.log(myText);
                        sessionStorage.removeItem("petprofiles");
                        sessionStorage.removeItem("listpetprofiles");
                        location.reload();
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

function editConfig() {
    //primero cargamos formulario de modificar,y evento del btn modificar y salir 
    //si modifica, lanzamos peticion a Api    
    fetch('formEditUser.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento
                    document.getElementById("btnModificar").addEventListener("click", validateEditUser, true);
                    document.getElementById("btnSalir").addEventListener("click", function () {
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
                        sessionStorage.removeItem("listpetprofiles");
                        sessionStorage.setItem('listpetprofiles', JSON.stringify(myJson));
                        location.reload();
                    });

                } else {
                    console.log('Respuesta de red OK.');
                    createProfile();
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

                                fetch('http://localhost:8080/api/v0/petprofile?petProfileId=' + listpetprofiles[i].id)
                                    .then(function (response) {
                                        if (response.ok) {

                                            response.json().then(function (myJson) {
                                                console.log(myJson);
                                                sessionStorage.removeItem('petprofiles');
                                                sessionStorage.setItem('petprofiles', JSON.stringify(myJson));
                                                location.reload();
                                            });

                                        } else {
                                            console.log('Respuesta de red OK.');
                                            document.getElementById("listPets").innerHTML = "";
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

    fetch('tabPanel.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento                    
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
                            document.getElementById("valueSeguidos").innerHTML = "<strong>0</strong>";
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
                            document.getElementById("valueSeguidores").innerHTML = "<strong>0</strong>";
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

    var addModal = [];
    var infoProfile = JSON.parse(sessionStorage.getItem("petprofiles"));
    console.log(infoProfile.id)
    var url = 'http://localhost:8080/api/v0/photo/photolist?phetProfileId=' + infoProfile.id;
    fetch(url)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (myJson) {

                    addModal = myJson;
                    console.log(myJson);
                    var string = "";

                    for (let i = 0; i < addModal.length; i++) {
                        let element = myJson[i];

                        console.log(element.url);

                        //addPhotos     data-toggle='modal' data-target='#exampleModal'"                 
                        string += "<div class='col-sm-3 mt-2'>";
                        string += "<div class='card' data-toggle='modal' data-target='#exampleModalCenter'";
                        string += "<a href='#' onClick='loadModel(event)'>";
                        string += "<img src='" + element.url + "' id='" + element.id + "'  class='card-img-top' alt='...' name='photo_modal'>"; // name='fotoModal'
                        string += "</a>";
                        string += "</div>";
                        string += "</div>";
                    }

                    document.getElementById("addPhotos").innerHTML = string;

                });

            } else {
                console.log('Respuesta de red OK.');
                document.getElementById("addPhotos").innerHTML = "";
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });

}

function loadModel(event) {
    var element = event.target;
    var valorImg = document.getElementById(element.id).getAttribute("src");
    document.getElementById("sendphotoModal").setAttribute("src", valorImg);
    loadPhotoComments(element.id);

}

function loadPhotoComments(id) {

    fetch('http://localhost:8080/api/v0/photo?photoId=' + id)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (myJson) {
                    console.log(myJson);
                    sessionStorage.removeItem('photo');
                    sessionStorage.setItem('photo', JSON.stringify(myJson));
                });

            } else {
                console.log('Respuesta de red OK.');
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });

    fetch('http://localhost:8080/api/v0/comments/commentslist?photoId=' + id)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (myJson) {

                    var string = "";

                    console.log(myJson);

                    for (let index = 0; index < myJson.length; index++) {
                        let element = myJson[index];
                        let nick = element.petProfile.nick;
                        let comment = element.comment;

                        string += "<p class='card-text p-2' style='font-size: 1em;" +
                            "box-shadow: '2px 4px 10px 0 rgba(0, 34, 51, 0.05), 2px 4px 10px 0 rgba(0, 34, 51, 0.05)';" +
                            "border-radius: 0.15rem;>";
                        string += "<strong class='text-muted pr-1'>";
                        string += "@" + nick + "</strong>" + comment + "</p>";
                    }               

                    document.getElementById("listComments").innerHTML = string;
                    document.getElementById("btnInsertComent").addEventListener("click", insertComment, true);
                    document.getElementById("btnInsertComent2").addEventListener("click", insertComment, true);

                });

            } else {
                console.log('Respuesta de red OK.');
                document.getElementById("listComments").innerHTML = "";

                document.getElementById("btnInsertComent").addEventListener("click", insertComment, true);
                document.getElementById("btnInsertComent2").addEventListener("click", insertComment, true);
            }
        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
            document.getElementById("listComments").innerHTML = "";

            document.getElementById("btnInsertComent").addEventListener("click", insertComment, true);
            document.getElementById("btnInsertComent2").addEventListener("click", insertComment, true);
        });


}

function insertComment(event) {

    var element = event.target;


    alert(element.id);

    if (element.id === "btnInsertComent") {
        comment = document.getElementById("aaa");
        valorComment = comment.value;

    } else if (element.id === "btnInsertComent2") {
        comment = document.getElementById("bbb");
        valorComment = prub.value;

    }


    var photo = JSON.parse(sessionStorage.getItem('photo'));
    var petprofile = JSON.parse(sessionStorage.getItem('petprofiles'));

    var insertComment = {
        "comment": valorComment,
        "petProfile": petprofile,
        "photo": photo,      
    }

    var url = 'http://localhost:8080/api/v0/comments';

    fetch(url, {
            method: 'POST',
            body: JSON.stringify(insertComment),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {

            response.text().then(function (myText) {

                alert(myText);

                loadPhotoComments(parseInt(myText));
            });

        })
        .catch(function (error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        });


}

function cardColumn() {

    //evento crearPerfil (+)
    document.getElementById("createProfile").addEventListener("click", createProfile, true);
    //evento cambioPerfil (V)
    document.getElementById("changeProfile").addEventListener("click", changeProfile, true);
    //evento deletePerfil (X)
    document.getElementById("deleteProfile").addEventListener("click", deleteProfile, true);

    var listprofiles = JSON.parse(sessionStorage.getItem("listpetprofiles"));
    var petProfile = JSON.parse(sessionStorage.getItem("petprofiles"));

    var string = "";

    if (sessionStorage.getItem("listpetprofiles")) {
        for (let i = 0; i < listprofiles.length; i++) {
            string += "<div class='form-check d-flex'>";
            string += "<input type='radio' class='form-check-input' name='custom' value=" + listprofiles[i].id + " id='" + listprofiles[i].nick + "'>";
            string += "<label class='form-check-label'>" + listprofiles[i].nick + "</label>";
            string += "</input></div>";

            if (petProfile.nick === listprofiles[i].nick) {
                var valorRadio = listprofiles[i].nick;
                var valorIdRadio = listprofiles[i].id;
            }
        }
    }
    document.getElementById("forProfiles").innerHTML = string;

    var radioButton = document.getElementById("" + valorRadio + "");
    if (radioButton.value === String(valorIdRadio)) {
        radioButton.checked = true;
    }

}

function changeProfile() {
    //se mandará una petición a la Api para conseguir el perfil 
    //si todo sale bien se cargará la nueva info en pantalla

    let customProfile = document.getElementsByName("custom");

    for (i = 0; i < customProfile.length; i++) {
        if (customProfile[i].checked) {
            var valorCustomId = customProfile[i].value;
        }
    }

    if (confirm("Está seguro que quiere cambiar de perfil?")) {
        console.log(sessionStorage.getItem("changeprofile"));
        fetch('http://localhost:8080/api/v0/petprofile?petProfileId=' + valorCustomId)
            .then(function (response) {
                if (response.ok) {

                    response.json().then(function (myJson) {
                        sessionStorage.removeItem('petprofiles');
                        sessionStorage.setItem('petprofiles', JSON.stringify(myJson));
                        location.reload();
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