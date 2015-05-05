#! /bin/bash

cat mt-begin.tex > mt.tex
./txt2tex.pl genesis.txt && cat genesis.tex >> mt.tex
./txt2tex.pl exodus.txt && cat exodus.tex >> mt.tex
./txt2tex.pl leviticus.txt && cat leviticus.tex >> mt.tex
./txt2tex.pl numbers.txt && cat numbers.tex >> mt.tex
./txt2tex.pl deuteronomy.txt && cat deuteronomy.tex >> mt.tex
cat dictionary.tex >> mt.tex
cat mt-end.tex >> mt.tex

xelatex mt.tex | tee compile.log
