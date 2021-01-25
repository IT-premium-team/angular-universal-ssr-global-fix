# Introduction
Angular Universal has a common issue with availability of such global things like window, Zone etc. on the server side (Node.js).
In order to fix JavaScript code running on the server side, it requires the global objects mocking.
In [Angular Universal Starter](https://github.com/Angular-RU/universal-starter/blob/master/server.ts#L21) there is a solution for that.
But the problem is that the code with the fixes is added into the compiled javascript modules after using global object.
In that case we could wrap the entire code (mostly main.js, where i.e. window is used) with a self-invoking function with passing all required params.
Although the solution is a little bit ugly, it solves the issue which could not be solved properly for the latest version of Angular.

# Usage
In order to fix the issue in your project, please do the following:
- Include the script into the root of your Angular Universal project
- Add a new command ```"ssr-fix": "node ssr-fix.js"``` into the package.json
- Run the command after running ssr build command
- Copy all required dependency folder ino the dist/test-project/browser folder or install them there via npm
- Run the project