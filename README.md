<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1r_n6jxCCSLkt7NTIRSxNvsUMVuSJ_O4p

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploying (optional)

You do not have to deploy the project to Netlify—the experience runs completely in development mode. Deploy only if you want to share the decoder publicly.

### Netlify steps

1. Push this repository to GitHub so Netlify can read the code.
2. In Netlify choose **Add new site → Import an existing project** and select the GitHub repository.
3. Accept the default build command `npm run build` and publish directory `dist`.
4. Add an environment variable named `GEMINI_API_KEY` with the same key you use locally.
5. Click **Deploy site** and Netlify will build and host the production bundle for you.

### Cloud preview without deploying

If you just want to interact with the experience without using your own machine, open the repository in [GitHub Codespaces](https://github.com/features/codespaces) and run the local steps above inside the browser-based environment. This lets you test changes interactively while keeping the code private.

### Push your updates so they appear on GitHub

GitHub only shows the files you push to a remote repository. If you do not see the README updates online, make sure you have sent your local branch to GitHub:

1. Sign in to GitHub in your browser and create a new empty repository (or open the existing one where you want these files to live).
2. Copy the repository URL that matches your preferred authentication method (HTTPS or SSH).
3. In your project folder run `git remote add origin <repository-url>` if you have not already connected a remote.
4. Push the current branch with `git push -u origin work`. Replace `work` with whichever branch name you are using.
5. Refresh the repository page on GitHub and switch to that branch in the branch picker to see the latest README and code.

## When you review on GitHub

- Switch to the `work` branch (or the branch name you pushed) to see these latest instructions. The default branch may still show an earlier README.
- This README file is the primary place for setup and deployment steps. GitHub renders it automatically on the repository home page once your branch is pushed.
- A deeper walk-through of recent manual checks lives in [`TEST_REPORT.md`](TEST_REPORT.md). Open it in GitHub to confirm which screens were exercised and which files changed.
- If the new sections are missing, double-check that your local commits were pushed to GitHub with `git push origin work` (replace `work` with your branch name) and that the GitHub page is pointed at the same branch.
