BGS=extension/background_scripts

all: $(BGS)/bundle.js

$(BGS)/estimator.js: Models/estimator.py
	python3 $< > $@

$(BGS)/bundle.js: $(BGS)/utils.js $(BGS)/estimator.js $(BGS)/user.js $(BGS)/background.js
	cat $^ > $@
	browserify $@ -o $@

clean:
	rm -f $(BGS)/estimator.js $(BGS)/bundle.js

.PHONY: all clean
