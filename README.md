# soa-c

A CLI that generates Struct-of-Arrays (SOA) C code from a JSON descriptor file.

## Setup

This section is a step-by-step guide to set-up your development environment for
building `soa-c` locally.

### Installing Node Version Manager (`nvm`)

We recommend installing `nvm`

To **install** or **update** nvm, you may either download and run the script manually, or use the following cURL or Wget command:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```

Running either of the above commands downloads a script and runs it. The script clones the nvm repository to `~/.nvm`, and attempts to add the source lines from the snippet below to the correct profile file (`~/.bash_profile`, `~/.zshrc`, `~/.profile`, or `~/.bashrc`).

<a id="profile_snippet"></a>

```sh
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

For more information, please consult [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating)

### Installing `node`

with `nvm`, the process is much easier.

To install the version of `node` that `soa-c` requires:

```sh
cd soa-c
nvm install
```

And in the future, whenever you want to continue working or building soa-c, you can re-activate the required node version like so

```sh
cd soa-c
nvm use
```

### Installing `pnpm`

We prefer using pnpm because it is faster and more disk efficient than `npm` or `yarn`.

```sh
cd soa-c
npm install pnpm --global
```

## Building

The first time that you are building will require dependencies and development tools to be installed into your `node_modules` folder. To do so, we do it via `pnpm` like so:

```sh
cd soa-c
pnpm install
```

And then you are ready to build `soa-c` like so:

```sh
pnpm build
```
