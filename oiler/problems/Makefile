
SRC_MD=$(shell find . -name 'q*.md' -type f)
DIST_HTML=$(patsubst %.md,%.html,$(SRC_MD))

all: $(DIST_HTML)

%.html: %.md
	blackfriday-tool -css="/oiler/style.css" $< $@
