NAME=Thesis
ARGS=-shell-escape -interaction=nonstopmode
SRC=Thesis.tex
VIEWER="F:/Foxit Reader/Foxit Reader.exe"

pdf:
	@echo Building PDF
	@pdflatex $(ARGS) -draftmode $(NAME).tex
	@pdflatex $(ARGS) $(NAME).tex
	@start $(VIEWER) $(NAME).pdf

clean:
	@echo Cleaning up
	@rm -f $(NAME).pdf *.aux *.log *.out *.toc *.lof *.lot
