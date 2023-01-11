Andrii Shybaiev Practice 1 ADI 2022
In this practice were implemented all compulsory requirements on tables “Usuarios”, “Contratos” “Matriculas”.
1 login request, and 5 requests for each of the implemented tables, 16 in total.
 All requests except the request to get all professions and profession by id require JWT token, those 2 are “public” requests for guests.
1.	Was added connection to cloud development MySQL DB, all requests actually change DB
2.	Automated testing in added Postman file
3.	Was made API using Swagger https://app.swaggerhub.com/apis/1246090/ADI_Education/2.0.0 in latest version were removed RestKey-s, 
	those are not necessary with JWT, added “contratos” table to better reflect the many-to-many relationship between “usuarios” and “matriculas”
