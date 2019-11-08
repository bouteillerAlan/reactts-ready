## Commit rule

See [here](https://github.com/bouteillerAlan/Commit-Rule)

## Files architecture rules

Each component and page have a proper folder.

A component is a function or class that is reusable, ideally there is no direct interaction with redux (we will go through the props). 

A page is more or less like a controller, we will call redux in (among others). 

The ``utils.ts`` file in ``config`` folder is used to store some *utils* functions

Example of file architecture : 
```
- back
  |_ next
  |_ node_modules
  |_ pages
  |_ public
  |_ src
      |_ app
      |   |_ assets
      |   |_ components
      |   |   |_ component_a
      |   |   |   |_ component_a.component.tsx
      |   |   |   |_ component_a.component.scss
      |   |   |_ component_b
      |   |       |_ ...    
      |   |_ ducks
      |   |   |_ document_a.duck.ts
      |   |   |_ document_b.duck.ts
      |   |_ pages
      |   |   |_ page_a
      |   |       |_ page_a.page.tsx
      |   |       |_ page_a.page.scss
      |   |   |_ page_b
      |   |       |_ ...      
      |   |_ component_a.module.ts
      |   |_ component_a.service.ts
      |_ config
          |_ configureStore.ts
          |_ utils.ts
```

## Env file
Create a ``.env`` file in the root of the project.

```
# application port
PORT=1234
# api url
REACT_APP_API_URL=http://localhost:3001
```

## Command
### Installation

```
$ yarn
```

### Running the app
```
# development
$ yarn start

# build
$ yarn build

# test
$ yarn test

# eject
$ yarn eject
```
