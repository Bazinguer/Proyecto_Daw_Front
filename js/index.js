window.onload = eventsLoad;
/***************************** EVENTOS ********************************/
function eventsLoad() {    
    if (window.location.href === "http://127.0.0.1:5500/index.html") {
        if (!sessionStorage.getItem("user")) {
            window.location.href = "http://127.0.0.1:5500/login.html";
        }
    }
    //Cargamos todolos eventos principales
    //evento logo
    document.getElementById("logoApp").addEventListener("click", loadTabPanel, true);
    //evento buscador principal
    document.getElementById("globalSearch").addEventListener("click", globalSearch, true);
    //evento Configuración
    document.getElementById("config").addEventListener("click", editConfigUser, true);
    //evento contacta
    document.getElementById("contacta").addEventListener("click", contacta, true);
    //evento cerrarSesión
    document.getElementById("logOut").addEventListener("click", logOut, true);
    //evento buscador nick
    document.getElementById("serchBynick").addEventListener("click", serchByNick, true);

    if (!sessionStorage.getItem("petprofiles") && !sessionStorage.getItem("listpetprofiles") &&
     sessionStorage.getItem("user")) {
        choosePetProfile(false);
        choosePetProfile(true);
    } else if (!sessionStorage.getItem("petprofiles") && sessionStorage.getItem("listpetprofiles") &&
     sessionStorage.getItem("user")) {
        choosePetProfile(true);
    } else {
        loadTabPanel();
    }

    cardColumn();
}
/*************************************************************/

