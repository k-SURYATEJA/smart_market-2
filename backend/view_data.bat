@echo off
:: SmartMarket Oracle Data Viewer
:: Double-click this file to see all database tables in a clean format

set OJDBC=C:\Users\durga\eclipse-workspace\SmartMarketBackend\build\classes\WEB-INF\lib\ojdbc8.jar
set BUILD=C:\Users\durga\eclipse-workspace\SmartMarketBackend\build

echo.
echo Connecting to Oracle XE and fetching SmartMarket data...
echo.

java -cp "%BUILD%;%OJDBC%" ShowData

echo.
pause
