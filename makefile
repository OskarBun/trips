build:
	jspm bundle-sfx app/main dist/app.js
	./node_modules/.bin/uglifyjs dist/app.js -o dist/app.min.js
	./node_modules/.bin/html-dist index.html --remove-all --minify --insert app.min.js -o dist/index.html
	cp loading.css dist/loading.css
	cp -r resources* dist/resources
	firebase deploy
