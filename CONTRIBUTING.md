# Contributing

_Contributions are subject to CARTO's [community contributions policy](https://carto.com/contributions/)._

## Local development requirements

- Yarn v4+
- Node.js v18+

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

1. Update changelog

2. Create a new version: `yarn version [ major | minor | patch | prerelease ]`

3. Commit, tag, and push to GitHub: `yarn postversion`

4. Publish
   - If working on `master`, the previous step will automatically create and push a branch. Open a pull request, get any required approvals, and merge. Merged pull requests with commit messages beginning `chore(release)` will trigger a release automatically.
   - If working on a branch, a commit for the release will be pushed to the branch. You'll then need to [manually run a workflow](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow), “Release”, selecting the target branch in the menu.
