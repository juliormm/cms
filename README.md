# Puporse

This app in intended to help the creative team manage campaigns they work on. 


## Installation

> This project was generated with [Angular CLI](https://github.com/angular/angular-cli)
> see url for more details 

Run commands to install dependencies. 

```
$ npm install
```



## Development

The files in this section are for the UI, see `cms-api` for the database and api.

Update the paths as neede here:
`/creative_tools/hyfnlocal/cms/src/environments/environment.ts`

Run `ng serve --aot` for a dev server.  
Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files.


The app requires a login even on the dev side. 
	user: julio.chacon@lin-digital.com
	pass: (linpass)

### Notes
	* The flag `--aot` does ahead copilation and allows the dev enviroment to catch any unused variables in templates.
	* using the flag --prod in `ng serve` will make use of uglifying and tree-shaking


## Deployment

run `ng build --prod`
in the root folder of `CMS` you will see a folder `dist`
The content of the folder will need to be copied to the hosting server of the live app (app.hyfnlocalcreative.com)

FTP login:
server: 	hyfnlocalcreative.com
port: 		21
username: 	creative_admin
password:	gA1ev00%

Once logged in with credentials, go to `app.hyfnlocalcreative.com` the JS files and folders here need to be updated with the content from `dist` folder

** suggested to move the content of `app.hyfnlocalcreative.com` into a new folder to make a backup in case you need to quickly revert changes.


