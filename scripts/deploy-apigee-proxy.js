const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const APIGEE_ORGANIZATION = process.env.APIGEE_ORGANIZATION; // Get the orgName from the command line arguments
const PROXY_NAME = process.env.PROXY_NAME; // Get the apiName from the command line arguments
const APIGEE_ENV = process.env.APIGEE_ENV;
const USERNAME = process.env.APIGEE_USER; // Get the APIGEE username from the command line arguments
const PASSWORD = process.env.APIGEE_PASSWORD; // Get the APIGEE password from the command line arguments
const ZIP_FILE_PATH = `./${PROXY_NAME}.zip`;


const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');
const basicAuthHeader = `Basic ${credentials}`;


async function deployProxy(deployUrl) {
  try {
    const response = await axios({
      method: "post",
      url: deployUrl,
      headers: {
        "Authorization": basicAuthHeader,
      },
      data: {},
      
    })
    if (response.status === 200) {
      const responseBody = response.data; // Extract the response body
      console.log('Proxy deployment successful.');
      return responseBody; // Return the response body as a string
    } else {
      console.error(`Proxy deployment failed with status code: ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during API request:', error.message);
    process.exit(1);
  }
}

// async function uploadProxy(uploadUrl) {
//   try {
//     const form = new FormData();
//     form.append('file', fs.readFileSync(ZIP_FILE_PATH), `${PROXY_NAME}.zip`);
//     const response = 
//     await axios.post(uploadUrl, form,  {
//       headers: {
//         Authorization: basicAuthHeader,
//         'Content-Type': 'application/octet-stream'
//       },
//     });
//     if (response.status === 201) {
//       const responseBody = response.data; // Extract the response body
//       console.log('Proxy upload successful.');
//       return responseBody; // Return the response body as a string
//     } else {
//       console.error(`Proxy upload failed with status code: ${response.status}`);
//       process.exit(1);
//     }
//   } catch (error) {
//     console.error('Error during API request:', error.message);
//     process.exit(1);
//   }
// }

async function uploadProxy(uploadUrl) {
  return new Promise((resolve, reject) => {
    try {
      const form = new FormData();
      form.append('file', fs.readFileSync(ZIP_FILE_PATH), `${PROXY_NAME}.zip`);

      const response = axios.post(uploadUrl, form, {
        headers: {
          Authorization: basicAuthHeader,
          'Content-Type': 'application/octet-stream'
        }  
      });

      if (response.status === 201) {
        resolve(response.data);
      } else {
        reject(`Proxy upload failed with status code: ${response.status}`);  
      }

    } catch (error) {
      reject(error);
    }
  });
}

async function uploadAndDeployToProd() {
  const uploadUrl = `https://api.enterprise.apigee.com/v1/organizations/${APIGEE_ORGANIZATION}/apis?action=import&name=${PROXY_NAME}`
  try {
    const proxyData = await uploadProxy(uploadUrl);
    console.log(proxyData);

    
    // Check if uploadProxy was successful before deploying
    if (proxyData) {
      const deployUrl = `https://api.enterprise.apigee.com/v1/organizations/${APIGEE_ORGANIZATION}/environments/${APIGEE_ENV}/apis/${PROXY_NAME}/revisions/${proxyData.revision}/deployments?override=true&delay=120`;
      const responseString = await deployProxy(deployUrl);
      console.log('Response String:', responseString);
    } else {
      console.error('UploadProxy was not successful. Skipping deployment.');
    }
  } catch (error) {
    console.error('Error during proxy deployment:', error);
    process.exit(1);
  }
}



// Call the uploadAndDeploy function to start the process
if(APIGEE_ENV === "prod"){
  uploadAndDeployToProd();
}else{
  deployToLowerEnvironments();
}

