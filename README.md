![LendDesk loan origination workspace](./screenshot.png)

# LendDesk

LendDesk is a frontend-only loan origination workspace for reviewing incoming applications, tracking each case through its stages, and maintaining a clear view of loan products.

**Live app:** [https://a2rp.github.io/loan-origination-platform/](https://a2rp.github.io/loan-origination-platform/)

## Pages

- **Today** (`/`): workload summary, application flow, and the next cases to review.
- **Applications** (`/applications`): searchable, filterable, sortable application register with create and edit forms.
- **Application details** (`/applications/:id`): borrower and request information, stage progression, document checklist, activity history, and team notes.
- **Underwriting** (`/underwriting`): review queue, sample profile, supporting checklist, and decision controls that require a review note.
- **Loan products** (`/products`): add, edit, archive, restore, and remove loan products with amount and term limits.
- **Not found**: a branded page with links back to the workspace.

## What you can do

- Add an application and validate the required borrower, loan, and employment details.
- Search applications by borrower, ID, or product. Filter by stage or product, sort the register, and clear filters.
- Edit a case, move it to another stage after confirmation, update document checklist items, and add team notes.
- Review a case in the underwriting queue, filter by illustrative score, and record a sample outcome with a required note.
- Create and update loan products, archive or restore them, and delete unused products after confirmation.
- Follow dashboard counts and stage totals as application data changes during the session.
- Use custom confirmation dialogs and toast messages to understand the result of each action.

All names, rates, loan amounts, products, and sample scores are demonstration data. This interface does not submit a loan, assess eligibility, retrieve a credit report, send an offer, or make a lending decision.

## Data behavior

The seeded workspace and your changes are held in React state in the current page session. Changes remain available while navigating between pages, but a full page reload restores the original sample records. No browser storage or backend is used.

## Screenshots

These screenshots were captured from the local production build with representative demo records.

### Pages

| Screen | Preview |
| --- | --- |
| Today dashboard | ![Today dashboard with application flow and review queue](./screenshots/pages/overview.png) |
| Application register | ![Searchable and filterable loan application register](./screenshots/pages/applications.png) |
| Application details | ![Borrower file with stage progress, checklist, activity, and notes](./screenshots/pages/application-detail.png) |
| Underwriting room | ![Underwriting review queue and sample borrower profile](./screenshots/pages/underwriting.png) |
| Loan products | ![Loan products catalogue](./screenshots/pages/loan-products.png) |
| Not found | ![Branded not found page](./screenshots/pages/not-found.png) |
| Mobile dashboard | ![Responsive mobile dashboard](./screenshots/pages/overview-mobile.png) |
| Mobile navigation | ![Mobile navigation expanded](./screenshots/pages/mobile-navigation-open.png) |

### Forms and confirmations

| Dialog | Preview |
| --- | --- |
| New application form | ![New loan application form](./screenshots/modals/application-create.png) |
| Application validation | ![Required field validation in the application form](./screenshots/modals/application-create-validation.png) |
| Edit application | ![Edit loan application form](./screenshots/modals/application-edit.png) |
| Confirm stage change | ![Confirm moving an application to another stage](./screenshots/modals/application-stage-confirm.png) |
| Confirm application deletion | ![Confirm removing an application](./screenshots/modals/application-delete-confirm.png) |
| Confirm underwriting outcome | ![Record a sample underwriting outcome with a review note](./screenshots/modals/underwriting-decision-confirm.png) |
| Add loan product | ![New loan product form](./screenshots/modals/product-create.png) |
| Edit loan product | ![Edit loan product form](./screenshots/modals/product-edit.png) |
| Confirm product archive | ![Confirm archiving a loan product](./screenshots/modals/product-archive-confirm.png) |
| Confirm product restore | ![Confirm restoring an archived loan product](./screenshots/modals/product-restore-confirm.png) |
| Confirm product deletion | ![Confirm removing a loan product](./screenshots/modals/product-delete-confirm.png) |

## Image credit

The local mortgage paperwork image is by [Jakub Żerdzicki on Unsplash](https://unsplash.com/photos/folder-with-house-drawings-and-keys-miniature-houses-sCV3336RlIw). It is stored in `public/assets/mortgage-papers.jpg` and does not load from a remote image URL at runtime.

## Run locally

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Check and deploy

```sh
npm run lint
npm run build
npm run deploy
```

The deploy script builds the app, copies the entry page to `dist/404.html` for GitHub Pages route fallback, and publishes `dist` to the `gh-pages` branch.

**Deployed app:** [https://a2rp.github.io/loan-origination-platform/](https://a2rp.github.io/loan-origination-platform/)

## Future improvements

These are integration extensions beyond the working browser demo:

- Add a backend API and team accounts so application changes can be shared across staff and securely retained between sessions.
- Connect identity verification, credit reporting, and lending systems through production integrations, with explicit review and consent flows.
- Store borrower documents securely and support file uploads with server-side access controls.
- Add role-based permissions and a server-side audit history for changes and lending decisions.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
