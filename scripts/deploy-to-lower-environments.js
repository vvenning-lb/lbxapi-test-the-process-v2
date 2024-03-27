const apigeejs = require('apigee-edge-js'),
    apigee = apigeejs.apigee;
const util = require('util');
const fs = require('fs');
require('dotenv').config();

const APIGEE_ORGANIZATION = process.env.APIGEE_ORGANIZATION; // Get the orgName from the command line arguments
const PROXY_NAME = process.env.PROXY_NAME; // Get the apiName from the command line arguments
const APIGEE_ENV = process.env.APIGEE_ENV;
const USERNAME = process.env.APIGEE_USER; // Get the APIGEE username from the command line arguments
const PASSWORD = process.env.APIGEE_PASSWORD;
const PROXY_REVISION = process.env.PROXY_REVISION; // Get the APIGEE password from the command line arguments

const options = {
    org: APIGEE_ORGANIZATION,
    user: USERNAME,
    password: PASSWORD
};


apigee.connect(options)
    .then(org => {
        // First, get deployments.
        return org.proxies.deploy({name: PROXY_NAME, revision: PROXY_REVISION, environment: APIGEE_ENV})
            .then(result => {
                let previouslyDeployedProxyRevision = extractPreviouslyDeployedRevisionName(result);
                console.log(`previously deployed proxy revision result in ${APIGEE_ENV}: `, previouslyDeployedProxyRevision);
                fs.appendFileSync(process.env.GITHUB_ENV, `PREVIOUS_REVISION_FOR_UNDEPLOY=${previouslyDeployedProxyRevision}\n`); 
            })
    })
    .catch(error => {
        console.log(util.format(error));
        process.exit(1);
    });





function extractPreviouslyDeployedRevisionName(data) {
    // Find the proxy with undeployed state in the 'environment' array
    // and return the name of the revision in that proxy's 'name' property
    // or return 'No deployed revision found' if no undeployed revision is found
    // or return 'No deployed revision found' if the 'environment' array is empty
    // or return 'No deployed revision found' if the 'environment' array is undefined

    // Check if the 'environment' array is empty or undefined

    const undeployedRevision = data?.environment.find(env => env.state === 'undeployed');
    return undeployedRevision ? undeployedRevision.name : 'No deployed revision found';
}

