---
inject: true
to: <%=name%>/package.json
after: dependencies
skip_if: compodoc
sh: cd <%=pathTo%> && npm i @angular/cdk @compodoc/compodoc @ngrx/effects @ngrx/store date-fns devextreme devextreme-angular devextreme-intl downloadjs hammerjs module-alias npm-check-updates ramda ramda-extension reflect-metadata
---
