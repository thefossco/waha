# WAHA - WhatsApp HTTP API

## Project Overview

WAHA (WhatsApp HTTP API) is an open-source REST API for WhatsApp that allows you to configure and run your own WhatsApp API server.

### Key Features
- Multiple engine support:
  - **WEBJS**: Browser-based engine
  - **NOWEB**: WebSocket Node.js engine
  - **GOWS**: WebSocket Go engine
- REST API interface for WhatsApp operations
- Docker-based deployment
- Self-hosted solution with full control

## Technology Stack

This project typically uses:
- **Backend**: Node.js / TypeScript
- **API**: REST / WebSocket
- **Container**: Docker
- **WhatsApp Integration**: Multiple engine options

## Project Structure

```
waha/
├── src/              # Source code
├── docs/             # Documentation
├── config/           # Configuration files
├── tests/            # Test files
├── docker/           # Docker configurations
└── scripts/          # Utility scripts
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns and conventions
- Write clear, self-documenting code
- Add comments only where logic isn't self-evident

### Security Considerations
- Validate all external inputs (user data, API requests)
- Sanitize data to prevent injection attacks
- Use environment variables for sensitive configuration
- Never commit secrets or credentials
- Follow OWASP security best practices

### Testing
- Write tests for new features
- Ensure existing tests pass before committing
- Test edge cases and error scenarios

## Common Development Tasks

### Setup
```bash
npm install          # Install dependencies
npm run build        # Build the project
npm run dev          # Run in development mode
```

### Docker
```bash
docker build -t waha .                    # Build Docker image
docker run -p 3000:3000 waha             # Run container
docker-compose up                         # Use docker-compose
```

### Testing
```bash
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Git Workflow
- Work on feature branches (preferably starting with `claude/`)
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Push to appropriate branch when ready

## API Documentation

WAHA provides REST API endpoints for:
- Session management
- Message sending/receiving
- Media handling
- Contact management
- Group operations
- Status updates

Refer to the official documentation at: https://waha.devlike.pro/

## Related Resources

- Main Project: https://github.com/devlikeapro/waha
- Documentation: https://github.com/devlikeapro/waha-docs
- Official Website: https://waha.devlike.pro/

## Notes for AI Assistant

### When Working on This Project:
1. **Read before modifying**: Always read existing files before making changes
2. **Maintain consistency**: Follow existing patterns and conventions
3. **Security first**: Validate inputs, sanitize data, prevent injection attacks
4. **Keep it simple**: Avoid over-engineering; solve the immediate problem
5. **Test thoroughly**: Ensure changes don't break existing functionality
6. **Document decisions**: Explain non-obvious implementation choices

### File Operations:
- Prefer editing existing files over creating new ones
- Don't create documentation files unless explicitly requested
- Use TypeScript for new code files
- Follow the existing directory structure

### Git Operations:
- Develop on designated feature branches
- Commit with descriptive messages
- Push only when changes are complete and tested
- Use `git push -u origin <branch-name>` for pushing

## Environment Variables

Common environment variables used in WAHA:
```
WAHA_HTTP_PORT=3000
WAHA_LOG_LEVEL=info
WAHA_SESSIONS_DIR=/sessions
```

Refer to `.env.example` (if present) for complete configuration options.

---

**Last Updated**: 2025-12-14
**Repository**: thefossco/waha
