# DEEL BACKEND TASK

## If I had more time I would:

- Rewrite to Typescript
- Add more tests, especially unit test with DB mock, etc.
- Add better errors handling, messages
- Add better logging
- Dockerize
- Add cache for some requests, for example with Redis or Memcached
- Change folders/files structure to something like controllers, services, routes
- Probably add a few more (composite?) indices after some performance investigation. For example ContractorId + status for "Contracts".

## Assumptions

- No need to specify transactions isolation level as it is always SERIALIZABLE in SQLite.
- Same auth (with profile_id) is applicable for all routes
- In this case no need for advanced security measures: Helmet, Rate limiting, etc.

## Test

```bash
$ npm run test
```
