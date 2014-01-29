#! /bin/sh
#  --compilation_level ADVANCED_OPTIMIZATIONS # cant handle oninput atm
undef -d js startup | closure-compiler --language_in ECMASCRIPT5_STRICT > cgol.min.js
