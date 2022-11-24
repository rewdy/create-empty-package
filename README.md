# create-empty-package

This is a very basic script that can be used to generate a new node package programmatically. It's similar to `npm init` or `yarn init`, except for this takes args so that you don't have to use the wizard. It's very similar to `poetry new` in the python world.

## 🤔 But y tho?

Right now (as far as I can tell), there's not a single non-interactive command to setup a new, empty package. You can [specify default values](https://yarnpkg.com/cli/init/#details) in a `.yarnrc.yml` file and run `yarn init` or maybe some other stuff, but nothing this simple and dumb. Thus, I make my own.

## How to use:

### Yarn

```bash
# new package named my-package
yarn create empty-package my-package

# specify some other values if you want
yarn create empty-package --name my-package --description "This is an example package" --version 0.0.1

# see all that it does
yarn create empty-package --help
```

### npx

```bash
# new package named my-package
npx create-empty-package my-package

# specify some other values if you want
npx create-empty-package --name my-package --description "This is an example package" --version 0.0.1

# see all that it does
npx create-empty-package --help
```

That's pretty much it. Have fun.
👋
