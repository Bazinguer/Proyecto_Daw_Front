window.onload = eventsLoad;

/***************************** EVENTOS ********************************/
//  <div class="container-fluid" id="changeContent">

function eventsLoad() {
    console.log(window.location.href);

    if (window.location.href === "http://127.0.0.1:5500/index.html") {
        if (!sessionStorage.getItem("user")) {
            window.location.href = "http://127.0.0.1:5500/login.html";
        }
    }

    //Cargamos todolos eventos
    //evento logo
    document.getElementById("logoApp").addEventListener("click",loadTabPanel, true);  
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

    loadTabPanel();


}

function globalSearch(){
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

function serchByNick(event) {
    event.preventDefault();
    let nick = document.getElementById("searchNick");

      if (nick.value == "" || nick.value == null){
          alert("El nick no puede estar vacío.")
      }
      else{
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
                  document.getElementById("btnVolver").addEventListener("click", function() {
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
    if(confirm("¿Está seguro que desea borrar el perfil seleccionado?")){
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
                document.getElementById("btnSalir").addEventListener("click", function() {
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
    sessionStorage.clear();
    window.location.href = "http://127.0.0.1:5500/login.html"; 

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
                    document.getElementById("photos-tab").addEventListener("click",searchPhotos,true);

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