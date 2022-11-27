# create-empty-package

This is a very basic script that can be used to generate a new node package programmatically. It's similar to `npm init` or `yarn init`, except for this takes args so that you don't have to use the wizard. It's very similar to `poetry new` in the python world.

👉 [Changelog](https://github.com/rewdy/create-empty-package/blob/master/CHANGELOG.md)

## 🤔 But y tho?

Right now (as far as I can tell), there is not a single, non-interactive command to setup a new, empty package. You can [specify default values](https://yarnpkg.com/cli/init/#details) in a `.yarnrc.yml` file and run `yarn init` or maybe some other stuff, but nothing this simple and dumb. Thus, I make my own.

## How to use:

### Using `yarn`

```bash
# new package named my-package
yarn create empty-package my-package

# specify some other values if you want
yarn create empty-package --name my-package --description "This is an example package" --version 0.0.1

# see all that it does
yarn create empty-package --help
```

### Using `npx`

```bash
# new package named my-package
npx create-empty-package my-package

# specify some other values if you want
npx create-empty-package --name my-package --description "This is an example package" --version 0.0.1

# see all that it does
npx create-empty-package --help
```

### Options

If you run the script with the `--help` option, you can see all the accepted args. It looks like this:

```bash
yarn create empty-package --help

Create New Module

  Generates a new, empty npm module. Very basic indeed.

Options

  -n, --name string          The name for your new module. Default value: new-package.
  -d, --description string   The description for your new module.
  -v, --version string       Initial version. Default value: 1.0.0.
  -t, --license string       The license you choose. Default value: MIT.
  -p, --private boolean      Whether or not this module should be marked as private. Default value: false.
  -s, --silent boolean       Suppress log messages other than errors. Default value: false.
  -g, --git boolean          Whether or not to start with git. Default value: true.
  -h, --help boolean         Show these docs. Default value: false.
```

That's pretty much it. Have fun.  
👋
