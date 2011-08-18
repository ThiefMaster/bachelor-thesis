NAME=Thesis
ARGS=-shell-escape -interaction=nonstopmode
VIEWER="F:/Foxit Reader/Foxit Reader.exe"

pdf:
	@echo Building PDF
	@pdflatex $(ARGS) -draftmode $(NAME)
	@bibtex $(NAME)
	@pdflatex $(ARGS) -draftmode $(NAME)
	@pdflatex $(ARGS) $(NAME)
	@start $(VIEWER) $(NAME).pdf

clean:
	@echo Cleaning up
	@rm -f $(NAME).pdf *.aux *.log *.out *.toc *.lof *.lot *.blg *.bbl
