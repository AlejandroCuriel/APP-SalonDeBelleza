<?php
header("Access-Control-Allow-Origin: http://localhost");
//Nos conectamos a nuestra base de datos
$db = mysqli_connect('localhost','alejandro','0821','appsalon'); //Nos conectamos a la base de datos deseada con la credencial del usuario registrado en mysql
mysqli_set_charset($db,'utf8'); //Permitimos que nuestra base de datos acepte las "Ñ" y las Comas(')

if(!$db):echo "Error en la conexion con la base de datos"; endif;