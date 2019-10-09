---
inject: true
to: <%=name%>/package.json
before: private
skip_if: husky
---
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint"
    }
  },