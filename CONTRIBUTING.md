## Quickstart

To install and build `quadbin-js` locally from source:

```bash
# install dependencies
yarn

# build package once
yarn build
```

To run tests, coverage, or a linter, you should execute `yarn build`, and afterward:

```bash
# run tests once
yarn test
```

## Releases

1. Create a new version: `yarn version [ major | minor | patch | prerelease ]`

2. Commit, tag, and push to GitHub: `yarn postversion`

3. Execute `yarn publish`