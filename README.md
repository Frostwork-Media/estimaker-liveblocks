# Estimaker

Estimaker is a powerful tool designed for visual forecasting. It serves as a frontend for the [squiggle](https://github.com/quantified-uncertainty/squiggle) probabilistic modeling library, providing an intuitive interface for users to interact with the library's capabilities.

## Setup Instructions

Follow these steps to get Estimaker up and running:

1. Ensure you're using Node.js version 18.
2. Run `pnpm install` to install all the necessary dependencies.
3. Link the project to the Vercel project by executing `vercel link`. When prompted, select the `Good Heart Labs / Estimaker Liveblocks Project`.
4. Run `pnpm env:pull` to fetch the environment variables.

## Development

To run the project locally for development purposes, execute `vercel dev` in the repository root.

## Workflow

To maintain code integrity and version control, work should not be pushed directly to the main branch. Instead, follow these steps for features and bug fixes:

1. Branch off of the main branch.
2. Make your changes in this new branch.
3. Open a pull request to the main branch.
4. Include a comprehensive description of the changes you've made in the pull request.

By adhering to this workflow, we can ensure a clean and manageable codebase.
