---
inject: true
to: <%=name%>/package.json
before: private
---
	"repository": "git+ssh://cl-tfs2018:22/tfs/CK-11/WebDev/_git/<%=repo%>",
	"author": "<%=author%>",
	"license": "MIT",
