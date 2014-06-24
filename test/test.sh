#/bin/bash

#######
# http://stackoverflow.com/questions/22252226/passport-local-strategy-and-curl

rm jarfile

echo "\n\n--- login"
curl --cookie-jar jarfile --data "username=admin&password=pass" http://localhost:5000/login

echo "\n\n--- test1"
curl --cookie jarfile "http://localhost:5000/api/admin"

echo "\n\n--- test2"
curl --cookie jarfile "http://localhost:5000/api/users"
