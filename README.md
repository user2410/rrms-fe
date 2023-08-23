RRMS frontend

## Project setup
- Copy .env.example to .env
- Run `yarn install`

## Errors
- Missing dependency: Cannot find module '@babel/runtime/helpers/interopRequireDefault'. Solution: 
```bash
`cp node_modules/@babel/runtime/helpers/esm/interopRequireDefault.js node_modules/@babel/runtime/helpers/interopRequireDefault.js`
```