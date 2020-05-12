#!/bin/bash
read -p 'Project Name: ' name
mkdir $name
cd $name
echo "console.log(\"Hello World\")" > index.js
echo "node index.js" > run.bat
echo "node index.js" > run.sh
chmod +x run.sh
cp -T "../node.gitignore" ".gitignore"
npm init