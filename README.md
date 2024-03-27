# Apigee Proxy Deployment Instructions

These instructions outline the steps to deploy your Apigee proxy using the Apigee pipeline template.

## Prerequisites

Before you begin, ensure you have the following in place:

- An Apigee account and API proxy in Apigee.
- Access to a GitHub repository for version control.
- Values mentioned in the `.env` file.

## Deployment Steps

1. **Create a New Repository**
   
   Create a new GitHub repository named after your Apigee proxy using the `apigee-pipeline-template-v2`.

2. **Clone the Repository**

   Clone the newly created repository to your local machine using Git.
   ```bash
   git clone <repository-url>

4. **Create a Development Branch**

   Create a new branch named 'dev' for your development work.
   ```bash
   git checkout -b dev

6. **Update Environment Variables**

   Update the following environment variables in the `.env` file with appropriate values:

   - `PROXY_NAME`
   - `PROXY_REVISION`
   - `PRODUCT_NAME`
   - `KVM_NAME`
   - `RELEASE_TICKET`

7. **Commit and Push Changes**

   Commit the changes to the 'dev' branch and push it to your GitHub repository. This action will trigger the GitHub Action to pull the proxy bundle and commit it back to the repository.
   ```bash
   git add .
   git commit -m "Update environment variables"
   git push origin dev

9. **Create a Pull Request to Master**

   Create a pull request from the 'dev' branch to the 'master' branch.
   ```bash
      gh pr create --base master --head dev

11. **Create a GitHub Tag**

    Once the pull request is approved, create a GitHub tag with the proper version.

      [Creating a tag](https://docs.github.com/en/authentication/managing-access-to-your-organizations-repositories/assigning-tags-to-releases)


11. **Create a Release Branch**

    Create a new branch off the tag, and name it for your release.
      ```bash
      git checkout -b <release-branch-name> <tag-name>


12. **Create a Staging Branch**

    When you're ready to deploy to the staging environment, create a new branch named 'staging'.
      ```bash
      git checkout -b staging

13. **Open a Pull Request to Staging**

    Open a pull request from the release branch to the staging branch. This action will trigger the deployment GitHub Action.
      ```bash
      gh pr create --base staging --head <release-branch-name>


14. **Create a Production Branch**

    When you're ready to deploy to the production environment, create a 'prod' branch and open a pull request from the release branch to the 'prod' branch.

      ```bash
      git checkout -b prod

Note: Update the `.env` file with the RELEASE_TICKET number from the CAB board.

15. **Open a Pull Request to Prod**

    Open a pull request from the release branch to the staging branch. This action will trigger the deployment GitHub Action.
      ```bash
      gh pr create --base prod --head <release-branch-name>


Congratulations! You've successfully deployed your Apigee proxy following these steps.
