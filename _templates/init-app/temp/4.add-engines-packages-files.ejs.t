---
inject: true
to: <%=name%>/package.json
before: private
skip_if: engines
---
  "engines": {
    "node": ">=10.0.0",
    "npm": ">=6.0.0"
  },