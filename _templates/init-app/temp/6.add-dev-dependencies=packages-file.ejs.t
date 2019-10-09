---
inject: true
to: <%=name%>/package.json
after: devDependencies
skip_if: fortawesome
sh: cd <%=pathTo%> && npm i -D @fortawesome/fontawesome-free @ngrx/schematics @ngrx/store-devtools @typed-f/either @typed-f/lens @typed-f/maybe angular2-fontawesome husky
---