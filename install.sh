echo "Installing appA"
cd appA
npm install --quiet 
cd ..

echo "Installing appB"
cd appB
npm install --quiet 
cd ..

echo "Create the DB"
cd appA
cd db
rm users.db
echo ".read users.sql" | sqlite3 users.db
cd ../..

echo "Now test.."
cd test
npm install
make
