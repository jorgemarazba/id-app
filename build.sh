#!/bin/bash

# Script para compilar APK con Expo
# Este script compila tu app para uso personal sin necesidad de cuenta Expo

echo "=== Compilando APK ===" 
echo "Por favor, sigue estos pasos:"
echo ""
echo "1. Ve a https://expo.dev/signup (es gratis)"
echo "2. Crea una cuenta"
echo "3. Luego ejecuta:"
echo ""
echo "   eas login"
echo "   eas build --platform android --local"
echo ""
echo "=== O usa la alternativa ===" 
echo ""
echo "Sin registro: npx eas build --platform android --local"
echo ""
echo "Presiona cualquier tecla para continuar..."
read -p ""

# Compilar
eas build --platform android --local
