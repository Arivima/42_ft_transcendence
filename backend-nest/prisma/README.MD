# Run these commands inside the backend container at startup

Enter the container

`docker exec -it backend /bin/bash`

Create a new migration to be applied as last for the addition of check constraints as of our db.

```
npx prisma migrate dev -n check_constraints --create-only
cat constraints/constraints.sql >> migrations/*_check_constraints/migration.sql
```

Update database and prisma client

```
npx prisma migrate dev
```

Launch prisma studio for easy debugging

`npx prisma studio`
