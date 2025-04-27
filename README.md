# SOT Info Frontend

A modern, responsive frontend application for the School of Technology & Sciences information portal. Built with React and designed to provide an intuitive user experience for students, faculty, and staff.

## Features

- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Interactive Dashboard**: Real-time updates and notifications
- **Course Management**: Browse, search, and add Project , Research etc.
- **User Profiles**: Personalized student and faculty profiles
- **Resource Library**: Access to documentation
- **Event Calendar**: Stay updated with school events and deadlines
- **Integrated Communication**: Announcements

## Tech Stack

- **React**: Frontend library for building user interfaces
- **Redux**: State management
- **React Router**: Navigation and routing
- **Axios**: API requests to backend services
- **Styled Components**: Component-level styling
- **Material UI**: UI component library
- **Jest & React Testing Library**: Unit and integration testing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher)
- npm (v8.x or higher) or yarn (v1.22.x or higher)
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/sot-info-frontend.git
   cd sot-info-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your specific configuration values.

## Running the Application

### Development Mode

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
# or
yarn build
```

The optimized build will be created in the `build` directory.

## API Integration

The frontend connects to the SOT Backend API for data retrieval and updates. Configure the API endpoint in the `api_config.js` file:

## Code Standards

- Follow the Airbnb JavaScript Style Guide
- Use ESLint and Prettier for code formatting
- Write unit tests for components and utilities
- Use TypeScript for type checking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request


## Contact

For questions or support, please contact:
- Email: sost@woxsen.edu.in
- Issue Tracker: GitHub Issues
