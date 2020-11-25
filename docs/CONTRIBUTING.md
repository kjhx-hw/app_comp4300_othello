# Contributing

## Existing user story, feature, or enhancement
To contribute on an existing work item, make sure that it is labeled as `approved`. This means that all the information you need to start and complete the work item is already present. Then, continue as follows:

1. Assign yourself to the work item.
2. Remove the `approved` label and add the `in progress` label.
3. If applicable, associate the work item with a Project or Milestone.
4. Create a new branch with the following pattern:
    * `firstlastinitial/description` (example: `kh/contributing-docs`).

Now, you can complete the work item on your feature branch. Once you're ready to complete the item, perform the following actions:

1. Make sure you lint your code using `npm run lint`.
2. Make sure your branch is up to date with `master`.
3. Open a [new pull request](new-pr) that merges your feature branch into `master`.
4. If the work item is done, label the PR as `needs qa` and assign a reviewer. Otherwise, label it as `in development`.
5. Optionally, use [closing keywords](closing-keywords) to automatically link and close the associated work item when the PR completes.
6. To make the PR automatically merge whenever it is reviewed (and when all tests pass), give it the label `automerge`.

[new-pr]: https://github.com/kjhx/app_comp4300_othello/compare
[closing-keywords]: https://docs.github.com/en/free-pro-team@latest/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword