---
inject: true
to: <%=name%>/package.json
before: private
---
	"private": true,
	"repository": "<%=repo%>",
	"author": "<%=author%>",
	"license": "MIT"
