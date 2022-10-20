var express = require('express')
const knex = require('knex')({
	client: 'mysql',
	connection: {
		host : "bkwrla1sjpp9vda8hshy-mysql.services.clever-cloud.com",
		port : 3306,
		user : "udnenzb9jdut66vk",
		password : "wqbkA5NcA4JOZpPXd4oe",
		database : "bkwrla1sjpp9vda8hshy"
	}
});








//var mysql = require('mysql');
var app = express()
app.use(express.json())

// var usuarios = new Map()
// usuarios.set(1, {id:1, documento:"ABC123", nombre:"Andrii", tipo:1})
// usuarios.set(2, {id:2, documento:"XYZ987", nombre:"John", tipo:2})
// var currentID =3;

app.get('/api/usuarios', async function(pet, resp) {
	var users = await knex.select().from('usuarios')
    resp.status(200)
	resp.json({usuarios: users})
    resp.end()
    
})

app.get('/api/usuarios/:id', async function(pet, resp){
	var id = parseInt(pet.params.id)
	if (isNaN(id)) {
		resp.status(400)
		resp.send("Id should be number")
	}
	else {
		var obj = await knex.select().from('usuarios').where('id', id)	//usuarios.get(id)
		if (!obj) {
			resp.status(404)
			resp.send("user with" + id + " doesnt exist")
		}
		else {
            resp.status(200)
			resp.send(obj)
			resp.end()
		}
	}
})

app.post('/api/usuarios',async function(pet, resp){
	var obj = pet.body
	var nuevo = {id: idActual, documento:obj.documento, tipo:parseInt(obj.tipo), nombre:obj.nombre}
	if (nuevo.nombre && !isNaN(nuevo.tipo)) {
		//lista.set(idActual,nuevo)
		await knex('usuarios').insert(nuevo)
		resp.status(201)
		resp.header('Location', 'http://localhost:8080/api/usuarios/'+idActual)
		resp.send(nuevo)
		idActual++;
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})





var lista = new Map()
lista.set(1, {id:1, nombre:"pan", cantidad:1})
lista.set(2, {id:2, nombre:"agua", cantidad:1})
var idActual = 5;

app.get('/saludo', function(pet,resp){
	resp.send("Hola soy Express")
	resp.end()
})

app.get('/api/items', function(pet, resp) {
   resp.send(Array.from(lista.values()))
   resp.end()
})

app.post('/api/items',function(pet, resp){
	var obj = pet.body
	var nuevo = {id: idActual, nombre:obj.nombre, cantidad:parseInt(obj.cantidad)}
	if (nuevo.nombre && !isNaN(nuevo.cantidad)) {
		lista.set(idActual,nuevo)
		resp.status(201)
		resp.header('Location', 'http://localhost:3000/api/items/'+idActual)
		resp.send(nuevo)
		idActual++;	
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})

app.get('/api/items/:id', function(pet, resp){
	var id = parseInt(pet.params.id)
	if (isNaN(id)) {
		resp.status(400)
		resp.send("El id debería ser numérico")
	}
	else {
		var obj = lista.get(id)
		if (!obj) {
			resp.status(404)
			resp.send("El item con id " + id + " no existe")
		}
		else {
			resp.send(obj)
			resp.end()
		}
	}
})

app.listen(8080, function(){
	console.log("Servidor arrancado!!!")
})