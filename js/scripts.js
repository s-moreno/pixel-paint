/**
  DESARROLLO WEB EN ENTORNO CLIENTE (DWEC)
  UD03 - TAREA EVALUATIVA 01 (JUEGO DE PINTAR CELDAS)
  SERGIO MORENO SANCHEZ
  09/12/2022
 */

'use strict'

/* Cargar jQuery */
$(document).ready(function() {

/********************************
  1.- INTERFAZ DE ACCESO AL JUEGO
*********************************/

  // MAIN ---
  // parsear el json con jQuery y añadir como string al localStorage
  $.getJSON("model/usuarios.json", function(data){
    localStorage.setItem("usuarios", JSON.stringify(data));
  });
  // Colorar el título
  colorearTitulo();
  
  // si no existe cookie, nos devuelve a la página de inicio (login)
  // así evitamos que alguien ingrese al juego ingresando la url directamente
  if (location.pathname === "/juego.html" && document.cookie !== "login=true") {
    window.open("/","_self");
  }


  /*
    GESTION DE EVENTOS:
      -click boton
      -click inputs del formulario
  */

  /* BOTON CLICK:
      + obtiene nombre y usuario del formulario
      + llama a las funciones de validación y si 
        la validación es correcta, abre la página del juego
  */
  $("#btn-login").click(function() { 
      let usuario = $("#user").val();
      let contraseina = $("#pass").val();

      if (validarContraseina(contraseina)){
        let resultado = validarLogin(usuario, contraseina)
        console.log(resultado);
        if (resultado){
          // creamos cookie de sesión
          document.cookie = "login=true"; //duración hasta que se cierre el navegador
          // abrir la página del juego
          window.open("juego.html","_self");
        } else {
          // mostramos mensaje de error
          borrarMessage();
          $("#btn-login").after(`<label id="message" class="error"><i class="fa-solid fa-triangle-exclamation big red"></i>El usuario no está registrado</label>`);
        }
      }
  });

  // USUARIO INPUT CLICK: borramos el mesanje de aviso al hacer click.
  $("#user").click(function(){
    borrarMessage();
  });

  // CONTRASEÑA INPUT CLICK: borramos el mesanje de aviso al hacer click.
  $("#pass").click(function(){
    borrarMessage();
  });
  
  /*
    FUNCIONES:
      - validarCrontraseina(pass)
      - validarLogin(user, pass)
      - borrarMessage()
      - colorearTitulo()
  */

  /*
    Función para validar el formato de la contraseña
      - Contraseña: solo puede contener caracteres alfanuméricos, es decir, 
        números del 0 al 9 y letras de la A-Z en mayúscula o minúscula.
      - Si la contraseña tuviera un carácter especial de la siguiente lista, 
        mostrad un mensaje diciendo que la contraseña no coincide 
        y saca por pantalla el caracter especial.
    
    Parámetros de entrada: String de contraseña
    Parámetros de salida: boolean (true para formato válido)
  */
  function validarContraseina(pass) {
    let expRegValida = /^[A-Za-z1-9]+$/;
    let expRegEspecial = /[\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\¿\@\[\\\]\^\_\`\{]+/;
    let validado = true;

    let matches = expRegEspecial.exec(pass);

    if (matches != null) {
      borrarMessage()
      $("#pass").after(`<label id="message" class="warning"><i class="fa-solid fa-triangle-exclamation big"></i>Contraseña incorrecta. El caracter '${matches[0]}' no es válido</label>`);
      validado = false;
    } else if (!expRegValida.test(pass)) {
      borrarMessage();
      $("#pass").after(`<label id="message" class="warning"><i class="fa-solid fa-triangle-exclamation big"></i>Contraseña incorrecta. Utiliza caracteres alfanuméricos </label>`);
      validado = false;
    } 
    return validado;
  }

  /*
    Función para validar usuario y contraseña.
      - Compara con el localStorage si el usuario existe, y si tiene la misma contraseña
    
    Parámetros de entrada: String de usuario y String de contraseña
    Parámetros de salida: boolean (true si es validado)
  */
  function validarLogin(user, pass) {
    let validado = false;
    // parseamos los usuarios del localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    // bucle buscando coincidencia de usuario y contraseña
    usuarios.forEach(element => {
      if (element.usuario == user && element.contraseña == pass) {
        validado = true;
      }
    });
    return validado;
  }

  //borra el elemento con id #message que hemos creado nosotros.
  function borrarMessage() {
    $("#message").remove();
  }

  /**
   * Función que colorea las letras de un título de dirente color
   */
   function colorearTitulo() {
    var titulo = $(".coloreado").text();
    $(".coloreado").text("");
    var arrayColores = ["rojo", "verde", "amarillo", "azul"]
    var contador = 0;
    for (let i = 0; i < titulo.length; i++) {
      if (contador == arrayColores.length) {
        contador = 0;
      }
      $(".coloreado").append(`<span class="${arrayColores[contador]}">${titulo[i]}</span>`)
      contador++;
    }
  }

  /*************************
    2.- INTERFAZ DEl JUEGO
  **************************/
  
  // Constantes y variables:
  const filas = 30;
  const columnas = 30;
  var clicked = false;
  var color = "white";
  
  /*
    FUNCIONES:
      - crearLienzo()
      - controlClick(td)
      - pintarCelda(td)
      - colorActivado(td)
  */


  /**
   * Función que genera una tabla y la pinta en el html para ser usada de lienzo.
   *  - El tamaño será según las constantes "filas" y "columnas".
   *  - A su vez, se generan los eventos para cada celda (click y mouseover)
   * 
   * Parámetro de salida: un objeto tabla.
   */

  function crearLienzo() {
    let tr, td;

    let tabla = document.createElement("table"); //creamos la tabla
    tabla.setAttribute("id", "matriz");

    for (let i = 1; i <= filas; i++){
      tr = document.createElement("tr"); //creamos una fila
      for (let i = 1; i <= columnas; i++){
        td = document.createElement("td") //creamos una columna
        
        // añadimos gestión de evento al hacer click en la celda
        $(td).click(function () { 
          controlClick(this);
        });

        // añadimos gestión de evento al posar el ratón sobre la celda
        $(td).mouseover(function () { 
          if (clicked) {
            pintarCelda(this);
          }
        });
        tr.appendChild(td); //añadimos la columna a la fila
      }
      tabla.appendChild(tr); //añadimos la fila a tabla
    }
    return tabla;
  }

  /**
   * Función que controla el inicio y fin del click de pintado
   * Si se trata del inicio de pintado, pinta la celda.
   * 
   * Parámetro de entrada: objeto celda (td)
   */
  function controlClick(td) {
    if (clicked) {
      clicked = false;
    } else {
      clicked = true;
      pintarCelda(td);
    }
  }

 /**
   * Función que pinta la celda con el color seleccionado
   * 
   * Parámetro de entrada: objeto celda (td)
   */
  function pintarCelda(td) {
    if (clicked) {
      $(td).css("background-color", color); 
    }
  }

  /**
   * Función que marcha con un check el color seleccionado para pintar
   * 
   * Parámetro de entrada: objeto celda (td)
   */
  function colorActivado(td) {
    $("#activado").remove();
    $(td).append('<i id="activado" class="fa-solid fa-check"></i>');
  }

 /*
    EVENTOS
  */

  // Llamamos a la función "crearLienzo" y la añadimos la tabla que crea al html
  $("#juego").append(crearLienzo(filas, columnas));

  // eventos para determinar el color con qué pintar:
  $("#rojo").click(function () {
    color = $(this).css("background-color");
    clicked = false;
    $("#color").text("rojo");
    colorActivado(this);
  });

  $("#amarillo").click(function () { 
    color = $(this).css("background-color");
    clicked = false;
    $("#color").text("amarillo");
    colorActivado(this);
  });

  $("#verde").click(function () { 
    color = $(this).css("background-color");
    clicked = false;
    $("#color").text("verde");
    colorActivado(this);
  });

  $("#azul").click(function () { 
    color = $(this).css("background-color");
    clicked = false;
    $("#color").text("azul");
    colorActivado(this);
  });

  $("#blanco").click(function () { 
    color = "white";
    clicked = false;
    $("#color").text("blanco");
    colorActivado(this);
  });

  /**
   *  Eventos icono "reiniciar el lienzo"
   */

  // evento girar icono al entrar con el ratón
  $("#reiniciar").mouseenter(function () { 
    $(this).addClass("fa-spin");
  });

  // evento quita el giro al icono al salir el ratón
  $("#reiniciar").mouseleave(function () { 
    $(this).removeClass("fa-spin");
  });

  // evento que reinicia (pinta en blanco) el lienzo/matriz
  $("#reiniciar").click(function () { 
    for (let i=0; i < filas; i++) {
      for (let j=0; j < columnas; j++) {
        document.getElementById("matriz").rows[i].cells[j].style.backgroundColor = "white";
      }
    }
  });
});