---
inject: true
to: <%=name%>/package.json
after: scripts
---
    "doc": "./node_modules/@compodoc/compodoc/bin/index-cli.js -p src/tsconfig.app.json -s\n",
    "make": "./node_modules/.bin/ng build --prod --base-href /<%=name%>/ --progress",
    "build:release": "npx ../bin/pps.js b \"./node_modules/.bin/ng build --prod --base-href /<%=name%>/\"",
    "lint:fix": "./node_modules/.bin/tslint ./src/**/*.{ts,tsx} --fix",
