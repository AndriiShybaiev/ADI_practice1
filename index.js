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
var jwt = require("jwt-simple");
var app = express()
app.use(express.json())



app.post("/api/login", async function (pet, resp) {
	var loginBuscado = pet.body.login;
	var passwordBuscado = pet.body.password;
	//var user = users.get(loginBuscado);


	var pass = await knex('usuarios').select('password').where('login', loginBuscado)
	if (pass && pass[0].password===passwordBuscado) {
		var payload = {
			login: loginBuscado,
		};
		var secret = "123456"
		var token = jwt.encode(payload, secret);
		resp.status(200)
		resp.send(token)
	} else {
		resp.sendStatus(403).end()
	}
})


app.get('/api/usuarios', checkJWT, async function(pet, resp) {
	var users = await knex.select().from('usuarios')
    resp.status(200)
	resp.json({usuarios: users})
    resp.end()
    
})

app.get('/api/usuarios/:id', checkJWT, async function(pet, resp){
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

app.post('/api/usuarios', checkJWT, async function(pet, resp){
	var obj = pet.body
	const maxIdQuery = await knex('usuarios').max('id as maxId').first()
	var nuevo = {id: maxIdQuery.maxId+1, documento:obj.documento, tipo:parseInt(obj.tipo), nombre:obj.nombre, login:obj.login, password:obj.password}
	if (nuevo.nombre && !isNaN(nuevo.tipo)) {
		await knex('usuarios').insert(nuevo)
		resp.status(201)
		resp.header('Location', 'http://localhost:8080/api/usuarios/'+nuevo.id)
		resp.send(nuevo)
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})

app.delete('/api/usuarios/:id', checkJWT, async function(pet, resp){
	var id = parseInt(pet.params.id)
	if (isNaN(id)) {
		resp.status(400)
		resp.send("Id should be number")
	}
	else {
		var obj = await knex.del().from('usuarios').where('id', id)	//usuarios.get(id)
		if (!obj) {
			resp.sendStatus(404)
			resp.send("user with" + id + " doesnt exist")
		}
		else {
			resp.sendStatus(200)
			resp.end()
		}
	}
})

app.put('/api/usuarios', checkJWT, async function(pet, resp){
	var obj = pet.body
	var nuevo = {documento:obj.documento, tipo:parseInt(obj.tipo), nombre:obj.nombre}
	if (nuevo.nombre && !isNaN(nuevo.tipo) && !isNaN(obj.id)) {
		await knex('usuarios').update(nuevo).where('id', obj.id)
		resp.status(201)
		resp.header('Location', 'http://localhost:8080/api/usuarios/'+idActual)
		resp.send(nuevo)
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})

app.get('/api/matriculas', async function(pet, resp) {
	var matriculas = await knex.select().from('matriculas')
	resp.status(200)
	resp.json({matriculas: matriculas})
	resp.end()

})

app.get('/api/matriculas/:id', async function(pet, resp){
	var id = parseInt(pet.params.id)
	if (isNaN(id)) {
		resp.status(400)
		resp.send("Id should be number")
	}
	else {
		var obj = await knex.select().from('matriculas').where('id', id)
		if (!obj) {
			resp.status(404)
			resp.send("matricula with" + id + " doesnt exist")
		}
		else {
			resp.status(200)
			resp.send(obj)
			resp.end()
		}
	}
})

app.post('/api/matriculas', checkJWT, async function(pet, resp){
	var obj = pet.body
	const maxIdQuery = await knex('matriculas').max('id as maxId').first()
	var nuevo = {id: maxIdQuery.maxId+1, profession:obj.profession}
	if (nuevo.profession && !isNaN(nuevo.id)) {
		await knex('matriculas').insert(nuevo)
		resp.status(201)
		resp.header('Location', 'http://localhost:8080/api/matriculas/'+nuevo.id)
		resp.send(nuevo)
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})

app.delete('/api/matriculas/:id', checkJWT, async function(pet, resp){
	var id = parseInt(pet.params.id)
	if (isNaN(id)) {
		resp.status(400)
		resp.send("Id should be number")
	}
	else {
		var obj = await knex.del().from('matriculas').where('id', id)	//usuarios.get(id)
		if (!obj) {
			resp.sendStatus(404)
			resp.send("profession with" + id + " doesnt exist")
		}
		else {
			resp.sendStatus(200)
			resp.end()
		}
	}
})

app.put('/api/matriculas', checkJWT, async function(pet, resp){
	var obj = pet.body
	var nuevo = {documento:obj.documento, tipo:parseInt(obj.tipo), nombre:obj.nombre}
	if (nuevo.nombre && !isNaN(nuevo.tipo) && !isNaN(obj.id)) {
		await knex('matriculas').update(nuevo).where('id', obj.id)
		resp.status(201)
		resp.header('Location', 'http://localhost:8080/api/matricuas/'+obj.id)
		resp.send(nuevo)
	}
	else {
		resp.status(400)
		resp.send("falta propiedad nombre y/o cantidad o esta última no es numérica")
	}
	resp.end()

})



app.listen(8080, function(){
	console.log("Server live")
})

async function checkJWT(pet, resp, next) {
	var token = getTokenFromAuthHeader(pet);
	if (token !== undefined) {
		var secret = "123456";
		try {
			jwt.decode(token, secret);
			next();
		} catch (error) {
			resp.status(403);
			resp.send({ mensaje: "no tienes permisos" });
		}
	} else {
		resp.status(403);
		resp.send({ mensaje: "no tienes permisos" });
	}
}

function getTokenFromAuthHeader(pet) {
	var cabecera = pet.header("Authorization");
	if (cabecera) {
		var campos = cabecera.split(" ");
		if (campos.length > 1 && cabecera.startsWith("Bearer")) {
			return campos[1];
		}
	}
	return undefined;
}