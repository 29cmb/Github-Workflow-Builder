# Hosting
So you want to host your own copy of overflow? Here you will find a detailed guide on how to set it up

## Setup
First, you will need to install all of the required packages for both the backend and the client, you can do this with the npm script
```
npm run install-all
```
### Some info
Now the topology of this project is quite weird, so I will try my best to explain it here.

The root directory contains the main express app and api calls (accessible through the [api](../api/) directory), while the react app can be found in the [client](../client/) directory.

> [!NOTE]\
> The client folder is a seperate npm instance, meaning to update the packages for the client, you need to do `cd client` first!

## Serving the server
There are 2 ways to present the server to a user, one being for development and one being for production

### Development
Once the steps above are completed, you should be able to run the `npm start` command to start a development server on an open port (usually 3000). **You should not use this for production**
### Production
For production, we will be building the `jsx` files into a singular `js` file, this is optimized for production and is handled by a react script. 

To build, run the following command
```
npm run client-build
```

Once you've ran the build command, it will take a few minutes to convert the `client` into an optimized production build. Once that finishes, you will need to run the command below to start the server
```
npm run serve
```

> [!NOTE]\
> The serve command will run a script called serve.js in the client directory, if you need to rename anything for any reason, you must update the path in `package.json`

