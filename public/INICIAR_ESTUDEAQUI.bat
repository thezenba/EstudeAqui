@echo off
title EstudeAqui - Simulador Offline
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================================
echo        ESTUDEAQUI - SIMULADOR OFFLINE
echo        112 Provas Oficiais ^| 5.799 Questoes
echo ========================================================
echo.
echo Iniciando aplicativo no seu navegador padrao...
echo Por favor, mantenha esta janela aberta enquanto estiver usando o aplicativo.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_offline.ps1" -Port 3333 -Path "%~dp0."
if errorlevel 1 (
    echo.
    echo Ocorreu um erro ao iniciar. Tentando modo alternativo...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& { Start-Process 'http://localhost:3333' }"
    pause
)
