<img src="https://github.com/kubeworkz/saashq/blob/main/public/logo.png" width="300">

# SaasHQ Enterprise SaaS Starter Kit

:warning: **This repository is still in an early stage of development.**

The Open Source Next.js SaaS boilerplate for Enterprise SaaS app development.

## Additional Resources

Next.js based SaaS starter kit that saves you months of development by starting you off with all the features that are the same in every product, so you can focus on what makes your app unique. Based on the awesome BoxyHQ Saas starter kit.

## Built With

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Postgres](https://www.postgresql.org)
- [React](https://reactjs.org)
- [Prisma](https://www.prisma.io)
- [TypeScript](https://www.typescriptlang.org)
- [SAML Jackson](https://github.com/boxyhq/jackson) (Provides SAML SSO, Directory Sync)
- [Svix](https://www.svix.com/) (Provides Webhook Orchestration)
- [Retraced](https://github.com/retracedhq/retraced) (Provides Audit Logs Service)

## Getting Started

Please follow these simple steps to get a local copy up and running.

### Prerequisites

- Node.js (Version: >=15.x <17)
- PostgreSQL
- NPM
- Docker compose

### Development

#### 1. Setup

Clone or fork this GitHub repository

```bash
git clone https://github.com/kubeworkz/saashq.git
```

#### 2. Go to the project folder

```bash
cd saashq
```

#### 3. Install dependencies

```bash
npm install
```

#### 4. Set up your .env file

Duplicate `.env.example` to `.env`.

```bash
cp .env.example .env
```

#### 5. Create database (Optional)

To make the process of installing dependencies easier, we offer a `docker-compose.yml` with a Postgres container.

```bash
docker-compose up -d
```

#### 6. Set up database schema

```bash
npx prisma db push
```

#### 7. Start the server

In a development environment:

```bash
npm run dev
```

#### 8. Start the Prisma Studio

Prisma Studio is a visual editor for the data in your database.

```bash
npx prisma studio
```

#### 8. Testing

We are using [Playwright](https://playwright.dev/) to execute E2E tests. Add all tests inside `/tests` folder.

Update `playwright.config.ts` to change playwright configuration.

##### Install Playwright dependencies

```bash
npm run playwright:update
```

##### Run E2E tests

```bash
npm run test:e2e
```

_Note: HTML test report is generated inside the `report` folder. Currently suported browsers for test execution `chromium` and `firefox`_

## Features

- Create account
- Sign in with Email and Password
- Sign in with Magic Link
- Sign in with SAML SSO
- Sign in with Google [[Setting up Google OAuth](https://support.google.com/cloud/answer/6158849?hl=en)]
- Sign in with Github [[Creating a Github OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)]
- Directory Sync (SCIM)
- Update account
- Create project
- Invite users to the project
- Manage project members
- Update project settings
- Webhooks & Events
- Internationalization
- Audit logs

## Roadmap

- [x] Database per project
- [ ] Database management
- [ ] Superadmin Dashboard
- [ ] Billing & subscriptions
- [ ] Novu Notifications
- [ ] Roles and Permissions
- [ ] Unit and integration tests
- [ ] Vector Embedded Search
- [ ] Filesharing & Analytics

## Contributing

Thanks for taking the time to contribute! Contributions make the open-source community a fantastic place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

## Community

- [GitHub Issues](https://github.com/kubeworkz/saashq/issues) (Contributions, report issues and product ideas)

## License

[MIT License](https://github.com/kubeworkz/saashq/blob/main/LICENSE)
