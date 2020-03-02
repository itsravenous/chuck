# Chucked together
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You know the drill: 

- `yarn`
- `yarn test` (with `--coverage --watchAll=false` for coverage)
- `yarn start`

## Approach
- Test-first: every single line of code was written to make a failing test pass, with the single exception of App.js:32 (see [928b6b9](https://github.com/itsravenous/chuck/commit/928b6b9d9219324f09c514489d79f4af41c768e6) for rationale)
- BEM for CSS.
- Avoiding premature abstractions. With more time and on a larger scale project, the following would become sensible next steps:
  - Extracting shared components and leveraging styled-components or similar to build a library (e.g. the buttons)
  - Extracting the API service into its own module, possibly with its own set of unit tests were it to be more widely consumed
  - Some more picky unhappy test paths for validation, or at least a wider range of inputs. The current tests are of necessity a little naive

See commit trail for stream-of-consciousness notes 🤔
