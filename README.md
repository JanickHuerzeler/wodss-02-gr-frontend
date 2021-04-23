# WODSS Gruppe 02 Frontend

Frontend für den Workshop in der Vertiefung "Distributed Software Systems" (WODSS).

---

## Prerequisites (NPM)
``` ZSH/CMD
cd corona-navigator
npm install
```

## Start

``` ZSH/CMD
npm start
```

## Common Pitfalls

Support for Apple's M1 ARM-processor is not yet fully provided by some involved parties here (e.g. Node only 16+, node-sass not yet, etc.). This can result in some special behaviour.

The following configuration has allowed to start and compile the project on an Apple Macbook Pro M1 device:

- Node: v14.16.1
- Terminal: Terminal with Rosetta 2 enabled (see [dev.to post](https://dev.to/courier/tips-and-tricks-to-setup-your-apple-m1-for-development-547g))
- Modified `npm start` command:
```ZSH
env FAST_REFRESH=false npm start
```