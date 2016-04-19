1. Instalirati NodeJS ako nije instaliran
2. Iz glavnog foldera projekta iz cmd-a pokrenuti 'npm install'
3. pokrenuti server iz glavnog foldera  s 'node server.js'. Ako je sve prošlo dobro na localhost:3000 se vidi stranica.

    Dodana je baza u cloudu, podaci su u mongo.json
    U mongo.json su i dva url-a. Jedan pokazuje na bazu u cloudu, a drugi na lokalnu bazu jer baza u cloudu ne radi na faxu.
    Može se birat između te dvije baze alterniranjem broja 2, tj. koristi se ona baza koja nema broj dva u ključu u jsonu ("mongoURL").
