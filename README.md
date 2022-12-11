# DWEC TAREA EVALUATIVA 3
+ Sergio Moreno Sanchez (smoreno@birt.eus)
+ 11/12/2022
+ F.P.G.S. Desarrollo de Aplicaciones Web. [birt.eus](https://www.birt.eus/ciclo-formativo/desarrollo-de-aplicaciones-web/)

## ENUNCIADO

_**Objetivo**: nuestro objetivo en esta tarea de evaluación es realizar un juego en el que el usuario pueda pintar celdas de diferentes colores. El juego se compondra de **dos páginas diferentes** y los criterios del juego se explican a continuación._

### Ejercicio 1: Interfaz de acceso al juego (primera página)
+ Será una interfaz de "login" en la que habrá un formulario con dos campos de texto (Usuario y Contraseña) y un botón de enviar.
+ Por otro lado, tenéis adjunto un fichero JSON con los datos de nombres y contraseñas validos.
+ Al iniciarse la web, tendréis que cargar los datos del JSON en el "LocalStorage" del navegador.
+ Cuando el usuario pulse el botón enviar, validaréis el formulario teniendo en cuenta lo siguiente:
    - Si los datos introducidos en los campos de texto Usuario y Contraseña existen en el "LocalStorage"; se abrirá la segunda página que contiene el juego. Para ello:
        + Debeís recuperar los datos del "LocalStorage" y mirar si los campos "Nombre de Usuario" y "Contraseña" introducidos coinciden con los recuperados.
        + Validar la contraseña utilizando Expresiones Regulares según el siguiente criterio: 
            - Contraseña: solo puede contener caracteres alfanuméricos, es decir, números del 0 al 9 y letras de la A-Z en mayúscula o minúscula.
            - Si la contraseña tuviera un carácter especial de la siguiente lista, mostrad un mensaje diciendo que la contraseña no coincide y sacad por pantalla el caracter especial.
    - Si los datos introducidos en los campos de texto Usuario y Contraseña NO existen en el "LocalStorage"; se mostrará dinámicamente un campo de texto en color rojo con el mensaje _"El usuarió no está registrado"_.

### Ejercicio 2: Interfaz del juego (segunda página)

Será una página compuesta por dos partes:
+ **Colores** - Fila de 1x5 celdas, para seleccionar el color con el que se quiere pintar.
+ **Matriz** - tabla de 30x30 celdas, con un tamaño de 10px cada una.

**Dinámica del juego:**
+ El usuario, pulsará un color (una celda del contenedor de “Colores”) para elegir el color con el que quiere pintar.
    - En este momento, tendremos que visualizar un mensaje que muestre el color que el usuario ha seleccionado.
+ Para empezar a pintar: el usuario clicará la celda de la tabla “Matriz” en la que desea empezar a pintar. 
+ Para pintar las celdas: si el usuario mueve el ratón, después de haber clicado la celda desde donde quiere pintar, este irá pintando las celdas con el color seleccionado (sin hacer click encima, solo arrastrando el ratón).  
+ Para dejar de pintar: Cuando el usuario vuelve a hacer clic sobre otra celda dejará de pintar. 
+ Es posible repetir el proceso con otros colores sobre celdas pintadas o sin pintar.  
+ Si queremos borrar colores, el usuario deberá pulsar sobre el color blanco. 

## MEJORAS A LA INTERFAZ

+ Se implementa el título con caracteres de colores generado con JS.
+ Utilización de cookie para determinar que no se accede a la página del juego directamente sin saltarse la página de login
+ Se añade un botón para limpiar el lienzo (matriz) de golpe.