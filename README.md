# Blog App

Build to learn Amplify GraphQL and React

## Performed

    $ amplify init
    
Initiated the app with amplify, like npm init. Gave basic settings and graphql folder was added to the project

    $ amplify add api

API name setup and added changes to amplify/backend/api/blog/schema.graphql.

    $ amplify push
Pushed to the changes to AWS, and saw DB and API created on the fly

    $ amplify console api
View the console with command

Installed aws-amplify and aws-amplify-react

    $ amplify add auth
Created default auth setting of amplifier

    $ amplify push
Pushed the changes to AWS, and saw AWS congnito created

Added withAuthenticator to React App, so see the login and signup page



    $ amplify hosting add
Create a dev s3 bucket hoisting location for us

    $ amplify publish
Push files to bucket and provide the link