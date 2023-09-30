# Run these commands inside the backend container at startup

Enter the container

`docker exec -it backend /bin/bash`

Update database and prisma client
```
npx prisma migrate dev
```

Launch prisma studio for easy debugging

`npx prisma studio`