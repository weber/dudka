---
inject: true
to: <%=name%>/package.json
after: scripts
---
    "doc": "./node_modules/@compodoc/compodoc/bin/index-cli.js -p src/tsconfig.app.json -s\n",
    "make": "./node_modules/.bin/ng build --prod --base-href /<%=name%>/ --progress",
    "build:release": "./node_modules/.bin/ng build --prod --base-href /<%=name%>/ --progress --output-path=dist/<%=name%>",
    "lint:fix": "./node_modules/.bin/tslint ./src/**/*.{ts,tsx} --fix",