function cardColumn() {

    //evento crearPerfil (+)
    document.getElementById("createProfile").addEventListener("click", createProfile, true);
    //evento cambioPerfil (V)
    document.getElementById("changeProfile").addEventListener("click", changeProfile, true);
    //evento deletePerfil (X)
    document.getElementById("deleteProfile").addEventListener("click", deleteProfile, true);

    //evento logo
    document.getElementById("imgProfile").addEventListener("click", loadTabPanel, true);

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
function globalSearch() {
    //primero cargamos formulario de busqueda,y evento del btn de búsqueda 
    //si lanza busqueda, primero cargarmos la card,
    //hacemos peticion a Api y se muestra resultado con innerHtml con tantas card como resultados arroje la APi

    var adduser = [];

    fetch('globalSearch.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento
                    document.getElementById("btnserchGlobal").addEventListener("click", function () {
                        event.preventDefault();

                        let raza = document.getElementById("inputRaza");
                        let sexo = document.getElementById("inputSexo");
                        let edad = document.getElementById("inputEdad");
                        //lanzamos peticion para traer resultados de la búsqueda                    

                        if (raza.value === null || raza.value === undefined) raza.value = "";
                        if (sexo.value === null || sexo.value === undefined) sexo.value = "";
                        if (sexo.value == "Hembra") sexo.value = "h";
                        if (sexo.value == "Macho") sexo.value = "m";
                        if (sexo.value == "Cualquier") sexo.value = "";
                        if (edad.value === null || edad.value === undefined) petBorndDate.value = 0;


                        fetch("http://localhost:8080/api/v0/petprofile/listsearch?raza=" + raza.value + "&sexo=" + sexo.value + "&petBorndDate=" + edad.value)
                            .then(function (response) {
                                if (response.ok) {

                                    response.json().then(function (myJson) {

                                        adduser = myJson;
                                        console.log(myJson);
                                        var string = "";

                                        for (let i = 0; i < adduser.length; i++) {
                                            let element = myJson[i];

                                            console.log(element.imgProfile);

                                            //addPhotos            
                                            string += "<div class='col-sm-3 mt-2'>";
                                            string += "<div class='card'";
                                            string += "<a href='#' onClick='loadTabPanelVisit(event)'>";
                                            string += "<img src='" + element.imgProfile + "' id='" + element.id + "'  class='card-img-top' alt='...' >";
                                            string += "</a>";
                                            string += "</div>";
                                            string += "</div>";
                                        }

                                        //se van añadiendo las cartas de los perfiles al div id=resultadoBusqueda
                                        document.getElementById("addPhotosSerched").innerHTML = string;

                                    });

                                } else {
                                    console.log('Respuesta de red OK.');
                                    document.getElementById("addPhotosSerched").innerHTML = "No existen más resultados";
                                }
                            })
                            .catch(function (error) {
                                console.log('Hubo un problema con la petición Fetch:' + error.message);
                                document.getElementById("addPhotosSerched").innerHTML = "No existen más resultados";
                            });

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
function loadTabPanelVisit(event) {

    var element = event.target;

    fetch('tabPanel.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    //cargamos eventos que tiene el fragmento                    
                    document.getElementById("createProfile").addEventListener("click", createProfile, true);
                    document.getElementById("photos-tab").addEventListener("click", searchPhotos(element.id), true);

                    document.getElementById("editProfile").style.display = "none";


                    fetch('http://localhost:8080/api/v0/petprofile?petProfileId=' + element.id)
                        .then(function (response) {
                            if (response.ok) {

                                response.json().then(function (myJson) {
                                    console.log(myJson);


                                    fetch('http://localhost:8080/api/v0/follow?idFollow=' + myJson.id)
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

                                    fetch('http://localhost:8080/api/v0/follow/listfollow?idFollow=' + myJson.id)
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

                                    let year = parseInt(myJson.petBornDate.substring(0, 4));
                                    let today = new Date();
                                    let yearActual = today.getFullYear();
                                    let agePet = yearActual - year;

                                    if (myJson.sexo == "h") {
                                        document.getElementById("valueSex").innerHTML = "<strong>" + myJson.sexo + "</strong>";
                                    } else {
                                        document.getElementById("valueSex").innerHTML = "<strong>" + myJson.sexo + "</strong>";
                                    }
                                    document.getElementById("valueRaza").innerHTML = "<strong>" + myJson.raza + "</strong>";
                                    document.getElementById("valueAge").innerHTML = "<strong>" + agePet + "</strong>";
                                    document.getElementById("valueNickCard").innerHTML = "<strong>" + myJson.nick + "</strong>";
                                    document.getElementById("valueCard").innerHTML = "<strong>" + myJson.description + "</strong>";
                                    document.getElementById("valueNickColum").innerHTML = "@" + myJson.nick;

                                });

                            } else {
                                console.log('Respuesta de red OK.');
                                document.getElementById("listPets").innerHTML = "";
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
function serchByNick(event) {
    event.preventDefault();
    let nick = document.getElementById("searchNick");

    if (nick.value == "" || nick.value == null) {
        alert("El nick no puede estar vacío.")
    } else {

        fetch("http://localhost:8080/api/v0/petprofile/nick?petNick=" + nick.value)
            .then(function (response) {
                if (response.ok) {

                    response.json().then(function (myJson) {

                        var string = "";
                        string += "<div class='col-sm-3 mt-2'>";
                        string += "<div class='card'";
                        string += "<a href='#' onClick='loadTabPanelVisit(event)'>";
                        string += "<img src='" + myJson.imgProfile + "' id='" + myJson.id + "'  class='card-img-top' alt='...' >";
                        string += "</a>";
                        string += "</div>";
                        string += "</div>";

                        document.getElementById("changeContent").innerHTML = string;

                    });

                } else {
                    console.log('Respuesta de red OK.');
                    document.getElementById("changeContent").innerHTML = "No existen resultados";
                }
            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
                document.getElementById("").innerHTML = "No existen resultados";
            });

    }

}
function createProfile() {

    fetch('formcreateProfile.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText

                    let nick = document.getElementById("nickEdit");
                    let raza = document.getElementById("razaEdit");
                    let bornPetDate = document.getElementById("bornPetDate");
                    let description = document.getElementById("descriptionProfile");
                    let sexo = document.getElementsByName("sexo");

                    if (sessionStorage.getItem("petprofiles")) {

                        let petprofile = JSON.parse(sessionStorage.getItem('petprofiles'));

                        let ano = parseInt(petprofile.petBornDate.substring(0, 4));
                        let mes = parseInt(petprofile.petBornDate.substring(5, 7));
                        let dia = parseInt(petprofile.petBornDate.substring(8, petprofile.length));
                        let fch = new Date(ano, mes, dia);                      

                        if (!isNaN(fch)){                         

                            if(dia < 10){ 
                                dia = "0"+dia;
                            }
                         
                            bornPetDate.value = ano+"-"+mes+"-"+dia;
                        }

                        for (let index = 0; index < sexo.length; index++) {
                            let element = sexo[index];

                            if (element.value == "h") {
                                element.checked = true;
                                
                            } else if(element.value == "m"){
                                element.checked = true;
                            }
                            
                        }

                        sexo.value = petprofile.sexo;

                        nick.value = petprofile.nick;                      
                        raza.value = petprofile.raza;                        
                        description.value = "";

                    }

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
function editConfigUser() {
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
function loadTabPanel() {

    fetch('tabPanel.html')
        .then(function (response) {
            if (response.ok) {

                response.text().then(function (miText) {

                    document.getElementById("changeContent").innerHTML = miText
                    //recuperamos valores del sessionStorage = petprofiles para pintarlos                        
                    let infoProfile = JSON.parse(sessionStorage.getItem("petprofiles"));
                    //cargamos eventos que tiene el fragmento                    
                    document.getElementById("createProfile").addEventListener("click", createProfile, true);
                    document.getElementById("editProfile").addEventListener("click", editDescriptionPet, true);
                    document.getElementById("editProfile").style.display = "initial";
                    document.getElementById("photos-tab").addEventListener("click", searchPhotos(infoProfile.id), true);                   

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
function editDescriptionPet() {
    createProfile();

}
function searchPhotos(id) {

    var addModal = [];
    //  var infoProfile = JSON.parse(sessionStorage.getItem("petprofiles"));
    console.log(id)
    var url = 'http://localhost:8080/api/v0/photo/photolist?phetProfileId=' + id;
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

    if (element.id === "btnInsertComent") {
        comment = document.getElementById("aaa");
        valorComment = comment.value;

    } else if (element.id === "btnInsertComent2") {
        comment = document.getElementById("bbb");
        valorComment = comment.value;

    }

    if (valorComment === "" || valorComment === undefined || valorComment === null) {
        alert("Debe escribir algo para poder publicarlo.")
    } else {

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

                    loadPhotoComments(parseInt(myText));
                });

            })
            .catch(function (error) {
                console.log('Hubo un problema con la petición Fetch:' + error.message);
            });
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