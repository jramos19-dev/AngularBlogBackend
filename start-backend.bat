@echo off
cd /d "c:\Dev\Source\Angular Projects\AngularBlogBackend"
start "Backend Server" cmd /k npm start
timeout /t 3
start "Tunnel" cmd /k lt --port 4500 --subdomain angularblogapi
echo Backend is running at https://angularblogapi.loca.lt
