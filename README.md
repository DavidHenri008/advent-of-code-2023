[<img src="https://ablcode.vsrm.visualstudio.com/_apis/public/Release/badge/bfe4f7a7-64d3-4cef-ba6c-7e602a5679ea/6/6"/>](https://ablcode.vsrm.visualstudio.com/_apis/public/Release/badge/bfe4f7a7-64d3-4cef-ba6c-7e602a5679ea/6/6)

# Introduction

This package downloads all the latest dcars.

# Installation & Usage

Follow those steps for the first installation. If you already have npm, go to step 2. If you are already using the feed @eclypse2, go to step 5...

1. Install `node` and `npm`. npm is installed by node.js. You can download node at [Node.js website](https://nodejs.org).
2. Add those lines in your own .npmrc (if the file does not exist, simply create the file).
   - Windows: `C:\Users\username\.npmrc`
   - Mac OS/Linux: `~/.npmrc`

```
@eclypse2:registry=https://ablcode.pkgs.visualstudio.com/_packaging/Eclypse2_dev/npm/registry/
@eclypse2:always-auth=true
``` 

3. Install **vsts-npm-auth**: `npm install -g vsts-npm-auth`
4. Run `vsts-npm-auth -config .npmrc`
5. Install package globally: 
   - Using npm: `npm install -g @eclypse2/fetch-dcars`
   - Using yarn: `yarn global add @eclypse2/fetch-dcars` 
6. Run the command `fetch-dcars`

Run `fetch-dcars -h` for help.

# Update

To update the package, run:
- Using npm: `npm install -g @eclypse2/fetch-dcars`
- Using yarn: `yarn global add @eclypse2/fetch-dcars` 

# Troubleshooting

If you have an error indicating the package could not be found at step 5, check the authentication with the feed with [those instructions](https://ablcode.visualstudio.com/Eclypse2/_packaging?_a=connect&feed=Eclypse2_dev).

# Development

1. Run `yarn install`
2. Run `yarn fetch` to fetch latest dcars.

# Release

This package is automatically published with this [release pipeline](). Just make sure to increment the version correctly.
