@echo off
set /P name=Project Name: 
mkdir %name%
cd %name%
echo console.log("Hello World") > index.js
echo node index.js > run.bat
echo node index.js > run.sh
copy ..\node.gitignore .gitignore > nul
npm init